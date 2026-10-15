import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi, type AuthUser } from '../services/authApi';
import { idempotencyManager } from '../utils/idempotency';

interface AuthChallenge {
  challengeId: string;
  expiresAt: string;
  cooldownSeconds: number;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  challenge: AuthChallenge | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: { name: string; phone: string; email: string; password: string }) => Promise<{ success: boolean; message: string; code?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string; code?: string }>;
  sendOtp: (email: string, intent?: 'login' | 'signup') => Promise<{ success: boolean; message: string; code?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  resetFlow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [challenge, setChallenge] = useState<AuthChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and check current active session
  useEffect(() => {
    let isMounted = true;
    authApi
      .getMe()
      .then((res) => {
        if (isMounted) {
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sendOtp = useCallback(
    async (email: string, intent?: 'login' | 'signup'): Promise<{ success: boolean; message: string; code?: string }> => {
      setError(null);
      setIsLoading(true);

      // Rotate key to guarantee fresh UUID for this OTP request
      const idempotencyKey = idempotencyManager.rotateKey('SEND_OTP');

      try {
        const response = await authApi.sendOtp(email, idempotencyKey, intent);

        if (response.success && response.data) {
          setChallenge({
            challengeId: response.data.challengeId,
            expiresAt: response.data.expiresAt,
            cooldownSeconds: response.data.cooldownSeconds,
            email,
          });
          idempotencyManager.clearKey('SEND_OTP');
          setIsLoading(false);
          return { success: true, message: response.message };
        } else {
          // If 409 conflict, inform client to retry
          const msg = response.error?.message || response.message;
          const code = response.error?.code;
          setError(msg);
          setIsLoading(false);
          idempotencyManager.clearKey('SEND_OTP');
          return { success: false, message: msg, code };
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to request verification code';
        setError(msg);
        setIsLoading(false);
        idempotencyManager.clearKey('SEND_OTP');
        return { success: false, message: msg };
      }
    },
    []
  );

  const verifyOtp = useCallback(async (otp: string): Promise<{ success: boolean; message: string }> => {
    if (!challenge) {
      setError('No active verification session found. Please enter your email again.');
      return { success: false, message: 'No active challenge' };
    }

    setError(null);
    setIsLoading(true);
    const idempotencyKey = idempotencyManager.rotateKey('VERIFY_OTP');

    try {
      const response = await authApi.verifyOtp(challenge.challengeId, otp, idempotencyKey);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setChallenge(null);
        idempotencyManager.clearKey('VERIFY_OTP');
        setIsLoading(false);
        return { success: true, message: response.message };
      } else {
        const msg = response.error?.message || response.message;
        setError(msg);
        setIsLoading(false);
        idempotencyManager.clearKey('VERIFY_OTP');
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      setIsLoading(false);
      idempotencyManager.clearKey('VERIFY_OTP');
      return { success: false, message: msg };
    }
  }, [challenge]);

  const resendOtp = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!challenge) {
      return { success: false, message: 'No active session' };
    }

    setError(null);
    setIsLoading(true);
    // A resend is a new logical operation; rotate key
    const idempotencyKey = idempotencyManager.rotateKey('RESEND_OTP');

    try {
      const response = await authApi.resendOtp(challenge.challengeId, idempotencyKey);

      if (response.success && response.data) {
        setChallenge({
          challengeId: response.data.challengeId,
          expiresAt: response.data.expiresAt,
          cooldownSeconds: response.data.cooldownSeconds,
          email: challenge.email,
        });
        idempotencyManager.clearKey('RESEND_OTP');
        setIsLoading(false);
        return { success: true, message: response.message };
      } else {
        const msg = response.error?.message || response.message;
        setError(msg);
        setIsLoading(false);
        idempotencyManager.clearKey('RESEND_OTP');
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      setError(msg);
      setIsLoading(false);
      idempotencyManager.clearKey('RESEND_OTP');
      return { success: false, message: msg };
    }
  }, [challenge]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const idempotencyKey = idempotencyManager.rotateKey('LOGOUT');

    try {
      await authApi.logout(idempotencyKey);
    } finally {
      setUser(null);
      setChallenge(null);
      idempotencyManager.clearKey('LOGOUT');
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      phone: string;
      email: string;
      password: string;
    }): Promise<{ success: boolean; message: string; code?: string }> => {
      setError(null);
      setIsLoading(true);
      const idempotencyKey = idempotencyManager.rotateKey('REGISTER');

      try {
        const response = await authApi.register(data, idempotencyKey);

        if (response.success && response.data?.user) {
          setUser(response.data.user);
          idempotencyManager.clearKey('REGISTER');
          setIsLoading(false);
          return { success: true, message: response.message };
        } else {
          const msg = response.error?.message || response.message;
          const code = response.error?.code;
          setError(msg);
          setIsLoading(false);
          idempotencyManager.clearKey('REGISTER');
          return { success: false, message: msg, code };
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
        setIsLoading(false);
        idempotencyManager.clearKey('REGISTER');
        return { success: false, message: msg };
      }
    },
    []
  );

  const loginWithPassword = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; message: string; code?: string }> => {
      setError(null);
      setIsLoading(true);
      const idempotencyKey = idempotencyManager.rotateKey('LOGIN');

      try {
        const response = await authApi.loginWithPassword(email, password, idempotencyKey);

        if (response.success && response.data?.user) {
          setUser(response.data.user);
          idempotencyManager.clearKey('LOGIN');
          setIsLoading(false);
          return { success: true, message: response.message };
        } else {
          const msg = response.error?.message || response.message;
          const code = response.error?.code;
          setError(msg);
          setIsLoading(false);
          idempotencyManager.clearKey('LOGIN');
          return { success: false, message: msg, code };
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Sign in failed';
        setError(msg);
        setIsLoading(false);
        idempotencyManager.clearKey('LOGIN');
        return { success: false, message: msg };
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  const resetFlow = useCallback(() => {
    setChallenge(null);
    setError(null);
    idempotencyManager.clearKey('SEND_OTP');
    idempotencyManager.clearKey('VERIFY_OTP');
    idempotencyManager.clearKey('REGISTER');
    idempotencyManager.clearKey('LOGIN');
  }, []);

  const value = useMemo(
    () => ({
      user,
      challenge,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      register,
      loginWithPassword,
      sendOtp,
      verifyOtp,
      resendOtp,
      logout,
      clearError,
      resetFlow,
    }),
    [
      user,
      challenge,
      isLoading,
      error,
      register,
      loginWithPassword,
      sendOtp,
      verifyOtp,
      resendOtp,
      logout,
      clearError,
      resetFlow,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

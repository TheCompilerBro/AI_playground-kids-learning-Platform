import { generateIdempotencyKey } from '../utils/idempotency';

export interface AuthUser {
  id: string;
  name?: string;
  phone?: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
  hasPassword?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

class AuthApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit & { idempotencyKey?: string }
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Ensure session cookies are sent and received
      });

      // If server rejected due to an idempotency key mismatch (422), auto-retry once with a fresh UUID
      if (response.status === 422 && options.idempotencyKey && !headers['X-Idempotency-Retried']) {
        const freshKey = generateIdempotencyKey();
        return this.request<T>(endpoint, {
          ...options,
          idempotencyKey: freshKey,
          headers: {
            ...headers,
            'X-Idempotency-Retried': 'true',
          },
        });
      }

      const data: ApiResponse<T> = await response.json().catch(() => ({
        success: false,
        message: `HTTP error ${response.status}`,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to parse server response',
        },
      }));

      // Attach HTTP status code to error details for fine-grained UI handling
      if (!response.ok && data.error) {
        data.error.details = {
          ...data.error.details,
          httpStatus: response.status,
          retryAfter: response.headers.get('Retry-After'),
        };
      }

      return data;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Network communication failed',
        data: null,
        error: {
          code: 'CONNECTION_FAILED',
          message: 'Failed to reach authentication server. Please check your connection.',
        },
      };
    }
  }

  async sendOtp(
    email: string,
    idempotencyKey: string,
    intent?: 'login' | 'signup'
  ): Promise<ApiResponse<{ challengeId: string; expiresAt: string; cooldownSeconds: number }>> {
    return this.request('/api/auth/send-otp', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify({ email, intent }),
    });
  }

  async verifyOtp(challengeId: string, otp: string, idempotencyKey: string): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request('/api/auth/verify-otp', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify({ challengeId, otp }),
    });
  }

  async resendOtp(challengeId: string, idempotencyKey: string): Promise<ApiResponse<{ challengeId: string; expiresAt: string; cooldownSeconds: number }>> {
    return this.request('/api/auth/resend-otp', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify({ challengeId }),
    });
  }

  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request('/api/auth/me', {
      method: 'GET',
    });
  }

  async register(
    data: { name: string; phone: string; email: string; password: string },
    idempotencyKey: string
  ): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request('/api/auth/register', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify(data),
    });
  }

  async loginWithPassword(
    email: string,
    password: string,
    idempotencyKey: string
  ): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(idempotencyKey: string): Promise<ApiResponse<null>> {
    return this.request('/api/auth/logout', {
      method: 'POST',
      idempotencyKey,
    });
  }
}

export const authApi = new AuthApiClient();


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/auth/OtpInput';
import { CooldownTimer } from '../components/auth/CooldownTimer';
import { PageContainer } from '../components/layout/PageContainer';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface LoginPageProps {
  defaultMode?: 'login' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultMode = 'login' }) => {
  const {
    user,
    challenge,
    isLoading,
    error,
    register,
    loginWithPassword,
    sendOtp,
    verifyOtp,
    resendOtp,
    resetFlow,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode: 'login' | 'signup'
  const urlMode =
    searchParams.get('mode') === 'signup'
      ? 'signup'
      : searchParams.get('mode') === 'login'
      ? 'login'
      : null;
  const [mode, setMode] = useState<'login' | 'signup'>(urlMode || defaultMode);

  // Sign In method: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Form Fields
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // Notices & Specific Errors
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [formValidationNotice, setFormValidationNotice] = useState<string | null>(null);
  const [specificError, setSpecificError] = useState<{
    code: string;
    message: string;
  } | null>(null);

  // Redirection target
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const destinationPath = fromLocation || (mode === 'signup' ? '/learn' : '/dashboard');

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(destinationPath, { replace: true });
    }
  }, [user, navigate, destinationPath]);

  // Sync mode with URL param
  useEffect(() => {
    if (urlMode && urlMode !== mode) {
      setMode(urlMode);
      setSpecificError(null);
      setFormValidationNotice(null);
      clearError();
    }
  }, [urlMode, mode, clearError]);

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    if (newMode === mode) return;
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setSpecificError(null);
    setFormValidationNotice(null);
    clearError();
    setSuccessNotice(null);
  };

  // Sign Up Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationNotice(null);
    setSpecificError(null);
    clearError();
    setSuccessNotice(null);

    if (nameInput.trim().length < 2) {
      setFormValidationNotice("Parent's full name must be at least 2 characters.");
      return;
    }
    if (phoneInput.trim().length < 7) {
      setFormValidationNotice('Please enter a valid contact phone number (at least 7 digits).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      setFormValidationNotice('Please enter a valid email address.');
      return;
    }
    if (passwordInput.length < 6) {
      setFormValidationNotice('Password must be at least 6 characters long.');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setFormValidationNotice('Passwords do not match. Please verify your password.');
      return;
    }

    const result = await register({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      email: emailInput.trim(),
      password: passwordInput,
    });

    if (result.success) {
      navigate(destinationPath, { replace: true });
    } else if (result.code) {
      setSpecificError({
        code: result.code,
        message: result.message,
      });
    } else {
      setFormValidationNotice(result.message || 'Registration could not be completed. Please check your details.');
    }
  };

  // Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationNotice(null);
    setSpecificError(null);
    clearError();
    setSuccessNotice(null);

    if (!emailInput.trim()) {
      setFormValidationNotice('Please enter your email address.');
      return;
    }
    if (!passwordInput) {
      setFormValidationNotice('Please enter your password.');
      return;
    }

    const result = await loginWithPassword(emailInput.trim(), passwordInput);
    if (result.success) {
      navigate(destinationPath, { replace: true });
    } else if (result.code) {
      setSpecificError({
        code: result.code,
        message: result.message,
      });
    }
  };

  // OTP Request Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setFormValidationNotice(null);
    setSuccessNotice(null);
    setSpecificError(null);
    clearError();

    const result = await sendOtp(emailInput.trim(), 'login');
    if (result.success) {
      setIsCooldownActive(true);
      setSuccessNotice('A 6-digit verification code has been dispatched to your email.');
    } else if (result.code) {
      setSpecificError({
        code: result.code,
        message: result.message,
      });
    }
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpInput.length !== 6) return;

    setSuccessNotice(null);
    const result = await verifyOtp(otpInput);
    if (result.success) {
      navigate(destinationPath, { replace: true });
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    setSuccessNotice(null);
    const result = await resendOtp();
    if (result.success) {
      setOtpInput('');
      setIsCooldownActive(true);
      setSuccessNotice('A fresh verification code has been sent.');
    }
  };

  const handleBackToEmail = () => {
    resetFlow();
    setOtpInput('');
    setSpecificError(null);
    setSuccessNotice(null);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto my-10 sm:my-16 px-4">
        {/* Friendly banner when redirected from a protected activity */}
        {fromLocation && !challenge && (
          <div className="mb-6 p-4 rounded-2xl bg-[#DDF3FF] border border-[#BDE5FF] text-[#0369A1] text-xs sm:text-sm flex items-start gap-3 shadow-xs animate-in fade-in duration-300">
            <Sparkles className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-sm">Account Required for Activities</span>
              <span>
                Please {mode === 'login' ? 'sign in' : 'create a parent account'} to access this activity and track your learning progress!
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8F0] shadow-xl shadow-slate-100">
          {/* Top Mode Segmented Switcher (Visible before OTP challenge) */}
          {!challenge && (
            <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl mb-8 border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#6558E8] shadow-xs'
                    : 'text-slate-500 hover:text-[#17233C]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#6558E8] shadow-xs'
                    : 'text-slate-500 hover:text-[#17233C]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6558E8]/10 text-[#6558E8] mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] tracking-tight font-['Nunito']">
              {challenge
                ? 'Enter Verification Code'
                : mode === 'signup'
                ? 'Create Parent Account'
                : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              {challenge
                ? `We sent a 6-digit code to ${challenge.email}`
                : mode === 'signup'
                ? 'Register with your details to access lessons and manage child safety.'
                : 'Sign in with your password or one-time verification code.'}
            </p>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Client Form Validation Error */}
          {formValidationNotice && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formValidationNotice}</span>
            </div>
          )}

          {/* Actionable Error: User Not Found when trying to Login */}
          {specificError?.code === 'USER_NOT_FOUND' && mode === 'login' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                No Account Found
              </div>
              <p className="text-xs sm:text-sm text-amber-700">
                There is no existing account for <span className="font-semibold text-slate-800">{emailInput}</span>. You must create an account first!
              </p>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Account with this Email
              </button>
            </div>
          )}

          {/* Actionable Error: User Already Exists when trying to Signup */}
          {specificError?.code === 'USER_ALREADY_EXISTS' && mode === 'signup' && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-indigo-800">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                Account Already Exists
              </div>
              <p className="text-xs sm:text-sm text-indigo-700">
                An account with <span className="font-semibold text-slate-800">{emailInput}</span> already exists. Please sign in instead!
              </p>
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In with this Email
              </button>
            </div>
          )}

          {/* No Password Set on Account -> Suggest OTP */}
          {specificError?.code === 'NO_PASSWORD_SET' && (
            <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sky-800">
                <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
                Email OTP Required
              </div>
              <p className="text-xs sm:text-sm text-sky-700">
                This account was created without a password. Sign in using Email OTP code instead!
              </p>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                Sign In with Email OTP
              </button>
            </div>
          )}

          {/* Incorrect Password Error */}
          {specificError?.code === 'INVALID_CREDENTIALS' && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                Incorrect Password
              </div>
              <p className="text-xs sm:text-sm text-red-700">
                {specificError.message}
              </p>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6558E8] hover:underline"
              >
                Prefer to sign in with Email OTP code?
              </button>
            </div>
          )}

          {/* Generic Error Banner */}
          {error && !specificError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. CREATE ACCOUNT MODE (Full Name, Phone, Email, Password) */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                  Parent's Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-sm sm:text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0192 or 9876543210"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-sm sm:text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="parent@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-sm sm:text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-sm sm:text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-sm sm:text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center py-4 text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create Parent Account
                    </span>
                  )}
                </PrimaryButton>
              </div>

              <div className="text-center text-xs text-slate-400 pt-2">
                🔒 Safe & secure. Supports both password sign-in and one-time email codes.
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. SIGN IN MODE (Email + Password OR Email + OTP)         */}
          {/* ========================================================= */}
          {mode === 'login' && !challenge && (
            <div className="space-y-5">
              {/* Login Method Sub-Switcher */}
              <div className="flex items-center justify-center p-1 bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setSpecificError(null);
                    clearError();
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white text-[#6558E8] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setSpecificError(null);
                    clearError();
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-white text-[#6558E8] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Email & OTP Code
                </button>
              </div>

              {/* Sub-mode A: Login with Password */}
              {loginMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-semibold text-[#17233C] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="login-password" className="block text-sm font-semibold text-[#17233C]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('otp')}
                        className="text-xs font-medium text-[#6558E8] hover:underline"
                      >
                        Sign in with OTP instead?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your account password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <PrimaryButton
                    type="submit"
                    data-testid="password-login-submit"
                    disabled={isLoading || !emailInput.trim() || !passwordInput}
                    className="w-full justify-center py-4 text-base"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </span>
                    )}
                  </PrimaryButton>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#6558E8] transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Don't remember your password? Sign in with Email OTP
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-mode B: Login with Email & OTP */}
              {loginMethod === 'otp' && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label htmlFor="otp-email" className="block text-sm font-semibold text-[#17233C] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="otp-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-[#E8E8F0] rounded-2xl text-[#17233C] text-base focus:bg-white focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/10 transition-all outline-hidden disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={isLoading || !emailInput.trim()}
                    className="w-full justify-center py-4 text-base"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending Code...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Send 6-Digit Code
                      </span>
                    )}
                  </PrimaryButton>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#6558E8] transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Know your password? Sign in with Password instead
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. STEP 2: VERIFY OTP FORM (When OTP code is requested)   */}
          {/* ========================================================= */}
          {mode === 'login' && challenge && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="py-2">
                <OtpInput
                  value={otpInput}
                  onChange={(val) => {
                    setOtpInput(val);
                    if (val.length === 6) {
                      verifyOtp(val).then((res) => {
                        if (res.success) {
                          navigate(destinationPath, { replace: true });
                        }
                      });
                    }
                  }}
                  disabled={isLoading}
                />
              </div>

              <PrimaryButton
                type="submit"
                disabled={isLoading || otpInput.length !== 6}
                className="w-full justify-center py-4 text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying Code...
                  </span>
                ) : (
                  'Verify & Sign In'
                )}
              </PrimaryButton>

              {/* Resend Cooldown Section */}
              <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-3">
                {isCooldownActive ? (
                  <CooldownTimer
                    initialSeconds={challenge.cooldownSeconds || 60}
                    onFinished={() => setIsCooldownActive(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6558E8] hover:text-[#5145CF] transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Didn't receive code? Resend
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Use a different email or sign in with password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

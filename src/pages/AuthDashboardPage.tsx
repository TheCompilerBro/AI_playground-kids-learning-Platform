import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageContainer } from '../components/layout/PageContainer';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import {
  ShieldCheck,
  LogOut,
  User,
  Key,
  Database,
  Lock,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const AuthDashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user && !isLoading) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto my-12 px-4">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8F0] shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#DDF7E8] text-emerald-600 flex items-center justify-center font-bold text-2xl">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17233C]">
                    Authenticated Dashboard
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Active Session
                  </span>
                </div>
                <p className="text-slate-500 mt-1">
                  Signed in as <strong className="text-slate-800">{user?.email}</strong>
                </p>
              </div>
            </div>

            <SecondaryButton
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-2 shrink-0 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </SecondaryButton>
          </div>

          {/* Account & Security Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold mb-2">
                <User className="w-5 h-5 text-[#6558E8]" />
                User Account
              </div>
              <p className="text-xs text-slate-500 break-all">ID: {user?.id}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Verified via Email OTP</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold mb-2">
                <Lock className="w-5 h-5 text-[#6558E8]" />
                Session Security
              </div>
              <p className="text-xs text-slate-500">HttpOnly, SameSite, Secure Cookie</p>
              <p className="text-xs text-slate-500 mt-1">60-minute inactivity sliding TTL</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold mb-2">
                <Key className="w-5 h-5 text-[#6558E8]" />
                Idempotency Engine
              </div>
              <p className="text-xs text-slate-500">End-to-End Idempotency Active</p>
              <p className="text-xs text-slate-500 mt-1">UUID v4 Scoped Lease Protection</p>
            </div>
          </div>
        </div>

        {/* System Architecture & Production Safeguards Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8F0]">
          <h2 className="text-xl font-bold text-[#17233C] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#6558E8]" />
            Active Production Safeguards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <Database className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Transactional Email Outbox</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  OTPs are encrypted with AES-256-GCM and scheduled atomically in MongoDB before dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <Lock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">HMAC-SHA-256 Hashing</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plaintext OTPs are never stored. Constant-time verification prevents timing attacks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <Layers className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Atomic Attempt Counting</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 maximum failed attempts per challenge; concurrency-safe single consumption.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <Key className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Zero Credential Storage in LocalStorage</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authentication state is managed strictly via server sessions and HttpOnly cookies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};


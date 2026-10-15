import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { LEARNING_BANDS } from '../data/learningBands';
import { BADGES } from '../data/badges';
import { PageContainer } from '../components/layout/PageContainer';
import { RobotMascot } from '../components/ui/RobotMascot';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import type { LearningBand } from '../types';
import {
  User,
  Shield,
  Award,
  CheckCircle2,
  LogOut,
  SlidersHorizontal,
  Mail,
  Phone,
  Sparkles,
  Lock,
  Compass,
  Search,
  Lightbulb,
  Save,
  Check,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { progress, stats, setNickname, setLearningBand } = useProgress();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'learner' | 'account' | 'security'>('learner');
  const [nicknameInput, setNicknameInput] = useState(progress.nickname || '');
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'celebrating' | 'curious' | 'thinking'>('happy');

  const currentBand = LEARNING_BANDS[progress.selectedBand] || LEARNING_BANDS.explorer;

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      setNickname(nicknameInput.trim());
      setNicknameSaved(true);
      setTimeout(() => setNicknameSaved(false), 2500);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const earnedBadges = BADGES.filter((b) => progress.earnedBadgeIds.includes(b.id));

  const scores = Object.values(progress.lessonProgress)
    .map((lp) => lp.score)
    .filter((s) => s > 0);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;

  return (
    <PageContainer size="default">
      <div className="space-y-8 sm:space-y-10">
        {/* Profile Hero Header */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentBand.color }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              <div className="relative group shrink-0">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-3 flex items-center justify-center border-2 border-white shadow-md transition-transform group-hover:scale-105"
                  style={{ backgroundColor: currentBand.accentBg }}
                >
                  <RobotMascot mood={mascotMood} size={90} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-[#E8E8F0] shadow-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className="text-xs font-extrabold px-3 py-1 rounded-full text-[#17233C]"
                    style={{ backgroundColor: currentBand.accentBg }}
                  >
                    Level: {currentBand.name} ({currentBand.ageRange})
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Member
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-[#17233C] font-['Nunito'] tracking-tight">
                  {progress.nickname || user?.name || 'Curious Learner'}
                </h1>

                <p className="text-sm text-[#64748B] flex items-center justify-center sm:justify-start gap-2 font-medium">
                  <Mail className="w-4 h-4 text-[#6558E8]" />
                  <span>{user?.email}</span>
                  {user?.phone && (
                    <>
                      <span>•</span>
                      <Phone className="w-4 h-4 text-[#6558E8]" />
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <SecondaryButton
                onClick={handleLogout}
                disabled={authLoading}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 flex items-center gap-2 text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>{authLoading ? 'Signing out...' : 'Sign Out'}</span>
              </SecondaryButton>
            </div>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#E8E8F0]">
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] text-center">
              <div className="text-2xl font-black text-[#6558E8]">{stats.completedCount}</div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Lessons Done</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] text-center">
              <div className="text-2xl font-black text-[#10B981]">{stats.earnedBadgesCount}</div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Badges Earned</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] text-center">
              <div className="text-2xl font-black text-[#F59E0B]">{progress.labTrialsCompleted}</div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Lab Tests</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] text-center">
              <div className="text-2xl font-black text-[#EC4899]">{averageScore}%</div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Quiz Accuracy</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E8E8F0] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('learner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'learner'
                ? 'bg-[#6558E8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Learner Profile & Level</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'account'
                ? 'bg-[#6558E8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Parent & Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-[#6558E8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#17233C] hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Safeguards</span>
          </button>
        </div>

        {/* TAB 1: Learner Profile & Customization */}
        {activeTab === 'learner' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Mascot Avatar & Nickname Customizer */}
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] mb-2 font-['Nunito'] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#6558E8]" />
                Personalize Your Robot Companion
              </h2>
              <p className="text-sm text-[#64748B] mb-6">
                Choose how your robot avatar feels today and customize your learning nickname.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Robot Mood Selection */}
                <div>
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-3">
                    Robot Mascot Expression
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['happy', 'celebrating', 'curious', 'thinking'] as const).map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setMascotMood(mood)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                          mascotMood === mood
                            ? 'border-[#6558E8] bg-[#DDF3FF]/40 shadow-xs scale-105'
                            : 'border-[#E8E8F0] bg-white hover:border-[#6558E8]/40'
                        }`}
                      >
                        <RobotMascot mood={mood} size={48} />
                        <span className="text-[11px] font-bold text-[#17233C] capitalize mt-2">
                          {mood}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nickname Form */}
                <form onSubmit={handleSaveNickname} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                      Explorer Nickname
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        placeholder="e.g. Leo the Explorer, Maya..."
                        maxLength={25}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E8F0] focus:outline-[#6558E8] font-bold text-[#17233C] text-sm bg-[#FFFDF8]"
                      />
                    </div>
                    <span className="text-xs text-[#64748B] mt-1 block">
                      This nickname is displayed on your dashboard, certificate, and badge shelves.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <PrimaryButton
                      type="submit"
                      size="sm"
                      icon={nicknameSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                    >
                      {nicknameSaved ? 'Saved Successfully!' : 'Save Nickname'}
                    </PrimaryButton>
                    {nicknameSaved && (
                      <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                        ✓ Nickname updated!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Learning Band Level Switcher */}
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] font-['Nunito'] flex items-center gap-2">
                    <SlidersHorizontal className="w-6 h-6 text-[#6558E8]" />
                    Learning Band & Curriculum Level
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    Select the age-tailored band that best fits your curiosity. You can switch levels anytime!
                  </p>
                </div>
                <span className="text-xs font-bold text-[#6558E8] bg-[#DDF3FF] px-3 py-1.5 rounded-full shrink-0">
                  Current: {currentBand.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(LEARNING_BANDS).map((band) => {
                  const isSelected = progress.selectedBand === band.id;
                  const Icon = band.id === 'explorer' ? Compass : band.id === 'detective' ? Search : Lightbulb;
                  return (
                    <div
                      key={band.id}
                      onClick={() => setLearningBand(band.id as LearningBand)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#6558E8] bg-white ring-4 ring-[#6558E8]/15 shadow-md -translate-y-1'
                          : 'border-[#E8E8F0] bg-[#FFFDF8] hover:border-[#6558E8]/40 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                            style={{ backgroundColor: band.color }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full text-[#17233C]"
                            style={{ backgroundColor: band.accentBg }}
                          >
                            {band.ageRange}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#17233C] font-['Nunito'] mb-1">
                          {band.name}
                        </h3>
                        <p className="text-xs font-bold text-[#6558E8] uppercase tracking-wide mb-2">
                          {band.badgeTitle}
                        </p>
                        <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                          {band.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E8E8F0]">
                        {isSelected ? (
                          <span className="text-xs font-extrabold text-[#6558E8] flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Active Learning Level
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-[#64748B] hover:text-[#17233C]">
                            Switch to this level →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Earned Badges Showcase */}
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] font-['Nunito'] flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#F59E0B]" />
                    Badges & Achievements Shelf
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    Unlocked {earnedBadges.length} of {BADGES.length} official badges.
                  </p>
                </div>
                <Link
                  to="/progress"
                  className="text-xs sm:text-sm font-bold text-[#6558E8] hover:underline"
                >
                  View full progress page →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {BADGES.map((badge) => {
                  const isEarned = progress.earnedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isEarned
                          ? 'border-[#FFE9A8] bg-[#FFFDF8] shadow-xs'
                          : 'border-slate-100 bg-slate-50 opacity-50 grayscale'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="text-xs font-extrabold text-[#17233C] leading-snug line-clamp-1">
                        {badge.name}
                      </h4>
                      <p className="text-[10px] text-[#64748B] mt-0.5">
                        {isEarned ? 'Unlocked' : 'Locked'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Parent & Account Details */}
        {activeTab === 'account' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] mb-4 font-['Nunito'] flex items-center gap-2">
                <User className="w-6 h-6 text-[#6558E8]" />
                Parent & Account Holder Information
              </h2>
              <p className="text-sm text-[#64748B] mb-6">
                This account manages authentication, parental permissions, and safe session storage.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Account Holder Name</span>
                  <p className="text-base font-bold text-[#17233C]">{user?.name || 'Guardian'}</p>
                  <p className="text-xs text-[#64748B]">Parent or Legal Guardian registered for this learning profile.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Registered Email Address</span>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-[#17233C]">{user?.email}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">Used for secure passwordless Email OTP verification.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Contact Phone</span>
                  <p className="text-base font-bold text-[#17233C]">{user?.phone || 'Not provided'}</p>
                  <p className="text-xs text-[#64748B]">Optional phone contact for parent notifications.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">User Account Identifier</span>
                  <p className="text-xs font-mono text-slate-700 break-all">{user?.id}</p>
                  <p className="text-xs text-[#64748B]">Unique cryptographic user ID in the system.</p>
                </div>
              </div>

              {/* Parent Controls link banner */}
              <div className="mt-8 p-6 rounded-2xl bg-[#DDF3FF]/60 border border-[#BDE3FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#6558E8] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#17233C] text-sm">Parent & Guardian Controls Area</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Access curriculum guidance, conversation starters, data transparency, and safety verification.
                    </p>
                  </div>
                </div>
                <Link
                  to="/parent"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors whitespace-nowrap shrink-0"
                >
                  Open Grown-Ups Area →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security & Safeguards */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17233C] mb-4 font-['Nunito'] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                Security, Privacy & Session Protection
              </h2>
              <p className="text-sm text-[#64748B] mb-6">
                AI Playground enforces enterprise-grade security and child data protection standards.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                    <Lock className="w-5 h-5 text-[#6558E8]" />
                    <span>HttpOnly Session</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero authentication tokens in localStorage. Your session is protected by HttpOnly, SameSite, Secure cookies.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>AES-256-GCM Outbox</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transactional email delivery payloads are encrypted at rest with AES-256-GCM authenticated encryption.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                    <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                    <span>Strict Idempotency</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All authentication actions are guarded by scoped UUID v4 idempotency keys preventing double-requests and replay attacks.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Session expires automatically after 60 minutes of inactivity.
                </p>
                <SecondaryButton
                  onClick={handleLogout}
                  disabled={authLoading}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 flex items-center gap-2 text-xs sm:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session & Sign Out</span>
                </SecondaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

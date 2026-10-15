import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  Shield,
  FlaskConical,
  BookOpen,
  Award,
  UserCheck,
  LogIn,
  UserPlus,
  User,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../context/AuthContext';

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { progress } = useProgress();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const hasStarted = progress.completedLessonIds.length > 0;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Sparkles },
    { to: '/lessons', label: 'Lessons', icon: BookOpen },
    { to: '/lab', label: 'AI Lab', icon: FlaskConical },
    { to: '/progress', label: 'Progress', icon: Award },
    { to: '/safety', label: 'Safety', icon: Shield },
  ];

  const handleStartActivity = () => {
    const target = hasStarted ? '/dashboard' : '/learn';
    if (!user) {
      navigate('/login?mode=signup', { state: { from: { pathname: target } } });
    } else {
      navigate(target);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8F0]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 h-20 flex items-center justify-between gap-3 xl:gap-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-[#6558E8] rounded-xl p-1 shrink-0"
          aria-label="AI Playground home"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#6558E8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
              <rect x="8" y="10" width="24" height="20" rx="7" fill="#FFFFFF" />
              <line x1="20" y1="4" x2="20" y2="10" stroke="#FFE9A8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="20" cy="4" r="2.5" fill="#FFB7A8" />
              <circle cx="15" cy="18" r="2.5" fill="#6558E8" />
              <circle cx="25" cy="18" r="2.5" fill="#6558E8" />
              <path d="M16 24C17.5 25.5 22.5 25.5 24 24" stroke="#17233C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-extrabold text-lg sm:text-xl xl:text-2xl tracking-tight text-[#17233C] font-['Nunito'] whitespace-nowrap shrink-0">
            AI Playground
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0" aria-label="Main navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#DDF3FF] text-[#6558E8]'
                      : 'text-[#64748B] hover:text-[#17233C] hover:bg-[#F8F7F2]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Header Right CTA */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 xl:gap-3">
              {/* Profile Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold bg-[#F8F7F2] hover:bg-[#E8E8F0] text-[#17233C] transition-colors border border-[#E8E8F0] shadow-2xs cursor-pointer"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6558E8] text-white flex items-center justify-center text-xs font-black shrink-0">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <span className="whitespace-nowrap max-w-[130px] truncate">
                    {progress.nickname || (user.name ? user.name.split(' ')[0] : 'Profile')}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E8E8F0] shadow-xl p-3 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-[#FFFDF8] rounded-xl border border-[#E8E8F0] mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center font-bold text-base shrink-0">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-black text-[#17233C] truncate">
                              {progress.nickname || user.name || 'Explorer'}
                            </p>
                            <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#DDF7E8] text-emerald-800 uppercase tracking-wide">
                              {progress.selectedBand}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-semibold text-[#17233C]">
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F8F7F2] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#6558E8]" />
                          <span>My Profile & Level</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F8F7F2] transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-[#6558E8]" />
                          <span>Learning Dashboard</span>
                        </Link>

                        <Link
                          to="/progress"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F8F7F2] transition-colors"
                        >
                          <Award className="w-4 h-4 text-[#F59E0B]" />
                          <span>Badges & Achievements</span>
                        </Link>

                        <Link
                          to="/parent"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F8F7F2] transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-[#10B981]" />
                          <span>Parent Controls</span>
                        </Link>
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#E8E8F0]">
                        <button
                          type="button"
                          onClick={async () => {
                            setProfileMenuOpen(false);
                            await logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartActivity}
                className="px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-xs xl:text-sm font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs hover:shadow-sm whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{hasStarted ? 'My Dashboard' : 'Start Learning'}</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login?mode=login"
                className="px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-xs font-bold text-[#6558E8] hover:text-[#5145CF] hover:bg-[#6558E8]/10 transition-colors border border-[#6558E8]/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-xs font-bold bg-[#6558E8]/10 text-[#6558E8] hover:bg-[#6558E8]/20 transition-colors border border-[#6558E8]/20 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Create Account</span>
              </Link>
              <button
                onClick={handleStartActivity}
                className="px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-xs xl:text-sm font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs hover:shadow-sm whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Start Learning</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile / Tablet menu controls (< lg) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={handleStartActivity}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">{hasStarted && user ? 'My Dashboard' : 'Start Learning'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#E8E8F0] text-[#17233C] hover:bg-[#F8F7F2] focus-visible:outline-[#6558E8] shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E8F0] bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold ${
                    isActive
                      ? 'bg-[#DDF3FF] text-[#6558E8]'
                      : 'text-[#17233C] hover:bg-[#F8F7F2]'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-[#6558E8]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-[#E8E8F0] space-y-2">
            {user ? (
              <div className="p-3 bg-[#FFFDF8] rounded-2xl border border-[#E8E8F0] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6558E8] text-white flex items-center justify-center font-bold text-base shrink-0">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-[#17233C] truncate">
                      {progress.nickname || user.name || 'Explorer'}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center rounded-xl text-xs font-bold bg-[#6558E8] text-white flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      navigate('/login');
                    }}
                    className="py-2.5 px-3 text-center rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center rounded-xl text-sm font-bold border border-[#6558E8]/30 text-[#6558E8] hover:bg-[#6558E8]/5 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center rounded-xl text-sm font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Create Account</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleStartActivity();
              }}
              className="w-full py-3.5 rounded-2xl text-center text-base font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] shadow-xs transition-colors"
            >
              {hasStarted && user ? 'My Dashboard' : 'Start Learning'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

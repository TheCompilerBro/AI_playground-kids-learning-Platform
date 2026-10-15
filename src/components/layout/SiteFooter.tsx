import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E8E8F0] mt-auto">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6558E8] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-[#17233C] font-['Nunito']">
                AI Playground
              </span>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-md">
              Big ideas. Little experiments. A playful, child-safe learning platform introducing children aged 5–10 to artificial intelligence, patterns, and model limitations.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#065F46] bg-[#DDF7E8] px-3 py-1.5 rounded-full w-fit font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero child data collection • 100% Curated & Local</span>
            </div>
          </div>

          {/* Learn & Explore Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#17233C] tracking-wide uppercase">
              Play & Learn
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learn" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Choose Learning Band
                </Link>
              </li>
              <li>
                <Link to="/lessons" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Lesson Library
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  AI Lab (Image Classifier)
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Badges & Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Grown-Ups */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#17233C] tracking-wide uppercase">
              Trust & Parents
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/parent" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Parent & Guardian Area
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Safety & Ethics Guide
                </Link>
              </li>
              <li>
                <Link to="/safety#limitations" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  AI Limitations
                </Link>
              </li>
              <li>
                <Link to="/safety#privacy" className="text-[#64748B] hover:text-[#6558E8] transition-colors">
                  Privacy Policy & Data
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E8E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 AI Playground. Designed for curious young minds.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for young learners</span>
            <Heart className="w-3.5 h-3.5 text-[#FFB7A8] fill-[#FFB7A8]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

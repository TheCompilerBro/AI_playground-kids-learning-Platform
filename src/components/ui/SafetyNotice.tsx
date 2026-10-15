import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SafetyNoticeProps {
  compact?: boolean;
  className?: string;
}

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({
  compact = false,
  className = '',
}) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-[#DDF3FF]/60 border border-[#BDE3FF] rounded-xl text-xs text-[#17233C] ${className}`}>
        <Info className="w-4 h-4 text-[#0284C7] shrink-0" />
        <p className="flex-1">
          <strong className="font-semibold">Friendly Reminder:</strong> AI can make mistakes. Always check important answers with a parent or teacher.
        </p>
        <Link to="/safety" className="text-[#6558E8] font-bold hover:underline shrink-0 ml-1">
          Learn more
        </Link>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-[#DDF3FF]/60 border border-[#BDE3FF] rounded-2xl relative overflow-hidden ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-[#17233C] mb-1">
            Child-Safe AI Playground Commitment
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            We believe technology is best explored with curiosity and honesty. This website uses curated, age-appropriate lessons and safe local demonstrations. We do not collect names, addresses, or photos, and we never claim AI is infallible.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/safety" className="text-[#6558E8] hover:underline flex items-center gap-1">
              Read our Safety Guide →
            </Link>
            <Link to="/parent" className="text-[#64748B] hover:text-[#17233C]">
              Parent & Guardian Area
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

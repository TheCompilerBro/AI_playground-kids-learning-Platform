import React from 'react';
import { CheckCircle2, Sparkles, Compass, Search, Lightbulb } from 'lucide-react';
import type { LearningBandInfo } from '../../types';

interface LearningBandCardProps {
  band: LearningBandInfo;
  isSelected: boolean;
  onSelect: () => void;
}

export const LearningBandCard: React.FC<LearningBandCardProps> = ({
  band,
  isSelected,
  onSelect,
}) => {
  const getBandIcon = () => {
    switch (band.id) {
      case 'explorer':
        return Compass;
      case 'detective':
        return Search;
      case 'creator':
        return Lightbulb;
      default:
        return Sparkles;
    }
  };

  const Icon = getBandIcon();

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between
        ${
          isSelected
            ? 'bg-white border-[#6558E8] shadow-md ring-4 ring-[#6558E8]/15 -translate-y-1'
            : 'bg-white/80 border-[#E8E8F0] hover:border-[#6558E8]/40 hover:bg-white hover:shadow-sm'
        }
      `}
    >
      {/* Top row with icon & selection badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: band.color }}
          >
            <Icon className="w-8 h-8" />
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-[#17233C]"
              style={{ backgroundColor: band.accentBg }}
            >
              {band.ageRange}
            </span>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-[#6558E8] text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-[#17233C] mb-1 font-['Nunito']">
          {band.name}
        </h3>
        <p className="text-xs font-bold text-[#6558E8] mb-3 uppercase tracking-wider">
          {band.badgeTitle}
        </p>

        <p className="text-sm text-[#64748B] leading-relaxed mb-5">
          {band.description}
        </p>
      </div>

      {/* Focus tags */}
      <div>
        <h4 className="text-xs font-bold text-[#17233C] mb-2 uppercase tracking-wide">
          What you'll explore:
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {band.focus.map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-[#F8F7F2] text-[#475569] px-2.5 py-1 rounded-lg border border-[#E8E8F0]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import * as Icons from 'lucide-react';
import type { Badge } from '../../types';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked,
  onClick,
}) => {
  // Dynamically resolve icon from Lucide React
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] || Icons.Award;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200
        ${isUnlocked
          ? 'bg-white border-[#E8E8F0] shadow-sm hover:shadow-md hover:border-[#6558E8]/40'
          : 'bg-[#F8F8FC] border-dashed border-[#D8D8E5] opacity-60'
        }
      `}
    >
      {/* Icon Disc */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 shadow-xs
          ${isUnlocked
            ? 'text-white'
            : 'bg-[#E8E8F0] text-[#94A3B8]'
          }
        `}
        style={{
          backgroundColor: isUnlocked ? badge.accentColor : undefined,
        }}
      >
        {isUnlocked ? (
          <IconComponent className="w-8 h-8" />
        ) : (
          <Icons.Lock className="w-7 h-7" />
        )}
      </div>

      {/* Badge Name */}
      <h4 className="font-bold text-base text-[#17233C] mb-1">
        {badge.name}
      </h4>

      {/* Description */}
      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
        {isUnlocked ? badge.description : 'Locked — Complete the lesson or lab activity to earn!'}
      </p>

      {/* Unlocked tag */}
      <div className="mt-3">
        {isUnlocked ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF7E8] text-[#065F46]">
            <Icons.CheckCircle2 className="w-3 h-3" /> Unlocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8E8F0] text-[#64748B]">
            Not yet earned
          </span>
        )}
      </div>
    </div>
  );
};

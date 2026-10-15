import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  color = '#6558E8',
  className = '',
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={label || 'Learning progress'}>
      <div className="flex justify-between items-center mb-1.5 text-sm font-semibold">
        {label && <span className="text-[#17233C]">{label}</span>}
        {showPercentage && (
          <span className="text-[#64748B] text-xs font-mono ml-auto">
            {current} / {total} ({percentage}%)
          </span>
        )}
      </div>
      <div className="w-full h-3.5 bg-[#E8E8F0] rounded-full overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

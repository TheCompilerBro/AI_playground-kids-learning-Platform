import React from 'react';
import { RobotMascot } from './RobotMascot';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-[#E8E8F0] shadow-xs ${className}`}>
      <RobotMascot mood="thinking" size={96} className="mb-4" />
      <h3 className="text-xl font-bold text-[#17233C] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <PrimaryButton onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
};

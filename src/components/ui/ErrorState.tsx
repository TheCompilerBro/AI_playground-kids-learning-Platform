import React from 'react';
import { RobotMascot } from './RobotMascot';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Oops! Something went sideways',
  message = "Even robots get tangled up sometimes! Let's get you back on track.",
  onRetry,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-lg mx-auto bg-white rounded-3xl border border-[#E8E8F0] shadow-sm my-8">
      <RobotMascot mood="thinking" size={96} className="mb-4" />
      <h3 className="text-2xl font-bold text-[#17233C] mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-[#64748B] mb-6 leading-relaxed">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <SecondaryButton onClick={onRetry} icon={<RotateCcw className="w-4 h-4" />}>
            Try Again
          </SecondaryButton>
        )}
        <PrimaryButton onClick={() => navigate('/dashboard')} icon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </PrimaryButton>
      </div>
    </div>
  );
};

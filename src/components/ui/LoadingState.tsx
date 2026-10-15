import React from 'react';
import { RobotMascot } from './RobotMascot';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading the playground...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center" role="status" aria-live="polite">
      <RobotMascot mood="thinking" size={100} className="mb-4 animate-bounce" />
      <div className="w-12 h-1 bg-[#6558E8]/20 rounded-full overflow-hidden mb-3">
        <div className="w-full h-full bg-[#6558E8] animate-pulse" />
      </div>
      <p className="text-base font-semibold text-[#17233C]">{message}</p>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
};

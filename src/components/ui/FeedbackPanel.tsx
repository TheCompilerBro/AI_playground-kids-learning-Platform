import React from 'react';
import { CheckCircle, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation: string;
  encouragement?: string;
  onRetry?: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  isCorrect,
  explanation,
  encouragement,
  onRetry,
  onContinue,
  continueLabel = 'Continue to Next Step',
}) => {
  return (
    <div
      role="region"
      aria-live="polite"
      className={`rounded-2xl p-5 sm:p-6 border transition-all duration-300 ${
        isCorrect
          ? 'bg-[#DDF7E8]/70 border-[#86EFAC] text-[#17233C]'
          : 'bg-[#FFE9A8]/50 border-[#FDE047] text-[#17233C]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status icon with color + shape differentiation */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#F59E0B] text-white'
          }`}
        >
          {isCorrect ? (
            <CheckCircle className="w-7 h-7" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-bold">
              {isCorrect ? '✨ Great Thinking!' : '🤔 Interesting Clue!'}
            </h4>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isCorrect ? 'bg-[#DDF7E8] text-[#065F46]' : 'bg-[#FFFBEB] text-[#92400E]'
              }`}
            >
              {isCorrect ? 'Correct' : 'Needs Another Look'}
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-[#17233C] mb-2 font-medium">
            {explanation}
          </p>

          {encouragement && (
            <p className="text-xs sm:text-sm text-[#64748B] italic mb-4">
              {encouragement}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#17233C]/10">
            {!isCorrect && onRetry && (
              <SecondaryButton
                size="sm"
                onClick={onRetry}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Try Again
              </SecondaryButton>
            )}

            <PrimaryButton
              size="sm"
              onClick={onContinue}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {continueLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

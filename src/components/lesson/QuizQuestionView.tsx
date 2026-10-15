import React, { useState } from 'react';
import type { Question } from '../../types';
import { FeedbackPanel } from '../ui/FeedbackPanel';
import { HelpCircle } from 'lucide-react';

interface QuizQuestionViewProps {
  question: Question;
  onAnswerCorrect: () => void;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  question,
  onAnswerCorrect,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelect = (optionId: string) => {
    if (hasChecked) return;
    setSelectedOptionId(optionId);
  };

  const handleCheck = () => {
    if (!selectedOptionId) return;
    setHasChecked(true);
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setHasChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Question prompt header */}
      <div className="bg-white border border-[#E8E8F0] p-6 sm:p-7 rounded-3xl shadow-xs">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE9A8] text-[#B45309] flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6558E8] block mb-1">
              Knowledge Check
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17233C] leading-snug font-['Nunito']">
              {question.prompt}
            </h3>
          </div>
        </div>

        {/* Option list */}
        <div className="space-y-3 mt-6" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const letter = String.fromCharCode(65 + idx); // A, B, C

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={hasChecked && isCorrect}
                onClick={() => handleSelect(option.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-[#6558E8] bg-[#DDF3FF]/30 ring-2 ring-[#6558E8]/20 shadow-xs'
                    : 'border-[#E8E8F0] bg-white hover:border-[#6558E8]/40 hover:bg-[#F8F7F2]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#6558E8] text-white'
                      : 'bg-[#F8F7F2] text-[#64748B] border border-[#E8E8F0]'
                  }`}
                >
                  {letter}
                </div>
                <div className="flex-1">
                  <span className="text-base sm:text-lg font-semibold text-[#17233C] block">
                    {option.text}
                  </span>
                  {hasChecked && !isCorrect && isSelected && option.hint && (
                    <span className="text-xs text-[#B45309] mt-1 block font-medium">
                      💡 Clue: {option.hint}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Check answer button */}
        {!hasChecked && (
          <div className="mt-6 pt-4 border-t border-[#E8E8F0] flex justify-end">
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleCheck}
              className={`px-7 py-3 rounded-full text-base font-bold transition-all shadow-xs ${
                selectedOptionId
                  ? 'bg-[#6558E8] text-white hover:bg-[#5145CF] cursor-pointer'
                  : 'bg-[#E8E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              Check My Answer
            </button>
          </div>
        )}
      </div>

      {/* Feedback panel when checked */}
      {hasChecked && (
        <FeedbackPanel
          isCorrect={isCorrect}
          explanation={isCorrect ? question.explanation : (selectedOption?.hint || 'Think about how AI learns from examples and rules.')}
          encouragement={question.encouragement}
          onRetry={!isCorrect ? handleRetry : undefined}
          onContinue={onAnswerCorrect}
          continueLabel={isCorrect ? 'Awesome! Next Step →' : 'Continue Anyway'}
        />
      )}
    </div>
  );
};

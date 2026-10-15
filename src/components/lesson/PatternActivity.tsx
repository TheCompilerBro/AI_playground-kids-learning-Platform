import React, { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import type { ActivityConfig } from '../../types';

interface PatternActivityProps {
  config: ActivityConfig;
  onComplete: () => void;
}

export const PatternActivity: React.FC<PatternActivityProps> = ({
  config,
  onComplete,
}) => {
  const sequence = config.patternSequence || [];
  const options = config.patternOptions || [];
  const correctAnswer = config.patternCorrectAnswer || '';

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === correctAnswer;

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isCorrect) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-[#FFFDF8] border border-[#E8E8F0] p-4 sm:p-5 rounded-2xl">
        <p className="text-base sm:text-lg font-bold text-[#17233C]">
          {config.instruction}
        </p>
        <p className="text-xs text-[#64748B] mt-1">
          Look for the repeating pattern rhythm below and pick what comes next!
        </p>
      </div>

      {/* Pattern sequence track */}
      <div className="p-6 bg-white rounded-3xl border border-[#E8E8F0] shadow-xs">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {sequence.map((item, idx) => {
            const isBlank = idx === config.patternMissingIndex;
            return (
              <div
                key={idx}
                className={`min-w-[70px] sm:min-w-[90px] h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-2 font-bold text-center border-2 transition-all ${
                  isBlank
                    ? selectedOption
                      ? isSubmitted
                        ? isCorrect
                          ? 'border-[#10B981] bg-[#DDF7E8] text-[#065F46]'
                          : 'border-[#F59E0B] bg-[#FFE9A8] text-[#92400E]'
                        : 'border-[#6558E8] bg-[#DDF3FF] text-[#6558E8]'
                      : 'border-dashed border-[#6558E8] bg-[#F8F7F2] text-[#64748B]'
                    : 'border-[#E8E8F0] bg-[#FFFDF8] text-[#17233C]'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1">
                  {isBlank ? (selectedOption ? selectedOption.split(' ')[0] : '❓') : item.split(' ')[0]}
                </span>
                <span className="text-[11px] sm:text-xs">
                  {isBlank ? (selectedOption ? selectedOption.split(' ').slice(1).join(' ') : 'Missing') : item.split(' ').slice(1).join(' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer options */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-[#17233C] text-center">
          Choose the missing clue:
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={opt}
                type="button"
                disabled={isSubmitted && isCorrect}
                onClick={() => handleSelect(opt)}
                className={`px-5 py-3 rounded-2xl text-base font-bold transition-all border-2 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-[#6558E8] bg-[#6558E8] text-white shadow-sm scale-105'
                    : 'border-[#E8E8F0] bg-white text-[#17233C] hover:border-[#6558E8]/40 hover:bg-[#F8F7F2]'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control / feedback button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E8F0]">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#17233C] px-3 py-2 rounded-xl border border-[#E8E8F0]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Try Another
        </button>

        {!isSubmitted ? (
          <button
            type="button"
            disabled={!selectedOption}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs ${
              selectedOption
                ? 'bg-[#6558E8] text-white hover:bg-[#5145CF] cursor-pointer'
                : 'bg-[#E8E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            Check Pattern
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isCorrect) {
                onComplete();
              } else {
                handleRetry();
              }
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isCorrect ? 'bg-[#10B981] text-white hover:bg-[#059669]' : 'bg-[#F59E0B] text-white'
            }`}
          >
            {isCorrect ? 'Pattern Solved! Continue →' : 'Let’s Try Again'}
          </button>
        )}
      </div>

      {isSubmitted && isCorrect && (
        <div className="p-4 bg-[#DDF7E8] text-[#065F46] rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Brilliant! The pattern repeats: Sun, Rain, Sun, Rain, Sun, Rain!</span>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { ActivityConfig } from '../../types';

interface ComparisonActivityProps {
  config: ActivityConfig;
  onComplete: () => void;
}

export const ComparisonActivity: React.FC<ComparisonActivityProps> = ({
  config,
  onComplete,
}) => {
  const items = config.items || [];
  const targetCategory = config.categories ? config.categories[0] : 'Best Option';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedId);
  const isCorrect = selectedItem?.category === targetCategory;

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isCorrect) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSelectedId(null);
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
          Compare the options below and select the one that best explains the concept!
        </p>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isItemTarget = item.category === targetCategory;
          const IconComponent = item.iconName
            ? (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.iconName] || Icons.CheckCircle
            : Icons.CheckCircle;

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer text-left bg-white ${
                isSelected
                  ? isSubmitted
                    ? isItemTarget
                      ? 'border-[#10B981] bg-[#DDF7E8]/30 ring-3 ring-[#10B981]/20'
                      : 'border-[#F59E0B] bg-[#FFE9A8]/20 ring-3 ring-[#F59E0B]/20'
                    : 'border-[#6558E8] ring-3 ring-[#6558E8]/15 shadow-sm'
                  : 'border-[#E8E8F0] hover:border-[#6558E8]/40 hover:bg-[#F8F7F2]'
              }`}
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#6558E8] text-white' : 'bg-[#DDF3FF] text-[#6558E8]'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17233C] mb-1">{item.label}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E8F0] flex items-center justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Category tag:</span>
                <span className={isSelected && isItemTarget ? 'text-[#065F46]' : 'text-[#6558E8]'}>
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E8F0]">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#17233C] px-3 py-2 rounded-xl border border-[#E8E8F0]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>

        {!isSubmitted ? (
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs ${
              selectedId
                ? 'bg-[#6558E8] text-white hover:bg-[#5145CF] cursor-pointer'
                : 'bg-[#E8E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            Check Selection
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
            {isCorrect ? 'Great Choice! Continue →' : 'Review & Try Again'}
          </button>
        )}
      </div>

      {isSubmitted && isCorrect && (
        <div className="p-4 bg-[#DDF7E8] text-[#065F46] rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Spot on! This teaches the computer the clearest and most accurate lesson.</span>
        </div>
      )}
    </div>
  );
};

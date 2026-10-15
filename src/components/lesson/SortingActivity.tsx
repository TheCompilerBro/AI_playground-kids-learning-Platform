import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import type { ActivityConfig } from '../../types';

interface SortingActivityProps {
  config: ActivityConfig;
  onComplete: () => void;
}

export const SortingActivity: React.FC<SortingActivityProps> = ({
  config,
  onComplete,
}) => {
  const categories = config.categories || ['Category 1', 'Category 2'];
  const items = config.items || [];

  // item assignments: itemId -> category
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAssign = (itemId: string, category: string) => {
    if (isSubmitted) return;
    setAssignments((prev) => ({
      ...prev,
      [itemId]: category,
    }));
  };

  const handleReset = () => {
    setAssignments({});
    setIsSubmitted(false);
  };

  const allAssigned = items.length > 0 && items.every((item) => assignments[item.id]);

  const correctCount = items.filter((item) => assignments[item.id] === item.category).length;
  const isAllCorrect = allAssigned && correctCount === items.length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isAllCorrect) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions header */}
      <div className="bg-[#FFFDF8] border border-[#E8E8F0] p-4 sm:p-5 rounded-2xl">
        <p className="text-base sm:text-lg font-bold text-[#17233C]">
          {config.instruction}
        </p>
        <p className="text-xs text-[#64748B] mt-1">
          Click a button under each item to place it in the right group!
        </p>
      </div>

      {/* Grid of items to sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const currentCategory = assignments[item.id];
          const isCorrect = isSubmitted && currentCategory === item.category;
          const isWrong = isSubmitted && currentCategory !== item.category;

          const IconComponent = item.iconName
            ? (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.iconName] || Icons.HelpCircle
            : Icons.HelpCircle;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 bg-white ${
                isCorrect
                  ? 'border-[#10B981] bg-[#DDF7E8]/30 ring-2 ring-[#10B981]/20'
                  : isWrong
                  ? 'border-[#F59E0B] bg-[#FFE9A8]/20 ring-2 ring-[#F59E0B]/20'
                  : currentCategory
                  ? 'border-[#6558E8] shadow-xs'
                  : 'border-[#E8E8F0]'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#17233C]">{item.label}</h4>
                  {item.description && (
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>

              {/* Category selector buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E8F0]">
                {categories.map((cat) => {
                  const isSelected = currentCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleAssign(item.id, cat)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-[#6558E8] text-white border-[#6558E8] shadow-xs'
                          : 'bg-[#F8F7F2] text-[#17233C] border-[#E8E8F0] hover:bg-[#E8E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Feedback indicator if submitted */}
              {isSubmitted && (
                <div className="mt-2 text-xs font-semibold flex items-center gap-1">
                  {isCorrect ? (
                    <span className="text-[#065F46] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct: {item.category}
                    </span>
                  ) : (
                    <span className="text-[#B45309]">
                      Needs adjustment: Belongs in "{item.category}"
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E8F0]">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#17233C] px-3 py-2 rounded-xl border border-[#E8E8F0] hover:bg-[#F8F7F2]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>

        {!isSubmitted ? (
          <button
            type="button"
            disabled={!allAssigned}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs ${
              allAssigned
                ? 'bg-[#6558E8] text-white hover:bg-[#5145CF] cursor-pointer'
                : 'bg-[#E8E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            Check Answers ({Object.keys(assignments).length}/{items.length} Sorted)
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isAllCorrect) {
                onComplete();
              } else {
                setIsSubmitted(false);
              }
            }}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#10B981] text-white hover:bg-[#059669] shadow-xs cursor-pointer"
          >
            {isAllCorrect ? 'Looks Perfect! Continue →' : 'Fix Answers & Try Again'}
          </button>
        )}
      </div>
    </div>
  );
};

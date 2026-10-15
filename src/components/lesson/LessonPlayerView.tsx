import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { RobotMascot } from '../ui/RobotMascot';
import { ProgressBar } from '../ui/ProgressBar';
import { SortingActivity } from './SortingActivity';
import { PatternActivity } from './PatternActivity';
import { ComparisonActivity } from './ComparisonActivity';
import { QuizQuestionView } from './QuizQuestionView';
import { CelebrationView } from './CelebrationView';
import { useProgress } from '../../hooks/useProgress';
import { LESSONS } from '../../data/lessons';
import type { Lesson } from '../../types';

interface LessonPlayerViewProps {
  lesson: Lesson;
}

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({ lesson }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const totalSteps = lesson.steps.length;
  const currentStep = lesson.steps[currentStepIndex];

  // Determine next lesson for celebration
  const currentIdx = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIdx !== -1 && currentIdx + 1 < LESSONS.length ? LESSONS[currentIdx + 1] : undefined;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/lessons');
    }
  };

  // Called when a quiz or activity finishes
  const handleStepDone = () => {
    if (currentStepIndex === totalSteps - 2) {
      // About to reach celebration: mark complete!
      completeLesson(lesson.id, 100);
    }
    handleNext();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Step Progress Bar */}
      <div className="bg-white border border-[#E8E8F0] p-4 sm:p-6 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#17233C] px-3 py-1.5 rounded-xl border border-[#E8E8F0] hover:bg-[#F8F7F2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'All Lessons' : 'Previous Step'}</span>
          </button>

          <div className="text-right">
            <span className="text-xs font-bold text-[#6558E8] uppercase tracking-wider block">
              {lesson.title}
            </span>
            <span className="text-xs text-[#64748B]">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>

        <ProgressBar
          current={currentStepIndex + 1}
          total={totalSteps}
          showPercentage={false}
          color="#6558E8"
        />
      </div>

      {/* Step View Content */}
      {currentStep.type === 'concept' && (
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <RobotMascot mood="thinking" size={110} className="shrink-0" />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3 py-1 rounded-full">
                Big Idea
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] font-['Nunito']">
                {currentStep.title}
              </h2>
              <p className="text-lg font-bold text-[#17233C] leading-snug">
                {currentStep.instruction}
              </p>
              {currentStep.helperText && (
                <div className="p-4 bg-[#FFFDF8] border border-[#E8E8F0] rounded-2xl text-sm sm:text-base text-[#64748B] leading-relaxed flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span>{currentStep.helperText}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E8F0] flex justify-end">
            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full text-base font-bold bg-[#6558E8] text-white hover:bg-[#5145CF] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Let's Try the Activity!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {currentStep.type === 'activity' && currentStep.activityConfig && (
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-[#E8E8F0]">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981] bg-[#DDF7E8] px-3 py-1 rounded-full">
              Hands-On Activity
            </span>
            <h2 className="text-2xl font-extrabold text-[#17233C] mt-2 font-['Nunito']">
              {currentStep.title}
            </h2>
          </div>

          {currentStep.activityConfig.type === 'sort' && (
            <SortingActivity
              config={currentStep.activityConfig}
              onComplete={handleStepDone}
            />
          )}

          {currentStep.activityConfig.type === 'pattern' && (
            <PatternActivity
              config={currentStep.activityConfig}
              onComplete={handleStepDone}
            />
          )}

          {(currentStep.activityConfig.type === 'feature_match' ||
            currentStep.activityConfig.type === 'spot_mistake') && (
            <ComparisonActivity
              config={currentStep.activityConfig}
              onComplete={handleStepDone}
            />
          )}
        </div>
      )}

      {currentStep.type === 'quiz' && currentStep.question && (
        <QuizQuestionView
          question={currentStep.question}
          onAnswerCorrect={handleStepDone}
        />
      )}

      {currentStep.type === 'celebrate' && (
        <CelebrationView lesson={lesson} nextLesson={nextLesson} />
      )}
    </div>
  );
};

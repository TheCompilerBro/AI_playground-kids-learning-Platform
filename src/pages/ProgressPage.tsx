import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useProgress } from '../hooks/useProgress';
import { BADGES } from '../data/badges';
import { LESSONS } from '../data/lessons';
import { BadgeCard } from '../components/ui/BadgeCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { RobotMascot } from '../components/ui/RobotMascot';
import {
  Award,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { progress, stats, resetProgress, seedDemo } = useProgress();
  const navigate = useNavigate();
  const [selectedBadgeModal, setSelectedBadgeModal] = useState<string | null>(null);

  const handleReset = () => {
    if (window.confirm('Reset all progress back to 0? This will clear your completed lessons and unlocked badges.')) {
      resetProgress();
    }
  };

  const selectedBadge = BADGES.find((b) => b.id === selectedBadgeModal);

  return (
    <PageContainer size="default">
      <div className="space-y-10">
        {/* Header Summary */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto md:mx-0">
              <Award className="w-3.5 h-3.5" /> Personal Learning Journal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#17233C] font-['Nunito']">
              Your AI Achievements
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] max-w-xl">
              Every lesson and experiment you complete adds to your knowledge. No rankings, no timers—just curiosity and fun!
            </p>

            <div className="pt-2 max-w-md">
              <ProgressBar
                current={stats.completedCount}
                total={stats.totalLessons}
                label="Mastery Progress"
                color="#10B981"
              />
            </div>
          </div>

          <RobotMascot
            mood={stats.completedCount > 0 ? 'celebrating' : 'thinking'}
            size={130}
            className="shrink-0"
          />
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDF7E8] text-[#10B981] flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17233C]">
                {stats.completedCount} / {stats.totalLessons}
              </span>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                Lessons Completed
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE9A8] text-[#B45309] flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17233C]">
                {stats.earnedBadgesCount} / {stats.totalBadges}
              </span>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                Badges Unlocked
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center shrink-0">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#17233C]">
                {progress.labTrialsCompleted}
              </span>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                Lab Experiments Run
              </p>
            </div>
          </div>
        </div>

        {/* Badge Shelf */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8F0]">
            <div>
              <h2 className="text-2xl font-extrabold text-[#17233C] font-['Nunito']">
                Badge Shelf
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Click on any badge to inspect its meaning and how to earn it!
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F8F7F2] text-[#64748B] border border-[#E8E8F0]">
              {stats.earnedBadgesCount} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={progress.earnedBadgeIds.includes(badge.id)}
                onClick={() => setSelectedBadgeModal(badge.id)}
              />
            ))}
          </div>
        </div>

        {/* Completed Lessons Checklist */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-[#17233C] font-['Nunito'] pb-3 border-b border-[#E8E8F0]">
            Lessons Checklist
          </h2>

          <div className="space-y-3">
            {LESSONS.map((lesson) => {
              const isDone = progress.completedLessonIds.includes(lesson.id);
              const p = progress.lessonProgress[lesson.id];

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone ? 'bg-[#DDF7E8]/30 border-[#86EFAC]' : 'bg-white border-[#E8E8F0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-[#10B981] text-white' : 'bg-[#E8E8F0] text-[#94A3B8]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#17233C]">
                        {lesson.title}
                      </h4>
                      {isDone && p?.completedAt && (
                        <p className="text-[11px] text-[#065F46]">
                          Completed • Score: {p.score}%
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                    className="text-xs font-bold text-[#6558E8] hover:underline"
                  >
                    {isDone ? 'Review Lesson →' : 'Start Now →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary CTA to start another activity */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#FFFDF8] border border-[#E8E8F0] rounded-3xl">
          <div>
            <h3 className="font-bold text-base text-[#17233C]">
              Want to keep learning?
            </h3>
            <p className="text-xs text-[#64748B]">
              Jump straight to the next recommended activity or train a model in the lab.
            </p>
          </div>

          <div className="flex gap-3">
            <SecondaryButton onClick={() => navigate('/lab')} icon={<FlaskConical className="w-4 h-4" />}>
              Open AI Lab
            </SecondaryButton>
            <PrimaryButton onClick={() => navigate('/lessons')} icon={<ArrowRight className="w-4 h-4" />}>
              Continue Learning
            </PrimaryButton>
          </div>
        </div>

        {/* Prototype Reset / Seed controls */}
        <div className="pt-4 border-t border-[#E8E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>Prototype Tools:</span>
          <div className="flex gap-2">
            <button
              onClick={() => seedDemo()}
              className="text-[#6558E8] font-bold hover:underline"
            >
              Seed Sample Progress
            </button>
            <span>•</span>
            <button
              onClick={handleReset}
              className="text-[#B42318] hover:underline"
            >
              Reset All Progress
            </button>
          </div>
        </div>

        {/* Badge detail inspection modal */}
        {selectedBadge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233C]/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#E8E8F0] shadow-xl text-center space-y-4">
              <BadgeCard
                badge={selectedBadge}
                isUnlocked={progress.earnedBadgeIds.includes(selectedBadge.id)}
              />
              <button
                onClick={() => setSelectedBadgeModal(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#F8F7F2] text-[#17233C] hover:bg-[#E8E8F0]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

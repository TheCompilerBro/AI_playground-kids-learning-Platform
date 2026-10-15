import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RobotMascot } from '../ui/RobotMascot';
import { BadgeCard } from '../ui/BadgeCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { BADGES } from '../../data/badges';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, LayoutDashboard } from 'lucide-react';
import type { Lesson } from '../../types';

interface CelebrationViewProps {
  lesson: Lesson;
  nextLesson?: Lesson;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  lesson,
  nextLesson,
}) => {
  const navigate = useNavigate();
  const badge = BADGES.find((b) => b.id === lesson.badgeId);

  useEffect(() => {
    // Fire cheerful confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6558E8', '#10B981', '#F59E0B', '#FFB7A8', '#DDF3FF'],
      });
    } catch {
      // safe fallback if canvas unavailable
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E8F0] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center">
        <RobotMascot mood="celebrating" size={130} className="mb-4" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981] bg-[#DDF7E8] px-3 py-1 rounded-full mb-3">
          Lesson Completed! 🎉
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] mb-2 font-['Nunito']">
          Super Job Learning "{lesson.title}"!
        </h2>
        <p className="text-sm sm:text-base text-[#64748B] max-w-md mx-auto leading-relaxed">
          You completed all the activities and answered the questions. Your new knowledge is saved in your progress!
        </p>
      </div>

      {/* Unlocked Badge Section */}
      {badge && (
        <div className="bg-[#FFFDF8] border border-[#E8E8F0] p-6 rounded-3xl max-w-sm mx-auto shadow-xs">
          <span className="text-xs font-bold text-[#6558E8] uppercase tracking-wide block mb-3">
            ✨ Badge Unlocked ✨
          </span>
          <BadgeCard badge={badge} isUnlocked={true} />
        </div>
      )}

      {/* Navigation options */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#E8E8F0]">
        {nextLesson ? (
          <PrimaryButton
            size="lg"
            onClick={() => navigate(`/lessons/${nextLesson.id}`)}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Start Next Lesson: {nextLesson.title}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            size="lg"
            onClick={() => navigate('/lab')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Experiment in AI Lab
          </PrimaryButton>
        )}

        <SecondaryButton
          size="md"
          onClick={() => navigate('/lessons')}
          icon={<BookOpen className="w-4 h-4" />}
        >
          Lesson Library
        </SecondaryButton>

        <SecondaryButton
          size="md"
          onClick={() => navigate('/dashboard')}
          icon={<LayoutDashboard className="w-4 h-4" />}
        >
          My Dashboard
        </SecondaryButton>
      </div>
    </div>
  );
};

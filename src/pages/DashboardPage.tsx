import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { PageContainer } from '../components/layout/PageContainer';
import { RobotMascot } from '../components/ui/RobotMascot';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BadgeCard } from '../components/ui/BadgeCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SafetyNotice } from '../components/ui/SafetyNotice';
import { LEARNING_BANDS } from '../data/learningBands';
import { LESSONS } from '../data/lessons';
import { BADGES } from '../data/badges';
import {
  BookOpen,
  FlaskConical,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  User,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { progress, stats, resetProgress, seedDemo } = useProgress();
  const navigate = useNavigate();

  const bandInfo = LEARNING_BANDS[progress.selectedBand] || LEARNING_BANDS.explorer;
  const nextLesson = stats.nextLesson;
  const isAllComplete = progress.completedLessonIds.length === LESSONS.length;

  const handleReset = () => {
    if (window.confirm('Reset all lesson progress and badges back to start?')) {
      resetProgress();
    }
  };

  return (
    <PageContainer size="default">
      <div className="space-y-10">
        {/* Welcome Greeting Banner */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-[#17233C]"
                style={{ backgroundColor: bandInfo.accentBg }}
              >
                Level: {bandInfo.name} ({bandInfo.ageRange})
              </span>
              <Link
                to="/learn"
                className="text-xs text-[#6558E8] font-bold hover:underline flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" /> Change Level
              </Link>
              <span className="text-[#E8E8F0]">•</span>
              <Link
                to="/profile"
                className="text-xs text-[#6558E8] font-bold hover:underline flex items-center gap-1"
              >
                <User className="w-3 h-3" /> My Profile
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#17233C] font-['Nunito']">
              Welcome, {progress.nickname || 'Young Explorer'}! 👋
            </h1>

            <p className="text-base text-[#64748B] max-w-xl">
              Ready to explore artificial intelligence? Complete lessons to unlock badges and test your ideas in the AI Lab!
            </p>

            <div className="pt-2 max-w-md">
              <ProgressBar
                current={stats.completedCount}
                total={stats.totalLessons}
                label="Learning Path Progress"
                color="#6558E8"
              />
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <RobotMascot
              mood={isAllComplete ? 'celebrating' : 'happy'}
              size={130}
            />
            {isAllComplete && (
              <span className="text-xs font-extrabold text-[#10B981] bg-[#DDF7E8] px-3 py-1 rounded-full mt-2">
                All Lessons Mastered! 🌟
              </span>
            )}
          </div>
        </div>

        {/* Featured "Continue Learning" Card */}
        {nextLesson && (
          <div className="bg-gradient-to-r from-[#DDF3FF]/60 via-white to-[#DDF7E8]/40 rounded-3xl border-2 border-[#6558E8]/30 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-white px-3 py-1 rounded-full border border-[#E8E8F0] shadow-2xs">
                  Recommended Next Activity
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233C] font-['Nunito']">
                  {nextLesson.title}
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
                  {nextLesson.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#64748B] font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6558E8]" />
                    {nextLesson.durationMinutes} minutes
                  </span>
                  <span>•</span>
                  <span>{nextLesson.steps.length} interactive steps</span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <PrimaryButton
                  size="lg"
                  fullWidth
                  onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Activity
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}

        {/* Quick Nav Cards: Lessons, Lab, Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/lessons"
            className="group bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs hover:border-[#6558E8]/40 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#17233C] group-hover:text-[#6558E8] transition-colors font-['Nunito']">
                Lesson Library
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Explore all 5 interactive AI lessons and sorting challenges.
              </p>
            </div>
          </Link>

          <Link
            to="/lab"
            className="group bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs hover:border-[#6558E8]/40 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#DDF7E8] text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#17233C] group-hover:text-[#10B981] transition-colors font-['Nunito']">
                AI Lab
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Label examples and train a miniature image classifier model!
              </p>
            </div>
          </Link>

          <Link
            to="/progress"
            className="group bg-white p-6 rounded-3xl border border-[#E8E8F0] shadow-xs hover:border-[#6558E8]/40 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFE9A8] text-[#B45309] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#17233C] group-hover:text-[#B45309] transition-colors font-['Nunito']">
                Badges & Stars
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {stats.earnedBadgesCount} of {stats.totalBadges} badges unlocked so far.
              </p>
            </div>
          </Link>
        </div>

        {/* Learning Path Steps Overview */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8F0]">
            <div>
              <h3 className="text-xl font-extrabold text-[#17233C] font-['Nunito']">
                Your Learning Path
              </h3>
              <p className="text-xs text-[#64748B]">
                Step-by-step foundational lessons designed for curious learners
              </p>
            </div>
            <Link to="/lessons" className="text-xs font-bold text-[#6558E8] hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {LESSONS.map((lesson, idx) => {
              const isCompleted = progress.completedLessonIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-[#DDF7E8]/30 border-[#86EFAC]'
                      : 'bg-white border-[#E8E8F0]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCompleted
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#F8F7F2] text-[#64748B] border border-[#E8E8F0]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#17233C]">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-[#64748B] hidden sm:block">
                        {lesson.summary}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/lessons/${lesson.id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-[#F8F7F2] text-[#17233C] hover:bg-[#E8E8F0]'
                        : 'bg-[#6558E8] text-white hover:bg-[#5145CF]'
                    }`}
                  >
                    {isCompleted ? 'Replay' : 'Start'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badge Collection Section */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8F0]">
            <div>
              <h3 className="text-xl font-extrabold text-[#17233C] font-['Nunito']">
                Badge Showcase
              </h3>
              <p className="text-xs text-[#64748B]">
                Earned through curiosity, practice, and hands-on experiments
              </p>
            </div>
            <Link to="/progress" className="text-xs font-bold text-[#6558E8] hover:underline">
              All Badges ({stats.earnedBadgesCount}/{stats.totalBadges}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {BADGES.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={progress.earnedBadgeIds.includes(badge.id)}
              />
            ))}
          </div>
        </div>

        {/* Safety notice banner */}
        <SafetyNotice compact={true} />

        {/* Testing / Prototype helpers */}
        <div className="pt-6 border-t border-[#E8E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <span>Prototype Tools:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => seedDemo()}
              className="px-3 py-1.5 rounded-lg border border-[#E8E8F0] hover:bg-[#F8F7F2] text-[#6558E8] font-bold"
            >
              Seed Sample Progress
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-[#E8E8F0] hover:bg-[#F8F7F2] text-[#B42318] font-medium"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

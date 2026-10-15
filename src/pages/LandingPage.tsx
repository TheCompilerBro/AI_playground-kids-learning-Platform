import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RobotMascot } from '../components/ui/RobotMascot';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { SafetyNotice } from '../components/ui/SafetyNotice';
import { ActivityCard } from '../components/learning/ActivityCard';
import { LEARNING_BANDS } from '../data/learningBands';
import { LESSONS } from '../data/lessons';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Compass,
  Search,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Eye,
  Sliders,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      navigate('/learn');
    } else {
      navigate('/signup', { state: { from: { pathname: '/learn' } } });
    }
  };

  const handleExploreActivities = () => {
    if (user) {
      navigate('/lessons');
    } else {
      navigate('/login', { state: { from: { pathname: '/lessons' } } });
    }
  };

  const featuredLessons = LESSONS.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* 1. Hero Section */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 2xl:gap-20 items-center">
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 xl:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#DDF3FF] text-[#6558E8] px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>A playful, safe learning adventure for ages 5–10</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-[5rem] font-black text-[#17233C] tracking-tight leading-[1.08] font-['Nunito']">
              Big ideas.{' '}
              <span className="text-[#6558E8] underline decoration-[#FFE9A8] decoration-wavy decoration-4">
                Little experiments.
              </span>
            </h1>

            <p className="text-lg sm:text-xl xl:text-2xl text-[#64748B] max-w-2xl 2xl:max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover how AI learns—one fun experiment at a time. No complex coding, no open chatbots, and no personal data required.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <PrimaryButton
                size="lg"
                onClick={handleStartLearning}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Learning
              </PrimaryButton>

              <SecondaryButton
                size="lg"
                onClick={handleExploreActivities}
              >
                Explore Activities
              </SecondaryButton>
            </div>

            {/* Micro reassurance badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs sm:text-sm font-semibold text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 100% Free & Local
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Safe Email Sign-In
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Guided ML Lab
              </span>
            </div>
          </div>

          {/* Hero Illustration: Friendly Robot exploring patterns */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md xl:max-w-lg 2xl:max-w-xl p-8 sm:p-10 xl:p-12 bg-gradient-to-b from-[#FFFDF8] to-[#DDF3FF]/30 rounded-3xl border-2 border-[#E8E8F0] shadow-sm text-center">
              {/* Pattern shapes floating */}
              <div className="absolute top-4 left-6 px-3.5 py-1 bg-white border border-[#E8E8F0] rounded-full text-xs sm:text-sm font-bold text-[#6558E8] shadow-xs animate-pulse">
                Pattern: 🍎 🍌 🍎 🍌
              </div>
              <div className="absolute bottom-6 right-6 px-3.5 py-1 bg-white border border-[#E8E8F0] rounded-full text-xs sm:text-sm font-bold text-[#10B981] shadow-xs">
                Prediction: 91% Match
              </div>

              <RobotMascot mood="happy" size={190} className="mx-auto my-6" />

              <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-xs rounded-2xl border border-[#E8E8F0]">
                <h4 className="font-extrabold text-[#17233C] text-sm sm:text-base mb-1 font-['Nunito']">
                  "Hi! I'm Sparky."
                </h4>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  I learn from patterns in pictures and words. Let’s do some experiments together!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three-Step Explainer: Explore -> Experiment -> Create */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3.5 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#17233C] font-['Nunito']">
            Three Steps to Understanding AI
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            We turn abstract computer science concepts into touchable games and thoughtful reflections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
          <div className="bg-white p-7 sm:p-9 xl:p-10 rounded-3xl border border-[#E8E8F0] shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-2xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center mx-auto text-2xl xl:text-3xl font-black">
              1
            </div>
            <h3 className="text-xl xl:text-2xl font-bold text-[#17233C] font-['Nunito']">
              1. Explore Big Ideas
            </h3>
            <p className="text-sm xl:text-base text-[#64748B] leading-relaxed">
              Discover what artificial intelligence really is—a smart computer tool created by people, not a magic living creature.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-9 xl:p-10 rounded-3xl border border-[#E8E8F0] shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-2xl bg-[#DDF7E8] text-[#10B981] flex items-center justify-center mx-auto text-2xl xl:text-3xl font-black">
              2
            </div>
            <h3 className="text-xl xl:text-2xl font-bold text-[#17233C] font-['Nunito']">
              2. Experiment in the Lab
            </h3>
            <p className="text-sm xl:text-base text-[#64748B] leading-relaxed">
              Label real training examples, train a miniature classifier, and test unseen items to watch how predictions work.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-9 xl:p-10 rounded-3xl border border-[#E8E8F0] shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-2xl bg-[#FFE9A8] text-[#B45309] flex items-center justify-center mx-auto text-2xl xl:text-3xl font-black">
              3
            </div>
            <h3 className="text-xl xl:text-2xl font-bold text-[#17233C] font-['Nunito']">
              3. Learn from Mistakes
            </h3>
            <p className="text-sm xl:text-base text-[#64748B] leading-relaxed">
              Spot optical illusions and biased datasets. Learn why AI can make mistakes and why humans must always double-check.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three Learning Bands Section */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981] bg-[#DDF7E8] px-3.5 py-1.5 rounded-full">
            Tailored for Every Age
          </span>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#17233C] font-['Nunito']">
            Designed for Ages 5 to 10
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            Start where you feel comfortable. You can switch levels at any time!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
          {Object.values(LEARNING_BANDS).map((band) => {
            const Icon = band.id === 'explorer' ? Compass : band.id === 'detective' ? Search : Lightbulb;
            return (
              <div
                key={band.id}
                className="bg-white rounded-3xl border border-[#E8E8F0] p-7 sm:p-9 xl:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 xl:w-14 xl:h-14 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: band.color }}
                    >
                      <Icon className="w-6 h-6 xl:w-7 xl:h-7" />
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-[#17233C]"
                      style={{ backgroundColor: band.accentBg }}
                    >
                      {band.ageRange}
                    </span>
                  </div>

                  <h3 className="text-xl xl:text-2xl font-extrabold text-[#17233C] mb-1 font-['Nunito']">
                    {band.name}
                  </h3>
                  <p className="text-xs xl:text-sm font-bold text-[#6558E8] uppercase tracking-wide mb-3">
                    {band.badgeTitle}
                  </p>
                  <p className="text-sm xl:text-base text-[#64748B] leading-relaxed mb-6">
                    {band.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {band.focus.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs xl:text-sm text-[#475569]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6558E8]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/learn"
                  className="w-full text-center py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#F8F7F2] text-[#17233C] hover:bg-[#6558E8] hover:text-white transition-all border border-[#E8E8F0]"
                >
                  Choose {band.name} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Activities */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3.5 py-1.5 rounded-full">
              Interactive Lessons
            </span>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#17233C] mt-2 font-['Nunito']">
              Featured Activities
            </h2>
          </div>
          <Link
            to="/lessons"
            className="text-sm xl:text-base font-bold text-[#6558E8] hover:underline flex items-center gap-1"
          >
            View all 5 starter lessons →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
          {featuredLessons.map((lesson) => (
            <ActivityCard
              key={lesson.id}
              lesson={lesson}
              progress={progress.lessonProgress[lesson.id]}
            />
          ))}
        </div>
      </section>

      {/* 5. What Children Will Learn */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="bg-[#FFFDF8] rounded-3xl border border-[#E8E8F0] p-8 sm:p-12 xl:p-16">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#17233C] mb-2 font-['Nunito']">
              What Children Will Learn
            </h2>
            <p className="text-sm sm:text-base xl:text-lg text-[#64748B]">
              By completing the activities in AI Playground, children build a foundational, grounded perspective on artificial intelligence:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E8F0] space-y-2 hover:shadow-xs transition-shadow">
              <BrainCircuit className="w-7 h-7 text-[#6558E8]" />
              <h4 className="font-bold text-base xl:text-lg text-[#17233C]">AI as a Tool</h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Describe AI as software created by humans to spot patterns and execute specific tasks.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E8F0] space-y-2 hover:shadow-xs transition-shadow">
              <Eye className="w-7 h-7 text-[#10B981]" />
              <h4 className="font-bold text-base xl:text-lg text-[#17233C]">Examples & Labels</h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Understand how machines learn by examining labeled training data instead of magic.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E8F0] space-y-2 hover:shadow-xs transition-shadow">
              <Sliders className="w-7 h-7 text-[#F59E0B]" />
              <h4 className="font-bold text-base xl:text-lg text-[#17233C]">Training vs Testing</h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Identify training examples and test unseen samples to understand prediction accuracy.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E8F0] space-y-2 hover:shadow-xs transition-shadow">
              <ShieldCheck className="w-7 h-7 text-[#EC4899]" />
              <h4 className="font-bold text-base xl:text-lg text-[#17233C]">Model Limitations</h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Explain why an AI might guess wrong, and know to verify important questions with adults.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Safety & Parent Trust */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <SafetyNotice />
      </section>

      {/* 7. Final Call to Action */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 text-center">
        <div className="bg-[#6558E8] text-white rounded-3xl p-8 sm:p-14 xl:p-20 space-y-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black font-['Nunito']">
              Ready to start your first experiment?
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Choose your learning level and explore the world of artificial intelligence right now in your browser.
            </p>
            <div className="pt-2">
              <button
                onClick={handleStartLearning}
                className="px-9 py-4 rounded-full text-base sm:text-lg font-bold bg-[#FFE9A8] text-[#17233C] hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

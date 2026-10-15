import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { RobotMascot } from '../components/ui/RobotMascot';
import { ShieldCheck, AlertTriangle, EyeOff, CheckCircle2, HeartHandshake, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SafetyPage: React.FC = () => {
  return (
    <PageContainer size="default">
      <div className="space-y-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981] bg-[#DDF7E8] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto md:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" /> Child Safety & AI Ethics
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#17233C] font-['Nunito']">
              Safety, Privacy & AI Limitations
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] max-w-xl">
              We want children to explore artificial intelligence with curiosity, healthy skepticism, and safety. Here is our honest promise.
            </p>
          </div>

          <RobotMascot mood="happy" size={130} className="shrink-0" />
        </div>

        {/* 1. What AI Can and Cannot Do */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-2xl font-extrabold text-[#17233C] font-['Nunito'] pb-3 border-b border-[#E8E8F0]">
            What AI Can and Cannot Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#DDF7E8]/40 border border-[#86EFAC] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#065F46]">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                What AI Can Do
              </div>
              <ul className="text-sm text-[#374151] space-y-2">
                <li>• Find patterns across millions of numbers, words, or pixels.</li>
                <li>• Recognize shapes, colors, or musical rhythms based on training examples.</li>
                <li>• Follow mathematical rules designed by human software developers.</li>
                <li>• Help people automate repetitive tasks and explore creative ideas.</li>
              </ul>
            </div>

            <div className="p-6 bg-[#FFE9A8]/40 border border-[#FDE047] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#92400E]">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                What AI Cannot Do
              </div>
              <ul className="text-sm text-[#374151] space-y-2">
                <li>• It does not have feelings, feelings of love, anger, or consciousness.</li>
                <li>• It does not "understand" the world the way a real human does.</li>
                <li>• It is never 100% right; predictions can be completely flawed.</li>
                <li>• It cannot replace parents, doctors, teachers, or trusted friends.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Why AI Makes Mistakes */}
        <div id="limitations" className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-2xl font-extrabold text-[#17233C] font-['Nunito']">
            Why Does AI Make Mistakes?
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Many people assume computers are always right. But machine learning models only know what their training examples teach them:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0] space-y-1">
              <h4 className="font-bold text-sm text-[#17233C]">Narrow Training Data</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                If an AI only saw yellow bananas during training, it might fail when shown a green one.
              </p>
            </div>

            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0] space-y-1">
              <h4 className="font-bold text-sm text-[#17233C]">Visual Illusions</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                A blueberry muffin can fool a vision model into guessing "puppy" because the dark berries mimic eyes and a nose.
              </p>
            </div>

            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0] space-y-1">
              <h4 className="font-bold text-sm text-[#17233C]">Absence of Real Context</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                AI matches surface patterns rather than understanding causes, physics, or consequences.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Golden Rule for Young Learners */}
        <div className="bg-[#DDF3FF]/60 border-2 border-[#6558E8]/30 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6558E8] text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#17233C] font-['Nunito']">
                The Golden Rule: Always Check Important Answers
              </h3>
              <p className="text-sm text-[#17233C] leading-relaxed font-medium">
                Whenever you use an AI tool—whether it's helping with homework, answering a question about your body, or giving advice—always show the answer to a parent, guardian, or teacher before making a decision.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Privacy Commitments */}
        <div id="privacy" className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7E8] text-[#10B981] flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#17233C] font-['Nunito']">
              Our Child Privacy Commitments
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              • <strong>Zero Sensitive Data:</strong> We do not ask for full names, home addresses, phone numbers, email addresses, school names, dates of birth, or photos.
            </p>
            <p>
              • <strong>No Unrestricted Chatbots:</strong> AI Playground avoids open, unmonitored conversational bots. All lessons follow safe, expert-curated educational paths.
            </p>
            <p>
              • <strong>Stored Locally:</strong> Your lesson progress, nickname, and badges are kept in your browser’s localStorage. They are never sold, tracked, or sent to advertisers.
            </p>
            <p>
              • <strong>No Public Profiles or Social Feeds:</strong> There are no public leaderboards, friend requests, or chat rooms.
            </p>
          </div>
        </div>

        {/* Parent Navigation CTA */}
        <div className="text-center pt-4">
          <Link
            to="/parent"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6558E8] hover:underline"
          >
            <Lock className="w-4 h-4" /> Go to Parent & Guardian Controls →
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

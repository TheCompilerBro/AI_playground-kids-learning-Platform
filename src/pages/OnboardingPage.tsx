import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEARNING_BANDS } from '../data/learningBands';
import { LearningBandCard } from '../components/learning/LearningBandCard';
import { useProgress } from '../hooks/useProgress';
import { RobotMascot } from '../components/ui/RobotMascot';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { PageContainer } from '../components/layout/PageContainer';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import type { LearningBand } from '../types';

export const OnboardingPage: React.FC = () => {
  const { progress, setLearningBand, setNickname } = useProgress();
  const navigate = useNavigate();

  const [selectedBand, setSelectedBandState] = useState<LearningBand>(progress.selectedBand || 'explorer');
  const [nicknameInput, setNicknameInput] = useState(progress.nickname || '');

  const handleSelectBand = (band: LearningBand) => {
    setSelectedBandState(band);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLearningBand(selectedBand);
    if (nicknameInput.trim()) {
      setNickname(nicknameInput.trim());
    }
    navigate('/dashboard');
  };

  return (
    <PageContainer size="default">
      <div className="max-w-4xl mx-auto space-y-10 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <RobotMascot mood="curious" size={110} className="mx-auto" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3.5 py-1 rounded-full">
            Step 1 of 1: Choose Your Adventure
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17233C] font-['Nunito']">
            Which level feels right for you?
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Pick an age band to get started. Don't worry—you can explore lessons from any band whenever you like!
          </p>
        </div>

        {/* 3 Selectable Learning Band Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="radiogroup" aria-label="Learning band selection">
          {Object.values(LEARNING_BANDS).map((band) => (
            <LearningBandCard
              key={band.id}
              band={band}
              isSelected={selectedBand === band.id}
              onSelect={() => handleSelectBand(band.id)}
            />
          ))}
        </div>

        {/* Optional Nickname & Privacy note */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 max-w-xl mx-auto shadow-xs space-y-6">
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label htmlFor="nickname" className="block text-sm font-bold text-[#17233C] mb-1">
                Optional Nickname (or leave as Young Explorer):
              </label>
              <input
                id="nickname"
                type="text"
                maxLength={20}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="e.g. Star Coder, Alex, Sunny"
                className="w-full px-4 py-3 rounded-2xl border border-[#E8E8F0] text-base font-semibold text-[#17233C] focus:border-[#6558E8] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#065F46] bg-[#DDF7E8] p-3 rounded-xl font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Privacy Guarantee: We never ask for full names, photos, emails, birthdays, or locations.
              </span>
            </div>

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Continue to My Dashboard
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

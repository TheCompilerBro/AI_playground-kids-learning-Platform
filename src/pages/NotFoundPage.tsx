import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { RobotMascot } from '../components/ui/RobotMascot';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer size="narrow">
      <div className="bg-white rounded-3xl border border-[#E8E8F0] p-8 sm:p-14 text-center max-w-lg mx-auto shadow-xs my-8 space-y-6">
        <RobotMascot mood="thinking" size={120} className="mx-auto" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#F59E0B] bg-[#FFE9A8] px-3.5 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#17233C] font-['Nunito']">
          Lost in the Playground?
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
          Looks like this page doesn’t exist or has moved! Let’s get you back to the activities and games.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <PrimaryButton onClick={() => navigate('/dashboard')} icon={<Home className="w-4 h-4" />}>
            Go to My Dashboard
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/learn')} icon={<Compass className="w-4 h-4" />}>
            Explore Learning Bands
          </SecondaryButton>
        </div>
      </div>
    </PageContainer>
  );
};

import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ParentGate } from '../components/ui/ParentGate';
import { useProgress } from '../hooks/useProgress';
import { storage } from '../services/storage';
import { LEARNING_BANDS } from '../data/learningBands';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import {
  Sliders,
  Database,
  Lock,
  CheckCircle2,
  Info,
  Trash2,
  Download,
} from 'lucide-react';
import type { LearningBand, ParentSettings } from '../types';

export const ParentPage: React.FC = () => {
  const { progress, stats, setLearningBand, resetProgress } = useProgress();
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => storage.getParentSettings());
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showGate, setShowGate] = useState(true);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleUpdateBand = (band: LearningBand) => {
    setLearningBand(band);
    const updated: ParentSettings = {
      ...parentSettings,
      selectedLearningBand: band,
    };
    setParentSettings(updated);
    storage.setParentSettings(updated);
    triggerSaveNotice();
  };

  const handleToggleAIAssistant = () => {
    const updated: ParentSettings = {
      ...parentSettings,
      aiAssistantEnabled: !parentSettings.aiAssistantEnabled,
    };
    setParentSettings(updated);
    storage.setParentSettings(updated);
    triggerSaveNotice();
  };

  const triggerSaveNotice = () => {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      progress: storage.getUserProgress(),
      settings: storage.getParentSettings(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-playground-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (window.confirm('Delete all local learning progress and reset settings to default?')) {
      resetProgress();
      storage.setParentSettings({
        aiAssistantEnabled: true,
        selectedLearningBand: 'explorer',
        dataPreferences: {
          localStorageOnly: true,
          shareDiagnostics: false,
        },
      });
      setParentSettings(storage.getParentSettings());
      alert('Local data cleared.');
    }
  };

  if (!isUnlocked) {
    return (
      <PageContainer size="narrow">
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#6558E8]/10 text-[#6558E8] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#17233C] font-['Nunito'] mb-2">
              Parent & Guardian Gate
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              This area is reserved for parents, guardians, and educators to review learning progress and safety controls.
            </p>
          </div>

          <PrimaryButton onClick={() => setShowGate(true)}>
            Verify to Enter
          </PrimaryButton>
        </div>

        <ParentGate
          isOpen={showGate}
          onSuccess={() => {
            setIsUnlocked(true);
            setShowGate(false);
          }}
          onClose={() => setShowGate(false)}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="default">
      <div className="space-y-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8F0]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3 py-1 rounded-full">
                Parent & Educator Area
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#17233C] mt-2 font-['Nunito']">
                Learning Overview & Safety Controls
              </h1>
              <p className="text-sm text-[#64748B]">
                Review learner achievements, set age bands, and manage local storage.
              </p>
            </div>

            {saveNotice && (
              <span className="text-xs font-bold text-[#065F46] bg-[#DDF7E8] px-3 py-1 rounded-full animate-fade-in flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          {/* Prototype disclaimer callout */}
          <div className="mt-4 p-4 bg-[#FFFDF8] border border-[#FFE9A8] rounded-2xl flex items-start gap-3 text-xs text-[#92400E]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Prototype Notice:</strong> These settings and progress data are stored strictly in this browser’s localStorage. The current math challenge gate is a client-side prototype and does not replace production-grade parental authentication.
            </div>
          </div>
        </div>

        {/* Learning Band Configurator */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#17233C]">
                Active Learning Band
              </h2>
              <p className="text-xs text-[#64748B]">
                Choose the recommended difficulty band for your child.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(LEARNING_BANDS).map((band) => {
              const isSelected = progress.selectedBand === band.id;
              return (
                <div
                  key={band.id}
                  onClick={() => handleUpdateBand(band.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#6558E8] bg-[#DDF3FF]/20 shadow-xs'
                      : 'border-[#E8E8F0] hover:border-[#6558E8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#6558E8]">{band.ageRange}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#6558E8]" />}
                  </div>
                  <h4 className="font-bold text-base text-[#17233C] mb-1">{band.name}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{band.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Summary Card */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#17233C] pb-2 border-b border-[#E8E8F0]">
            Learning Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0]">
              <span className="text-2xl font-black text-[#17233C]">{stats.completedCount}</span>
              <p className="text-xs text-[#64748B]">Completed Lessons</p>
            </div>
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0]">
              <span className="text-2xl font-black text-[#17233C]">{stats.percentage}%</span>
              <p className="text-xs text-[#64748B]">Curriculum Completion</p>
            </div>
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0]">
              <span className="text-2xl font-black text-[#17233C]">{stats.earnedBadgesCount}</span>
              <p className="text-xs text-[#64748B]">Badges Earned</p>
            </div>
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E8E8F0]">
              <span className="text-2xl font-black text-[#17233C]">{progress.labTrialsCompleted}</span>
              <p className="text-xs text-[#64748B]">Lab Experiments</p>
            </div>
          </div>
        </div>

        {/* Prototype AI Assistant & Chat Boundaries Toggle */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17233C] mb-1">
                Optional AI Assistant Prototype Setting
              </h2>
              <p className="text-sm text-[#64748B] max-w-xl leading-relaxed">
                Control whether contextual AI tutoring hints are enabled. Currently, all lessons use strictly curated, expert-reviewed educational content without open-ended chat generation.
              </p>
            </div>

            <button
              onClick={handleToggleAIAssistant}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                parentSettings.aiAssistantEnabled ? 'bg-[#6558E8]' : 'bg-[#CBD5E1]'
              }`}
              role="switch"
              aria-checked={parentSettings.aiAssistantEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  parentSettings.aiAssistantEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-[#DDF3FF]/60 border border-[#BDE3FF] rounded-2xl text-xs text-[#0369A1] space-y-1">
            <strong>Future API Architecture Notice:</strong>
            <p>
              If a server-side AI model is added in future releases, it will run exclusively via backend proxies with age-appropriate prompting, content filtering, rate limits, and zero retention of children's chat or voice data. No client-side provider API keys are ever stored in the browser.
            </p>
          </div>
        </div>

        {/* Data & Privacy Controls */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7E8] text-[#10B981] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#17233C]">
                Data Privacy & Local Storage
              </h2>
              <p className="text-xs text-[#64748B]">
                Full control over your child's data. Everything stays on your computer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <SecondaryButton
              size="sm"
              onClick={handleExportData}
              icon={<Download className="w-4 h-4" />}
            >
              Export Progress (JSON)
            </SecondaryButton>

            <button
              onClick={handleDeleteAllData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#B42318] hover:bg-[#FEE2E2] border border-[#FCA5A5] transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All Local Data
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

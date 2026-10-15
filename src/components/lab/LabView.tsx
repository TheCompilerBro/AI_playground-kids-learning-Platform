import React, { useState } from 'react';
import { LAB_DATASETS } from '../../data/labData';
import { classifierDemo } from '../../services/classifierDemo';
import { useProgress } from '../../hooks/useProgress';
import { RobotMascot } from '../ui/RobotMascot';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import type { LabPrediction, LabSample } from '../../types';

export const LabView: React.FC = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('fruit-classifier');
  const [currentStage, setCurrentStage] = useState<'choose' | 'train' | 'test'>('choose');

  // Stage 1 State: Labeled examples { sampleId: category }
  const [labeledExamples, setLabeledExamples] = useState<Record<string, string>>({
    'train-1': 'Fruit',
    'train-2': 'Fruit',
    'train-5': 'Not Fruit',
  });

  // Stage 2 State: Training progress
  const [trainingStep, setTrainingStep] = useState(0);

  // Stage 3 State: Selected test sample and prediction result
  const [selectedTestSample, setSelectedTestSample] = useState<LabSample | null>(null);
  const [prediction, setPrediction] = useState<LabPrediction | null>(null);

  const { recordLabTrial } = useProgress();

  const dataset = LAB_DATASETS.find((d) => d.id === selectedDatasetId) || LAB_DATASETS[0];

  const handleToggleLabel = (sampleId: string, category: string) => {
    setLabeledExamples((prev) => {
      if (prev[sampleId] === category) {
        // deselect
        const next = { ...prev };
        delete next[sampleId];
        return next;
      }
      return {
        ...prev,
        [sampleId]: category,
      };
    });
  };

  const labeledCount = Object.keys(labeledExamples).length;
  const canTrain = labeledCount >= 2;

  const startTraining = () => {
    setCurrentStage('train');
    setTrainingStep(1);

    setTimeout(() => setTrainingStep(2), 700);
    setTimeout(() => setTrainingStep(3), 1400);
    setTimeout(() => {
      setCurrentStage('test');
      // pre-select first test sample
      const firstTest = dataset.testSamples[0];
      setSelectedTestSample(firstTest);
      const res = classifierDemo.predict(dataset.id, firstTest, labeledExamples);
      setPrediction(res);
      recordLabTrial();
    }, 2200);
  };

  const handleSelectTestSample = (sample: LabSample) => {
    setSelectedTestSample(sample);
    const res = classifierDemo.predict(dataset.id, sample, labeledExamples);
    setPrediction(res);
  };

  const handleReset = () => {
    setCurrentStage('choose');
    setPrediction(null);
    setSelectedTestSample(null);
    setLabeledExamples({
      'train-1': 'Fruit',
      'train-2': 'Fruit',
      'train-5': 'Not Fruit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3 py-1 rounded-full flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" /> Hands-on AI Experiment
              </span>
              <span className="text-xs font-bold text-[#64748B] bg-[#F8F7F2] px-2.5 py-1 rounded-full border border-[#E8E8F0]">
                Simulation Demo
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17233C] font-['Nunito']">
              Train a Tiny AI Model
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Computers do not guess on their own. They compare test items against the examples you give them. Give your model examples, train it, and test what it predicts!
            </p>
          </div>

          <RobotMascot
            mood={currentStage === 'test' ? 'celebrating' : 'thinking'}
            size={100}
            className="hidden sm:inline-flex shrink-0"
          />
        </div>

        {/* Dataset selector tabs */}
        <div className="mt-6 pt-6 border-t border-[#E8E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#17233C] uppercase tracking-wide">
              Dataset:
            </span>
            {LAB_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => {
                  setSelectedDatasetId(ds.id);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedDatasetId === ds.id
                    ? 'bg-[#6558E8] text-white border-[#6558E8]'
                    : 'bg-[#F8F7F2] text-[#64748B] border-[#E8E8F0] hover:bg-[#E8E8F0]'
                }`}
              >
                {ds.name}
              </button>
            ))}
          </div>

          {/* Honest Simulation Disclaimer */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Info className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Interactive demonstration of machine learning principles</span>
          </div>
        </div>
      </div>

      {/* 3-Stage Progress Indicator */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${
            currentStage === 'choose'
              ? 'bg-[#DDF3FF] border-[#6558E8] text-[#6558E8] font-bold shadow-xs'
              : labeledCount >= 2
              ? 'bg-[#DDF7E8] border-[#10B981] text-[#065F46] font-semibold'
              : 'bg-white border-[#E8E8F0] text-[#64748B]'
          }`}
        >
          <span className="text-xs font-mono block">STAGE 1</span>
          <span className="text-xs sm:text-base font-bold">1. Choose Examples</span>
        </div>

        <div
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${
            currentStage === 'train'
              ? 'bg-[#FFE9A8] border-[#F59E0B] text-[#92400E] font-bold shadow-xs'
              : currentStage === 'test'
              ? 'bg-[#DDF7E8] border-[#10B981] text-[#065F46] font-semibold'
              : 'bg-white border-[#E8E8F0] text-[#64748B]'
          }`}
        >
          <span className="text-xs font-mono block">STAGE 2</span>
          <span className="text-xs sm:text-base font-bold">2. Train Model</span>
        </div>

        <div
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${
            currentStage === 'test'
              ? 'bg-[#DDF3FF] border-[#6558E8] text-[#6558E8] font-bold shadow-xs'
              : 'bg-white border-[#E8E8F0] text-[#64748B]'
          }`}
        >
          <span className="text-xs font-mono block">STAGE 3</span>
          <span className="text-xs sm:text-base font-bold">3. Test & Learn</span>
        </div>
      </div>

      {/* STAGE 1: CHOOSE & LABEL EXAMPLES */}
      {currentStage === 'choose' && (
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8F0]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17233C] font-['Nunito']">
                Step 1: Label Examples for the AI
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Click <span className="font-bold text-[#6558E8]">"{dataset.categoryA}"</span> or{' '}
                <span className="font-bold text-[#F59E0B]">"{dataset.categoryB}"</span> under each card to teach the model.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B] bg-[#F8F7F2] px-3 py-1.5 rounded-full border border-[#E8E8F0]">
                {labeledCount} Examples Labeled
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataset.trainingSamples.map((sample) => {
              const assignedCategory = labeledExamples[sample.id];

              return (
                <div
                  key={sample.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    assignedCategory === dataset.categoryA
                      ? 'border-[#6558E8] bg-[#DDF3FF]/20 shadow-xs'
                      : assignedCategory === dataset.categoryB
                      ? 'border-[#F59E0B] bg-[#FFE9A8]/20 shadow-xs'
                      : 'border-[#E8E8F0] bg-white hover:border-[#6558E8]/40'
                  }`}
                >
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] flex items-center justify-center text-4xl mb-3 mx-auto shadow-xs">
                      {sample.emoji}
                    </div>

                    <h4 className="font-bold text-base text-[#17233C] text-center mb-1">
                      {sample.name}
                    </h4>

                    {/* Features list */}
                    <ul className="text-[11px] text-[#64748B] space-y-0.5 mb-4 px-1">
                      {sample.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#6558E8]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Label buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-[#E8E8F0]">
                    <button
                      type="button"
                      onClick={() => handleToggleLabel(sample.id, dataset.categoryA)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        assignedCategory === dataset.categoryA
                          ? 'bg-[#6558E8] text-white border-[#6558E8]'
                          : 'bg-[#F8F7F2] text-[#17233C] border-[#E8E8F0] hover:bg-[#E8E8F0]'
                      }`}
                    >
                      {dataset.categoryA}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleLabel(sample.id, dataset.categoryB)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        assignedCategory === dataset.categoryB
                          ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                          : 'bg-[#F8F7F2] text-[#17233C] border-[#E8E8F0] hover:bg-[#E8E8F0]'
                      }`}
                    >
                      {dataset.categoryB}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-6 border-t border-[#E8E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#64748B]">
              Tip: Include examples in <strong>both</strong> categories to help the model learn the difference!
            </p>

            <PrimaryButton
              size="lg"
              disabled={!canTrain}
              onClick={startTraining}
              icon={<Sparkles className="w-5 h-5" />}
            >
              {canTrain ? `Train Model with ${labeledCount} Examples` : 'Label at least 2 examples to train'}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* STAGE 2: TRAINING PROGRESS ANIMATION */}
      {currentStage === 'train' && (
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
          <RobotMascot mood="thinking" size={110} className="mx-auto animate-pulse" />
          <h2 className="text-2xl font-extrabold text-[#17233C] font-['Nunito']">
            Teaching the Model...
          </h2>
          <p className="text-sm text-[#64748B]">
            The computer is looking through your {labeledCount} labeled examples to find shared patterns.
          </p>

          <div className="space-y-3 text-left max-w-sm mx-auto text-xs font-semibold">
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${trainingStep >= 1 ? 'bg-[#DDF7E8] text-[#065F46] border-[#86EFAC]' : 'bg-[#F8F7F2] text-[#64748B]'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 1: Reading shape, color, and texture features</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${trainingStep >= 2 ? 'bg-[#DDF7E8] text-[#065F46] border-[#86EFAC]' : 'bg-[#F8F7F2] text-[#64748B]'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 2: Calculating category patterns and weights</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${trainingStep >= 3 ? 'bg-[#DDF7E8] text-[#065F46] border-[#86EFAC]' : 'bg-[#F8F7F2] text-[#64748B]'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 3: Model ready for test predictions!</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: TEST UNSEEN EXAMPLES */}
      {currentStage === 'test' && (
        <div className="space-y-6">
          {/* Header row */}
          <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E8F0]">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981] bg-[#DDF7E8] px-3 py-1 rounded-full">
                  Model Trained!
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#17233C] mt-2 font-['Nunito']">
                  Step 3: Test Unseen Objects
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Pick a test card below to see what your trained AI predicts!
                </p>
              </div>

              <SecondaryButton size="sm" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
                Re-train / Change Examples
              </SecondaryButton>
            </div>

            {/* Test Cards Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {dataset.testSamples.map((sample) => {
                const isSelected = selectedTestSample?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectTestSample(sample)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#6558E8] bg-[#DDF3FF]/30 ring-3 ring-[#6558E8]/15 shadow-sm'
                        : 'border-[#E8E8F0] bg-white hover:border-[#6558E8]/40 hover:bg-[#F8F7F2]'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2">{sample.emoji}</div>
                    <h4 className="font-bold text-sm text-[#17233C] leading-tight mb-1">
                      {sample.name}
                    </h4>
                    <span className="text-[10px] text-[#64748B] block font-medium">
                      Real: {sample.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prediction Result Display */}
          {prediction && (
            <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E8E8F0]">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#FFFDF8] border border-[#E8E8F0] flex items-center justify-center text-5xl shrink-0 shadow-xs">
                    {prediction.sample.emoji}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                      Test Item:
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#17233C] font-['Nunito']">
                      {prediction.sample.name}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      True Category: <strong className="text-[#17233C]">{prediction.sample.category}</strong>
                    </p>
                  </div>
                </div>

                {/* AI Guess Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center gap-4 ${
                    prediction.isCorrect
                      ? 'bg-[#DDF7E8]/60 border-[#86EFAC]'
                      : 'bg-[#FFE9A8]/50 border-[#FDE047]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${
                      prediction.isCorrect ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                    }`}
                  >
                    {prediction.isCorrect ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <AlertTriangle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                      AI Model Guess:
                    </span>
                    <span className="text-xl font-black text-[#17233C]">
                      "{prediction.predictedCategory}"
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#64748B] block">
                      Estimated Confidence: {prediction.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation of the Prediction */}
              <div className="space-y-4">
                <div className="p-5 bg-[#FFFDF8] border border-[#E8E8F0] rounded-2xl">
                  <h4 className="text-sm font-bold text-[#17233C] mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6558E8]" />
                    How Did the AI Reach This Guess?
                  </h4>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {prediction.explanation}
                  </p>
                </div>

                {/* Reflection Prompt */}
                <div className="p-5 bg-[#DDF3FF]/60 border border-[#BDE3FF] rounded-2xl">
                  <h4 className="text-sm font-bold text-[#0284C7] mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                    Detective Question: Why Might the AI Guess Incorrectly?
                  </h4>
                  <p className="text-sm text-[#17233C] font-medium leading-relaxed">
                    {prediction.reflectionQuestion}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

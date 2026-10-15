import type { LearningBand, LearningBandInfo } from '../types';

export const LEARNING_BANDS: Record<LearningBand, LearningBandInfo> = {
  explorer: {
    id: 'explorer',
    name: 'AI Explorer',
    ageRange: 'Ages 5–6',
    badgeTitle: 'Curious Explorer',
    description: 'Discover how computers look at colors, shapes, and pictures through playful games.',
    focus: ['Color & Shape Sorting', 'Visual Matching', 'Simple Cause & Effect', 'Minimal Reading'],
    color: '#6558E8',
    accentBg: '#DDF3FF',
  },
  detective: {
    id: 'detective',
    name: 'AI Detective',
    ageRange: 'Ages 7–8',
    badgeTitle: 'Pattern Solver',
    description: 'Hunt for hidden clues, sort examples, and uncover how computers make smart guesses.',
    focus: ['Pattern Recognition', 'Labeling Examples', 'Classification Basics', 'Testing Predictions'],
    color: '#10B981',
    accentBg: '#DDF7E8',
  },
  creator: {
    id: 'creator',
    name: 'AI Creator',
    ageRange: 'Ages 9–10',
    badgeTitle: 'Junior Scientist',
    description: 'Experiment with training sets, test real predictions, and discover why AI makes mistakes.',
    focus: ['Training vs Testing Data', 'Model Limitations & Bias', 'Uncertainty & Confidence', 'Responsible Tech'],
    color: '#F59E0B',
    accentBg: '#FFE9A8',
  },
};

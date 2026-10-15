import type { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'badge-what-is-ai',
    name: 'Curious Thinker',
    description: 'Discovered what Artificial Intelligence is and how it uses rules and patterns!',
    icon: 'Sparkles',
    band: 'explorer',
    accentColor: '#6558E8',
  },
  {
    id: 'badge-teach-robot',
    name: 'Robot Teacher',
    description: 'Showed a robot how to categorize and sort items using clear examples!',
    icon: 'Bot',
    band: 'explorer',
    accentColor: '#10B981',
  },
  {
    id: 'badge-pattern-detective',
    name: 'Pattern Detective',
    description: 'Found hidden repetitions and successfully predicted what comes next!',
    icon: 'Search',
    band: 'detective',
    accentColor: '#3B82F6',
  },
  {
    id: 'badge-train-ai',
    name: 'AI Trainer',
    description: 'Connected training examples with labels to help an AI model learn!',
    icon: 'BrainCircuit',
    band: 'detective',
    accentColor: '#F59E0B',
  },
  {
    id: 'badge-mistakes-expert',
    name: 'Mistake Investigator',
    description: 'Uncovered why AI is not magic and why humans should always double-check important answers!',
    icon: 'ShieldCheck',
    band: 'creator',
    accentColor: '#EC4899',
  },
  {
    id: 'badge-lab-pioneer',
    name: 'Lab Explorer',
    band: 'creator',
    description: 'Completed a full hands-on machine learning experiment in the AI Lab!',
    icon: 'FlaskConical',
    accentColor: '#8B5CF6',
  },
];

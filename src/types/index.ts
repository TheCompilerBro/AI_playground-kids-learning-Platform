export type LearningBand = 'explorer' | 'detective' | 'creator';

export interface LearningBandInfo {
  id: LearningBand;
  name: string;
  ageRange: string;
  badgeTitle: string;
  description: string;
  focus: string[];
  color: string;
  accentBg: string;
}

export type StepType = 'concept' | 'activity' | 'quiz' | 'celebrate';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  hint?: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: QuestionOption[];
  explanation: string;
  encouragement: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  category: string;
  imageUrl?: string;
  iconName?: string;
  description?: string;
}

export interface ActivityConfig {
  type: 'sort' | 'pattern' | 'label' | 'spot_mistake' | 'feature_match';
  instruction: string;
  categories?: string[];
  items?: ActivityItem[];
  patternSequence?: string[];
  patternMissingIndex?: number;
  patternOptions?: string[];
  patternCorrectAnswer?: string;
  targetCategory?: string;
}

export interface LessonStep {
  id: string;
  type: StepType;
  title: string;
  instruction: string;
  helperText?: string;
  activityConfig?: ActivityConfig;
  question?: Question;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  learningBand: LearningBand;
  durationMinutes: number;
  objectives: string[];
  badgeId: string;
  icon: string;
  steps: LessonStep[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  band: LearningBand;
  accentColor: string;
  earnedAt?: string;
}

export interface LessonProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  completedAt?: string;
  attempts: number;
}

export interface UserProgress {
  selectedBand: LearningBand;
  nickname: string;
  completedLessonIds: string[];
  lessonProgress: Record<string, LessonProgress>;
  earnedBadgeIds: string[];
  labTrialsCompleted: number;
  lastUpdated: string;
}

export interface ParentSettings {
  aiAssistantEnabled: boolean;
  selectedLearningBand: LearningBand;
  dataPreferences: {
    localStorageOnly: boolean;
    shareDiagnostics: boolean;
  };
}

export interface LabSample {
  id: string;
  name: string;
  category: 'Fruit' | 'Not Fruit' | 'Cat' | 'Dog';
  features: string[];
  emoji: string;
  isTestSample?: boolean;
  notes?: string;
}

export interface LabPrediction {
  sample: LabSample;
  predictedCategory: string;
  confidence: number;
  isCorrect: boolean;
  explanation: string;
  reflectionQuestion: string;
}

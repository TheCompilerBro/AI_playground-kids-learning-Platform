import type { UserProgress, ParentSettings, LearningBand } from '../types';

const PROGRESS_KEY = 'ai_playground_progress_v1';
const PARENT_SETTINGS_KEY = 'ai_playground_parent_settings_v1';

export const DEFAULT_USER_PROGRESS: UserProgress = {
  selectedBand: 'explorer',
  nickname: 'Young Explorer',
  completedLessonIds: [],
  lessonProgress: {},
  earnedBadgeIds: [],
  labTrialsCompleted: 0,
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  aiAssistantEnabled: true,
  selectedLearningBand: 'explorer',
  dataPreferences: {
    localStorageOnly: true,
    shareDiagnostics: false,
  },
};

class StorageService {
  private memoryFallback: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    return this.memoryFallback.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback to in-memory if quota exceeded
      }
    }
    this.memoryFallback.set(key, value);
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    }
    this.memoryFallback.delete(key);
  }

  getUserProgress(): UserProgress {
    const raw = this.getItem(PROGRESS_KEY);
    if (!raw) {
      this.setUserProgress(DEFAULT_USER_PROGRESS);
      return { ...DEFAULT_USER_PROGRESS };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_USER_PROGRESS,
        ...parsed,
        lessonProgress: parsed.lessonProgress || {},
        completedLessonIds: parsed.completedLessonIds || [],
        earnedBadgeIds: parsed.earnedBadgeIds || [],
      };
    } catch {
      return { ...DEFAULT_USER_PROGRESS };
    }
  }

  setUserProgress(progress: UserProgress): void {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    this.setItem(PROGRESS_KEY, JSON.stringify(updated));
  }

  getParentSettings(): ParentSettings {
    const raw = this.getItem(PARENT_SETTINGS_KEY);
    if (!raw) {
      this.setParentSettings(DEFAULT_PARENT_SETTINGS);
      return { ...DEFAULT_PARENT_SETTINGS };
    }
    try {
      return {
        ...DEFAULT_PARENT_SETTINGS,
        ...JSON.parse(raw),
      };
    } catch {
      return { ...DEFAULT_PARENT_SETTINGS };
    }
  }

  setParentSettings(settings: ParentSettings): void {
    this.setItem(PARENT_SETTINGS_KEY, JSON.stringify(settings));
  }

  resetAllProgress(): void {
    this.setUserProgress({
      ...DEFAULT_USER_PROGRESS,
      selectedBand: this.getUserProgress().selectedBand, // retain selected band if preferred
      lastUpdated: new Date().toISOString(),
    });
  }

  seedDemoProgress(band: LearningBand = 'explorer'): UserProgress {
    const seeded: UserProgress = {
      selectedBand: band,
      nickname: 'Alex',
      completedLessonIds: ['what-is-ai'],
      lessonProgress: {
        'what-is-ai': {
          lessonId: 'what-is-ai',
          status: 'completed',
          score: 100,
          attempts: 1,
          completedAt: new Date().toISOString(),
        },
      },
      earnedBadgeIds: ['badge-what-is-ai'],
      labTrialsCompleted: 1,
      lastUpdated: new Date().toISOString(),
    };
    this.setUserProgress(seeded);
    return seeded;
  }
}

export const storage = new StorageService();

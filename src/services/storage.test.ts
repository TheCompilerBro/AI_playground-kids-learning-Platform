import { describe, it, expect, beforeEach } from 'vitest';
import { storage, DEFAULT_USER_PROGRESS } from './storage';

describe('StorageService', () => {
  beforeEach(() => {
    storage.resetAllProgress();
  });

  it('initializes with default user progress', () => {
    const progress = storage.getUserProgress();
    expect(progress.selectedBand).toBe('explorer');
    expect(progress.completedLessonIds).toEqual([]);
    expect(progress.earnedBadgeIds).toEqual([]);
  });

  it('persists and retrieves updated progress', () => {
    const updated = {
      ...DEFAULT_USER_PROGRESS,
      nickname: 'Luna Coder',
      completedLessonIds: ['what-is-ai'],
      earnedBadgeIds: ['badge-what-is-ai'],
    };
    storage.setUserProgress(updated);

    const retrieved = storage.getUserProgress();
    expect(retrieved.nickname).toBe('Luna Coder');
    expect(retrieved.completedLessonIds).toContain('what-is-ai');
    expect(retrieved.earnedBadgeIds).toContain('badge-what-is-ai');
  });

  it('resets progress cleanly', () => {
    storage.setUserProgress({
      ...DEFAULT_USER_PROGRESS,
      nickname: 'Test Learner',
      completedLessonIds: ['what-is-ai', 'teach-a-robot'],
    });

    storage.resetAllProgress();
    const progress = storage.getUserProgress();
    expect(progress.completedLessonIds).toEqual([]);
  });

  it('seeds demo progress with completed lesson and badge', () => {
    const seeded = storage.seedDemoProgress('detective');
    expect(seeded.selectedBand).toBe('detective');
    expect(seeded.completedLessonIds).toContain('what-is-ai');
    expect(seeded.earnedBadgeIds).toContain('badge-what-is-ai');
  });
});

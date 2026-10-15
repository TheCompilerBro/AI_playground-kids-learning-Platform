import { describe, it, expect, beforeEach } from 'vitest';
import { progressService } from './progressService';

describe('ProgressService', () => {
  beforeEach(() => {
    progressService.resetProgress();
  });

  it('updates learning band and notifies listeners', () => {
    const updated = progressService.setLearningBand('creator');
    expect(updated.selectedBand).toBe('creator');
    expect(progressService.getProgress().selectedBand).toBe('creator');
  });

  it('completes a lesson and awards badge', () => {
    const result = progressService.completeLesson('what-is-ai', 100);
    expect(result.progress.completedLessonIds).toContain('what-is-ai');
    expect(result.newlyEarnedBadges).toContain('badge-what-is-ai');
    expect(result.progress.earnedBadgeIds).toContain('badge-what-is-ai');
    expect(result.progress.lessonProgress['what-is-ai'].score).toBe(100);
  });

  it('increments lab trials and unlocks lab pioneer badge', () => {
    const res = progressService.recordLabTrial();
    expect(res.progress.labTrialsCompleted).toBe(1);
    expect(res.progress.earnedBadgeIds).toContain('badge-lab-pioneer');
  });

  it('computes stats accurately', () => {
    progressService.completeLesson('what-is-ai', 100);
    const stats = progressService.getStats();
    expect(stats.completedCount).toBe(1);
    expect(stats.percentage).toBe(20); // 1 out of 5 lessons is 20%
    expect(stats.nextLesson?.id).toBe('teach-a-robot');
  });
});

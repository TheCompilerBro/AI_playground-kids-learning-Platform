import { storage } from './storage';
import { LESSONS } from '../data/lessons';
import { BADGES } from '../data/badges';
import type { UserProgress, LearningBand, LessonProgress } from '../types';

type ProgressListener = (progress: UserProgress) => void;

class ProgressService {
  private listeners: Set<ProgressListener> = new Set();

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(progress: UserProgress): void {
    this.listeners.forEach((listener) => {
      try {
        listener(progress);
      } catch (err) {
        console.error('Error in progress listener:', err);
      }
    });
  }

  getProgress(): UserProgress {
    return storage.getUserProgress();
  }

  setLearningBand(band: LearningBand): UserProgress {
    const current = this.getProgress();
    const updated: UserProgress = {
      ...current,
      selectedBand: band,
    };
    storage.setUserProgress(updated);
    this.notify(updated);
    return updated;
  }

  setNickname(nickname: string): UserProgress {
    const current = this.getProgress();
    const updated: UserProgress = {
      ...current,
      nickname: nickname.trim() || 'Young Explorer',
    };
    storage.setUserProgress(updated);
    this.notify(updated);
    return updated;
  }

  completeLesson(lessonId: string, score: number = 100): { progress: UserProgress; newlyEarnedBadges: string[] } {
    const current = this.getProgress();
    const lesson = LESSONS.find((l) => l.id === lessonId);
    const prevLessonProgress = current.lessonProgress[lessonId];
    
    const newLessonProgress: LessonProgress = {
      lessonId,
      status: 'completed',
      score: Math.max(score, prevLessonProgress?.score ?? 0),
      attempts: (prevLessonProgress?.attempts ?? 0) + 1,
      completedAt: new Date().toISOString(),
    };

    const completedLessonIds = Array.from(new Set([...current.completedLessonIds, lessonId]));
    const newlyEarnedBadges: string[] = [];

    const earnedBadgeIds = [...current.earnedBadgeIds];
    if (lesson?.badgeId && !earnedBadgeIds.includes(lesson.badgeId)) {
      earnedBadgeIds.push(lesson.badgeId);
      newlyEarnedBadges.push(lesson.badgeId);
    }

    const updated: UserProgress = {
      ...current,
      completedLessonIds,
      lessonProgress: {
        ...current.lessonProgress,
        [lessonId]: newLessonProgress,
      },
      earnedBadgeIds,
    };

    storage.setUserProgress(updated);
    this.notify(updated);
    return { progress: updated, newlyEarnedBadges };
  }

  recordLabTrial(): { progress: UserProgress; newlyEarnedBadges: string[] } {
    const current = this.getProgress();
    const newlyEarnedBadges: string[] = [];
    const earnedBadgeIds = [...current.earnedBadgeIds];

    if (!earnedBadgeIds.includes('badge-lab-pioneer')) {
      earnedBadgeIds.push('badge-lab-pioneer');
      newlyEarnedBadges.push('badge-lab-pioneer');
    }

    const updated: UserProgress = {
      ...current,
      labTrialsCompleted: current.labTrialsCompleted + 1,
      earnedBadgeIds,
    };

    storage.setUserProgress(updated);
    this.notify(updated);
    return { progress: updated, newlyEarnedBadges };
  }

  resetProgress(): UserProgress {
    storage.resetAllProgress();
    const reset = storage.getUserProgress();
    this.notify(reset);
    return reset;
  }

  seedDemo(): UserProgress {
    const seeded = storage.seedDemoProgress(this.getProgress().selectedBand);
    this.notify(seeded);
    return seeded;
  }

  getStats() {
    const progress = this.getProgress();
    const totalLessons = LESSONS.length;
    const completedCount = progress.completedLessonIds.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const totalBadges = BADGES.length;
    const earnedBadgesCount = progress.earnedBadgeIds.length;

    // Determine recommended next lesson
    const nextLesson = LESSONS.find((l) => !progress.completedLessonIds.includes(l.id)) || LESSONS[0];

    return {
      totalLessons,
      completedCount,
      percentage,
      totalBadges,
      earnedBadgesCount,
      nextLesson,
    };
  }
}

export const progressService = new ProgressService();

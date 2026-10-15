import { useState, useEffect, useCallback } from 'react';
import { progressService } from '../services/progressService';
import type { UserProgress, LearningBand } from '../types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => progressService.getProgress());
  const [stats, setStats] = useState(() => progressService.getStats());

  useEffect(() => {
    // Subscribe to progress changes
    const unsubscribe = progressService.subscribe((updated) => {
      setProgress(updated);
      setStats(progressService.getStats());
    });
    return unsubscribe;
  }, []);

  const setLearningBand = useCallback((band: LearningBand) => {
    const updated = progressService.setLearningBand(band);
    setProgress(updated);
    setStats(progressService.getStats());
  }, []);

  const setNickname = useCallback((nickname: string) => {
    const updated = progressService.setNickname(nickname);
    setProgress(updated);
  }, []);

  const completeLesson = useCallback((lessonId: string, score?: number) => {
    const result = progressService.completeLesson(lessonId, score);
    setProgress(result.progress);
    setStats(progressService.getStats());
    return result;
  }, []);

  const recordLabTrial = useCallback(() => {
    const result = progressService.recordLabTrial();
    setProgress(result.progress);
    setStats(progressService.getStats());
    return result;
  }, []);

  const resetProgress = useCallback(() => {
    const reset = progressService.resetProgress();
    setProgress(reset);
    setStats(progressService.getStats());
  }, []);

  const seedDemo = useCallback(() => {
    const seeded = progressService.seedDemo();
    setProgress(seeded);
    setStats(progressService.getStats());
  }, []);

  return {
    progress,
    stats,
    setLearningBand,
    setNickname,
    completeLesson,
    recordLabTrial,
    resetProgress,
    seedDemo,
  };
}

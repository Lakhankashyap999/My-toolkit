'use client';

import { useState, useEffect } from 'react';
import { UiLanguage, UserProgressState } from '@/types';

const STORAGE_KEY = 'deutschready_user_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  completedLessons: ['a0-u1'],
  xp: 120,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalMinutes: 20,
  todayMinutesPracticed: 8,
  wordsToReview: ['v-1', 'v-9', 'v-17'],
  difficultWords: ['v-9', 'v-4'], // "Words I Keep Forgetting"
  uiLanguage: 'hinglish',
  audioSlowMode: false
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const saveState = (newState: UserProgressState) => {
    setProgress(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const addXp = (amount: number) => {
    saveState({
      ...progress,
      xp: progress.xp + amount,
      todayMinutesPracticed: progress.todayMinutesPracticed + Math.ceil(amount / 10)
    });
  };

  const markLessonComplete = (lessonId: string, xpReward: number) => {
    const isNew = !progress.completedLessons.includes(lessonId);
    const updatedLessons = isNew ? [...progress.completedLessons, lessonId] : progress.completedLessons;
    saveState({
      ...progress,
      completedLessons: updatedLessons,
      xp: isNew ? progress.xp + xpReward : progress.xp
    });
  };

  const addDifficultWord = (vocabId: string) => {
    if (!progress.difficultWords.includes(vocabId)) {
      saveState({
        ...progress,
        difficultWords: [...progress.difficultWords, vocabId]
      });
    }
  };

  const removeDifficultWord = (vocabId: string) => {
    saveState({
      ...progress,
      difficultWords: progress.difficultWords.filter(id => id !== vocabId)
    });
  };

  const setUiLanguage = (lang: UiLanguage) => {
    saveState({
      ...progress,
      uiLanguage: lang
    });
  };

  const toggleSlowMode = () => {
    saveState({
      ...progress,
      audioSlowMode: !progress.audioSlowMode
    });
  };

  return {
    progress,
    isLoaded,
    addXp,
    markLessonComplete,
    addDifficultWord,
    removeDifficultWord,
    setUiLanguage,
    toggleSlowMode
  };
}

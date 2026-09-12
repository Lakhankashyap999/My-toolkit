'use client';

import { useState, useEffect, useCallback } from 'react';
import { UiLanguage, UserProgressState, UserActivity, ActiveSession } from '@/types';

const STORAGE_KEY = 'deutschready_user_progress_v1';
const SESSION_VALID_MS = 8 * 60 * 60 * 1000; // 8 hours

const DEFAULT_STATE: UserProgressState = {
  completedLessons: [], // Empty for fresh users!
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalMinutes: 20,
  todayMinutesPracticed: 0,
  wordsToReview: [],
  difficultWords: [],
  uiLanguage: 'hinglish',
  audioSlowMode: false,
  userEmail: undefined,
  lastActiveSession: null,
  activityHistory: [],
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with toolbox_email and stored progress on mount
  useEffect(() => {
    try {
      // 1. Check toolbox auth
      const storedToolboxEmail = localStorage.getItem('toolbox_email');
      const loginTime = localStorage.getItem('toolbox_login_time');
      let validEmail: string | undefined = undefined;

      if (storedToolboxEmail) {
        if (loginTime) {
          const timeDiff = Date.now() - parseInt(loginTime, 10);
          if (timeDiff < SESSION_VALID_MS) {
            validEmail = storedToolboxEmail;
          }
        } else {
          validEmail = storedToolboxEmail;
        }
      }

      // 2. Load email-specific progress if available, otherwise general storage
      let initialData: Partial<UserProgressState> | null = null;
      if (validEmail) {
        const emailSaved = localStorage.getItem(`deutschready_progress_${validEmail.toLowerCase()}`);
        if (emailSaved) {
          initialData = JSON.parse(emailSaved);
        }
      }

      if (!initialData) {
        const generalSaved = localStorage.getItem(STORAGE_KEY);
        if (generalSaved) {
          initialData = JSON.parse(generalSaved);
        }
      }

      if (initialData) {
        setProgress((prev) => ({
          ...prev,
          ...initialData,
          userEmail: validEmail || initialData?.userEmail,
        }));
      } else if (validEmail) {
        setProgress((prev) => ({
          ...prev,
          userEmail: validEmail,
        }));
      }
    } catch (e) {
      console.warn('Could not read user progress from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const saveState = useCallback((newState: UserProgressState) => {
    setProgress(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      if (newState.userEmail) {
        localStorage.setItem(
          `deutschready_progress_${newState.userEmail.toLowerCase()}`,
          JSON.stringify(newState)
        );
      }
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, []);

  // 1. Real-time Activity Recording
  const recordActivity = useCallback(
    (act: {
      type: 'lesson' | 'scenario' | 'vocab' | 'speaking' | 'practice';
      id: string;
      title: string;
      detail?: string;
      path: string;
      step?: number;
      totalSteps?: number;
    }) => {
      setProgress((prev) => {
        const now = Date.now();
        const activeSession: ActiveSession = {
          type: act.type,
          id: act.id,
          title: act.title,
          detail: act.detail,
          path: act.path,
          step: act.step,
          totalSteps: act.totalSteps,
          timestamp: now,
        };

        const newActivity: UserActivity = {
          id: `${act.id}-${now}`,
          type: act.type,
          title: act.title,
          detail: act.detail || '',
          path: act.path,
          timestamp: now,
        };

        // Prepend to history, filter duplicates in top 3, max 40 items
        const filteredHistory = (prev.activityHistory || []).filter(
          (h, idx) => !(h.path === act.path && idx < 2)
        );
        const updatedHistory = [newActivity, ...filteredHistory].slice(0, 40);

        const updated: UserProgressState = {
          ...prev,
          lastActiveSession: activeSession,
          activityHistory: updatedHistory,
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          if (updated.userEmail) {
            localStorage.setItem(
              `deutschready_progress_${updated.userEmail.toLowerCase()}`,
              JSON.stringify(updated)
            );
          }
        } catch {}

        return updated;
      });
    },
    []
  );

  // 2. Dismiss / Clear Resume Notification
  const clearResumeSession = useCallback(() => {
    saveState({
      ...progress,
      lastActiveSession: null,
    });
  }, [progress, saveState]);

  // 3. Link Email from Toolbox Login
  const setUserEmail = useCallback(
    (email: string) => {
      const clean = email.trim().toLowerCase();
      // Check if this email already had previous saved progress
      let existingEmailProgress: Partial<UserProgressState> | null = null;
      try {
        const saved = localStorage.getItem(`deutschready_progress_${clean}`);
        if (saved) existingEmailProgress = JSON.parse(saved);
      } catch {}

      const updated: UserProgressState = {
        ...progress,
        ...(existingEmailProgress || {}),
        userEmail: clean,
      };

      saveState(updated);
    },
    [progress, saveState]
  );

  // 4. Logout from Toolbox
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('toolbox_email');
      localStorage.removeItem('toolbox_login_time');
    } catch {}
    saveState({
      ...progress,
      userEmail: undefined,
    });
  }, [progress, saveState]);

  const addXp = useCallback(
    (amount: number) => {
      saveState({
        ...progress,
        xp: progress.xp + amount,
        todayMinutesPracticed: progress.todayMinutesPracticed + Math.ceil(amount / 10),
      });
    },
    [progress, saveState]
  );

  const markLessonComplete = useCallback(
    (lessonId: string, xpReward: number) => {
      const isNew = !progress.completedLessons.includes(lessonId);
      const updatedLessons = isNew
        ? [...progress.completedLessons, lessonId]
        : progress.completedLessons;

      saveState({
        ...progress,
        completedLessons: updatedLessons,
        xp: isNew ? progress.xp + xpReward : progress.xp,
        lastActiveSession: null, // finished the lesson, no need to resume it
      });
    },
    [progress, saveState]
  );

  const addDifficultWord = useCallback(
    (vocabId: string) => {
      if (!progress.difficultWords.includes(vocabId)) {
        saveState({
          ...progress,
          difficultWords: [...progress.difficultWords, vocabId],
        });
      }
    },
    [progress, saveState]
  );

  const removeDifficultWord = useCallback(
    (vocabId: string) => {
      saveState({
        ...progress,
        difficultWords: progress.difficultWords.filter((id) => id !== vocabId),
      });
    },
    [progress, saveState]
  );

  const setUiLanguage = useCallback(
    (lang: UiLanguage) => {
      saveState({
        ...progress,
        uiLanguage: lang,
      });
    },
    [progress, saveState]
  );

  const toggleSlowMode = useCallback(() => {
    saveState({
      ...progress,
      audioSlowMode: !progress.audioSlowMode,
    });
  }, [progress, saveState]);

  return {
    progress,
    isLoaded,
    addXp,
    markLessonComplete,
    addDifficultWord,
    removeDifficultWord,
    setUiLanguage,
    toggleSlowMode,
    recordActivity,
    clearResumeSession,
    setUserEmail,
    logout,
  };
}

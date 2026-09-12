'use client';

import { useState, useEffect, useCallback } from 'react';
import { UiLanguage, UserProgressState, UserActivity, ActiveSession } from '@/types';
import { supabase } from '@/lib/supabaseClient';

const STORAGE_KEY = 'deutschready_user_progress_v1';

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

// Helper to reliably find any existing logged-in email from Toolbox
export function findToolboxEmail(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const email =
      localStorage.getItem('toolbox_email') ||
      sessionStorage.getItem('toolbox_email') ||
      localStorage.getItem('user_email');
    if (email && email.trim() && email.includes('@')) {
      return email.trim().toLowerCase();
    }
  } catch {}
  return undefined;
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    // Check synchronously during initialization
    const existingEmail = findToolboxEmail();
    return {
      ...DEFAULT_STATE,
      userEmail: existingEmail,
    };
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with toolbox_email and stored progress on mount
  useEffect(() => {
    const loadDataForEmail = (email?: string) => {
      try {
        let initialData: Partial<UserProgressState> | null = null;
        if (email) {
          const emailSaved = localStorage.getItem(`deutschready_progress_${email.toLowerCase()}`);
          if (emailSaved) {
            try {
              initialData = JSON.parse(emailSaved);
            } catch {}
          }
        }

        if (!initialData) {
          const generalSaved = localStorage.getItem(STORAGE_KEY);
          if (generalSaved) {
            try {
              initialData = JSON.parse(generalSaved);
            } catch {}
          }
        }

        setProgress((prev) => {
          const finalEmail = email || initialData?.userEmail || prev.userEmail || findToolboxEmail();
          return {
            ...prev,
            ...(initialData || {}),
            userEmail: finalEmail,
          };
        });
      } catch (e) {
        console.warn('Could not read user progress from localStorage', e);
      }
      setIsLoaded(true);
    };

    // 1. Check immediate synchronous email from Toolbox
    const activeEmail = findToolboxEmail();
    loadDataForEmail(activeEmail);

    // 2. Listen to storage changes across tabs (e.g. if user logged into /account in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'toolbox_email' && e.newValue && e.newValue.includes('@')) {
        const clean = e.newValue.trim().toLowerCase();
        loadDataForEmail(clean);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Check Supabase session asynchronously in case user logged in via Google OAuth
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const sbEmail = session?.user?.email;
        if (sbEmail && sbEmail.includes('@')) {
          const clean = sbEmail.trim().toLowerCase();
          try {
            localStorage.setItem('toolbox_email', clean);
          } catch {}
          loadDataForEmail(clean);
        }
      }).catch(() => {});
    } catch {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const saveState = useCallback((newState: UserProgressState) => {
    const activeEmail = newState.userEmail || findToolboxEmail();
    const toSave: UserProgressState = {
      ...newState,
      userEmail: activeEmail,
    };

    setProgress(toSave);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      if (activeEmail) {
        localStorage.setItem(
          `deutschready_progress_${activeEmail.toLowerCase()}`,
          JSON.stringify(toSave)
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
        const activeEmail = prev.userEmail || findToolboxEmail();

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

        // Prepend to history, filter duplicates in top 2, max 40 items
        const filteredHistory = (prev.activityHistory || []).filter(
          (h, idx) => !(h.path === act.path && idx < 2)
        );
        const updatedHistory = [newActivity, ...filteredHistory].slice(0, 40);

        const updated: UserProgressState = {
          ...prev,
          userEmail: activeEmail,
          lastActiveSession: activeSession,
          activityHistory: updatedHistory,
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          if (activeEmail) {
            localStorage.setItem(
              `deutschready_progress_${activeEmail.toLowerCase()}`,
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
      try {
        localStorage.setItem('toolbox_email', clean);
      } catch {}

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
      supabase.auth.signOut().catch(() => {});
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

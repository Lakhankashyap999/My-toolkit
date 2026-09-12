'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Play, RotateCcw, X, BookOpen, Compass, Dumbbell, Mic, Sparkles } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';

export default function ResumeBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const { progress, clearResumeSession } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;
  const [visible, setVisible] = useState(false);

  const session = progress.lastActiveSession;

  useEffect(() => {
    // Only show if session exists, is under 7 days old, and we're not currently on that exact path
    if (session && session.path) {
      const isCurrentPage = pathname === session.path || pathname?.startsWith(`${session.path}/`);
      const isFresh = Date.now() - session.timestamp < 7 * 24 * 60 * 60 * 1000;
      if (!isCurrentPage && isFresh) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  }, [session, pathname]);

  if (!visible || !session) return null;

  const handleResume = () => {
    setVisible(false);
    router.push(session.path);
  };

  const handleStartFresh = () => {
    setVisible(false);
    clearResumeSession();
  };

  const getIcon = () => {
    switch (session.type) {
      case 'lesson':
        return <BookOpen className="h-5 w-5 text-rose-500" />;
      case 'scenario':
        return <Compass className="h-5 w-5 text-amber-500" />;
      case 'practice':
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case 'speaking':
        return <Mic className="h-5 w-5 text-purple-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-rose-500" />;
    }
  };

  // Human readable time ago
  const minutesAgo = Math.round((Date.now() - session.timestamp) / 60000);
  const timeAgoText =
    minutesAgo < 2
      ? 'Abhi thodi der pehle'
      : minutesAgo < 60
      ? `${minutesAgo} mins pehle`
      : minutesAgo < 1440
      ? `${Math.round(minutesAgo / 60)} ghante pehle`
      : 'Pichle session mein';

  return (
    <aside aria-label="Resume learning session" className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-[calc(100vw-24px)] sm:max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="overflow-hidden rounded-3xl border border-rose-200/80 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md dark:border-rose-900/60 dark:bg-neutral-900/95">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {t.resumeTitle}
                </span>
                <span className="text-[10px] text-neutral-400">• {timeAgoText}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 mt-0.5">
                {session.title}
              </h4>
              {session.detail && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {session.detail}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleStartFresh}
            aria-label="Dismiss resume notification"
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons: Resume vs Start Fresh */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleResume}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all min-h-[40px]"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>{t.resumeBtn}</span>
          </button>

          <button
            onClick={handleStartFresh}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 min-h-[40px]"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t.startNewBtn}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

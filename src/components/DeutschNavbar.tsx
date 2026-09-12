'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Flame, Snail, BookOpen, Mic, Compass, BookmarkCheck, Dumbbell, ArrowLeft } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import { UiLanguage } from '@/types';

export default function DeutschNavbar() {
  const pathname = usePathname();
  const { progress, setUiLanguage, toggleSlowMode } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  const navLinks = [
    { href: '/deutschready/learn', label: t.curriculum, icon: BookOpen },
    { href: '/deutschready/practice', label: t.practice, icon: Dumbbell },
    { href: '/deutschready/speak', label: t.speakingLab, icon: Mic },
    { href: '/deutschready/germany-life', label: t.scenarios, icon: Compass },
    { href: '/deutschready/vocab', label: t.vocab, icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Back to Toolkit */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Back to MyToolboxs"
            className="flex items-center gap-1 rounded-xl bg-neutral-100 px-2.5 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">MyToolboxs</span>
          </Link>

          <Link href="/deutschready" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white font-black text-xs shadow-md shadow-rose-500/20">
              DR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-neutral-900 text-base dark:text-white">
                  Deutsch<span className="text-rose-600 dark:text-rose-400">Ready</span>
                </span>
                <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  AI German
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Turtle Slow Mode Toggle */}
          <button
            onClick={toggleSlowMode}
            title={progress.audioSlowMode ? 'Slow Audio (0.75x) Enabled' : 'Normal Audio (1.0x)'}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold border transition-all ${
              progress.audioSlowMode
                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-300 shadow-xs'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
            }`}
          >
            <Snail className={`h-3 w-3 ${progress.audioSlowMode ? 'text-amber-600 dark:text-amber-400' : ''}`} />
            <span className="hidden xs:inline">
              {progress.audioSlowMode ? '0.75x' : '1.0x'}
            </span>
          </button>

          {/* Streak Counter */}
          <div
            title="Daily Learning Streak"
            className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:border-orange-900/50 dark:text-orange-300"
          >
            <Flame className="h-3 w-3 text-orange-500 fill-orange-500" />
            <span>{progress.streakDays}</span>
          </div>

          {/* XP Counter */}
          <Link
            href="/deutschready/progress"
            title="Total XP Points"
            className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>{progress.xp} XP</span>
          </Link>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              value={progress.uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value as UiLanguage)}
              aria-label="Interface Language"
              className="appearance-none rounded-lg border border-neutral-200 bg-neutral-50 py-1 pl-2 pr-5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <option value="hinglish">🇮🇳 Hinglish</option>
              <option value="english">🇬🇧 English</option>
              <option value="german">🇩🇪 Deutsch</option>
            </select>
            <div className="pointer-events-none absolute right-1.5 text-neutral-400 text-[9px]">▼</div>
          </div>
        </div>
      </div>
    </header>
  );
}

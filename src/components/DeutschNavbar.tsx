'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Sparkles,
  Flame,
  Snail,
  BookOpen,
  Mic,
  Compass,
  BookmarkCheck,
  Dumbbell,
  ArrowLeft,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import { UiLanguage } from '@/types';

export default function DeutschNavbar() {
  const pathname = usePathname();
  const { progress, setUiLanguage, toggleSlowMode } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/deutschready/learn', label: t.curriculum, icon: BookOpen },
    { href: '/deutschready/practice', label: t.practice, icon: Dumbbell },
    { href: '/deutschready/speak', label: t.speakingLab, icon: Mic },
    { href: '/deutschready/germany-life', label: t.scenarios, icon: Compass },
    { href: '/deutschready/vocab', label: t.vocab, icon: BookmarkCheck },
    { href: '/deutschready/emergency-pack', label: 'Cheat Sheet ⚡', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/98 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/98">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-xl bg-neutral-100 px-2 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">MyToolboxs</span>
          </Link>

          <Link href="/deutschready" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white font-black text-xs shadow-md shadow-rose-500/20 shrink-0">
              DR
            </div>
            <div className="hidden sm:block">
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Turtle Toggle */}
          <button
            onClick={toggleSlowMode}
            title={progress.audioSlowMode ? 'Slow Mode ON (0.75x)' : 'Normal Speed (1.0x)'}
            aria-label="Toggle turtle slow audio mode"
            className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-bold border transition-all min-h-[36px] ${
              progress.audioSlowMode
                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
            }`}
          >
            <Snail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{progress.audioSlowMode ? '0.75x' : '1.0x'}</span>
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1.5 text-[11px] font-bold text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:border-orange-900/50 dark:text-orange-300">
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span>{progress.streakDays}</span>
          </div>

          {/* XP */}
          <Link
            href="/deutschready/progress"
            className="hidden sm:flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1.5 text-[11px] font-bold text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-100 transition-colors min-h-[36px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>{progress.xp} XP</span>
          </Link>

          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <select
              value={progress.uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value as UiLanguage)}
              aria-label="Interface Language"
              className="appearance-none rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-2 pr-5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <option value="hinglish">🇮🇳 Hinglish</option>
              <option value="english">🇬🇧 English</option>
              <option value="german">🇩🇪 Deutsch</option>
            </select>
            <div className="pointer-events-none absolute right-1.5 text-neutral-400 text-[9px]">▼</div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden flex items-center justify-center rounded-xl border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 min-w-[44px] min-h-[44px]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950 pb-4 shadow-xl">
          <div className="px-4 pt-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors min-h-[48px] ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-rose-600' : 'text-neutral-500'}`} />
                  {label}
                </Link>
              );
            })}

            {/* Mobile-only: Language + XP */}
            <div className="flex items-center justify-between px-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-2">
              <Link
                href="/deutschready/progress"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 min-h-[40px]"
              >
                <Sparkles className="h-4 w-4 text-indigo-500" />
                {progress.xp} XP Earned
              </Link>
              <select
                value={progress.uiLanguage}
                onChange={(e) => { setUiLanguage(e.target.value as UiLanguage); setMobileOpen(false); }}
                className="rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 px-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <option value="hinglish">🇮🇳 Hinglish</option>
                <option value="english">🇬🇧 English</option>
                <option value="german">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

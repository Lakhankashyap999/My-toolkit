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
  History,
  UserCheck,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import { UiLanguage } from '@/types';
import ActivityDrawer from './ActivityDrawer';
import MissionSnapModal from './MissionSnapModal';

export default function DeutschNavbar() {
  const pathname = usePathname();
  const { progress, setUiLanguage, toggleSlowMode } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);
  const [missionModalOpen, setMissionModalOpen] = useState(false);

  const navLinks = [
    { href: '/deutschready/learn', label: t.curriculum, icon: BookOpen },
    { href: '/deutschready/practice', label: t.practice, icon: Dumbbell },
    { href: '/deutschready/speak', label: t.speakingLab, icon: Mic },
    { href: '/deutschready/germany-life', label: t.scenarios, icon: Compass },
    { href: '/deutschready/vocab', label: t.vocab, icon: BookmarkCheck },
    { href: '/deutschready/emergency-pack', label: t.cheatSheet, icon: Zap },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/98 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/98">
        {/* ── SINGLE ROW — no overflow ── */}
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 gap-2 min-w-0">

          {/* LEFT — Back + Logo (shrinks gracefully) */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <Link
              href="/"
              className="flex items-center justify-center gap-1 rounded-xl bg-neutral-100 px-2 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors min-h-[36px] shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">MyToolboxs</span>
            </Link>

            <Link
              href="/deutschready"
              className="flex items-center gap-1.5 min-w-0"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white font-black text-[11px] shadow-md shrink-0">
                DR
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold tracking-tight text-neutral-900 text-sm dark:text-white whitespace-nowrap">
                    Deutsch<span className="text-rose-600 dark:text-rose-400">Ready</span>
                  </span>
                  <span className="hidden md:inline-flex rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 whitespace-nowrap">
                    AI German
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* CENTER — Desktop Nav (only on lg+) */}
          <nav className="hidden lg:flex items-center gap-0.5 min-w-0 overflow-hidden">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-2 text-[11px] xl:text-xs font-medium transition-colors whitespace-nowrap min-h-[40px] ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-3 w-3 xl:h-3.5 xl:w-3.5 shrink-0 ${isActive ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Controls (never overflow) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
            {/* Turtle Toggle */}
            <button
              onClick={toggleSlowMode}
              title={progress.audioSlowMode ? 'Slow Mode ON (0.75x)' : 'Normal Speed'}
              aria-label="Toggle slow audio mode"
              className={`flex items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-bold border transition-all min-h-[32px] sm:min-h-[36px] shrink-0 ${
                progress.audioSlowMode
                  ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
              }`}
            >
              <Snail className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{progress.audioSlowMode ? '0.75x' : '1x'}</span>
            </button>

            {/* Streak */}
            <div className="flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 sm:px-2 py-1.5 text-[10px] font-bold text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:border-orange-900/50 dark:text-orange-300 shrink-0">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 shrink-0" />
              <span>{progress.streakDays}</span>
            </div>

            {/* XP — hidden on small */}
            <Link
              href="/deutschready/progress"
              className="hidden md:flex items-center gap-0.5 rounded-full bg-indigo-50 px-2 py-1.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-100 transition-colors min-h-[32px] shrink-0"
            >
              <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
              <span className="whitespace-nowrap">{progress.xp} XP</span>
            </Link>

            {/* User Account / Recent Activity Button */}
            <button
              onClick={() => setActivityDrawerOpen(true)}
              title={progress.userEmail ? `Verified: ${progress.userEmail}` : 'Recent Activity & Account Sync'}
              className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-bold border transition-all min-h-[32px] sm:min-h-[36px] shrink-0 ${
                progress.userEmail
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
              }`}
            >
              {progress.userEmail ? (
                <>
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline max-w-[120px] truncate text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {progress.userEmail.split('@')[0]}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                </>
              ) : (
                <>
                  <History className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span className="hidden md:inline">{t.recentActivity}</span>
                </>
              )}
            </button>

            {/* Our Mission Button */}
            <button
              onClick={() => setMissionModalOpen(true)}
              title="Our Mission: Free German Education"
              className="hidden lg:flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 min-h-[32px] sm:min-h-[36px] shrink-0 transition-colors cursor-pointer"
            >
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500 shrink-0" />
              <span>Mission</span>
            </button>

            {/* Language Selector — hidden below md */}
            <div className="relative hidden md:flex items-center shrink-0">
              <select
                value={progress.uiLanguage}
                onChange={(e) => setUiLanguage(e.target.value as UiLanguage)}
                aria-label="Interface Language"
                className="appearance-none rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-2 pr-5 text-[10px] font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 cursor-pointer"
              >
                <option value="hinglish">🇮🇳 HI</option>
                <option value="english">🇬🇧 EN</option>
                <option value="german">🇩🇪 DE</option>
              </select>
              <div className="pointer-events-none absolute right-1.5 text-neutral-400 text-[8px]">▼</div>
            </div>

            {/* Mobile Hamburger — visible below lg */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="lg:hidden flex items-center justify-center rounded-xl border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 min-w-[40px] min-h-[40px] shrink-0"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN MENU (below lg) ── */}
        {mobileOpen && (
          <div className="lg:hidden w-full border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950 shadow-lg">
            <div className="px-3 pt-2 pb-3 space-y-1">
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
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-rose-600' : 'text-neutral-400'}`} />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Mobile: Recent Activity Drawer Trigger */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setActivityDrawerOpen(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800 min-h-[48px]"
              >
                <History className="h-5 w-5 text-rose-500 shrink-0" />
                <span>{t.recentActivity}</span>
                {progress.userEmail && (
                  <span className="ml-auto text-xs text-emerald-600 font-bold">✓ Synced</span>
                )}
              </button>

              {/* Mobile: Our Mission */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setMissionModalOpen(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-700 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 min-h-[48px]"
              >
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500 shrink-0" />
                <span>Our Mission (100% Free Learning)</span>
              </button>

              {/* Mobile: XP + Language row */}
              <div className="flex items-center justify-between px-2 pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800">
                <Link
                  href="/deutschready/progress"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 min-h-[40px]"
                >
                  <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                  {progress.xp} XP
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSlowMode}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold border transition-all ${
                      progress.audioSlowMode
                        ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    <Snail className="h-3.5 w-3.5" />
                    <span>{progress.audioSlowMode ? '0.75x' : '1x'}</span>
                  </button>

                  <select
                    value={progress.uiLanguage}
                    onChange={(e) => { setUiLanguage(e.target.value as UiLanguage); }}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 px-2 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <option value="hinglish">🇮🇳 Hinglish</option>
                    <option value="english">🇬🇧 English</option>
                    <option value="german">🇩🇪 Deutsch</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Activity Drawer */}
      <ActivityDrawer
        isOpen={activityDrawerOpen}
        onClose={() => setActivityDrawerOpen(false)}
      />

      {/* Mission Snap Modal */}
      <MissionSnapModal
        isOpen={missionModalOpen}
        onClose={() => setMissionModalOpen(false)}
      />
    </>
  );
}

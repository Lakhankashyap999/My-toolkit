'use client';

import { Sparkles, Flame, CheckCircle2, TrendingUp, Target, BookOpen, Layers, Award } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { CURRICULUM_DATA } from '@/data/curriculum';
import Link from 'next/link';

export default function ProgressPage() {
  const { progress } = useUserProgress();

  const totalUnits = CURRICULUM_DATA.length;
  const completedCount = progress.completedLessons.length;
  const completionPct = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0;

  const goalMinutes = progress.dailyGoalMinutes || 20;
  const practicedMinutes = progress.todayMinutesPracticed || (completedCount > 0 ? 15 : 5);
  const goalPct = Math.min(100, Math.round((practicedMinutes / goalMinutes) * 100));

  // Dynamic skill mastery calculations
  const grammarPct = Math.min(100, Math.max(15, completedCount * 12));
  const genderPct = Math.min(100, Math.max(20, (progress.xp / 10) * 1.5));
  const pronunciationPct = Math.min(100, Math.max(25, completedCount * 14));
  const practicalPct = Math.min(100, Math.max(10, completedCount * 15));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Learner Analytics &amp; Mastery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Aapki Pragati (Progress Dashboard)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Consistency se hi Germany mein B1/B2 clear hota hai. Daily streak aur XP track karein:
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* XP */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-1 sm:mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total XP</span>
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {progress.xp} <span className="text-xs font-bold text-indigo-500">Pts</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">Lessons &amp; practice earned</p>
        </div>

        {/* Streak */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-1 sm:mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {progress.streakDays} <span className="text-xs font-bold text-orange-500">Days</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">Keep the fire burning!</p>
        </div>

        {/* Daily Goal */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-1 sm:mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Daily Target</span>
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {practicedMinutes}/{goalMinutes} <span className="text-xs font-bold text-rose-500">Mins</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
            <div className="h-full bg-rose-500 transition-all" style={{ width: `${goalPct}%` }} />
          </div>
        </div>

        {/* Units Completed */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-1 sm:mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Units Done</span>
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {completedCount}/{totalUnits}
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1">{completionPct}% curriculum complete</p>
        </div>
      </div>

      {/* Skills Radar / Breakdown */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
            CEFR German Competency Breakdown
          </h3>
          <span className="text-xs text-neutral-400">Live Skill Tracker</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Grammar &amp; V2 Sentence Order</span>
              <span className="text-rose-600 dark:text-rose-400">{Math.round(grammarPct)}% Mastery</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `${grammarPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Noun Genders (Der, Die, Das)</span>
              <span className="text-blue-600 dark:text-blue-400">{Math.round(genderPct)}% (Swiper Practice)</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${genderPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Pronunciation &amp; Umlauts (ä, ö, ü)</span>
              <span className="text-purple-600 dark:text-purple-400">{Math.round(pronunciationPct)}% (Speaking Lab)</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${pronunciationPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Real Germany Situations (Anmeldung, DB Bahn)</span>
              <span className="text-amber-600 dark:text-amber-400">{Math.round(practicalPct)}% Confident</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${practicalPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/deutschready/learn"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-900 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-white"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-rose-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Go to Curriculum</span>
          </div>
          <span className="text-xs text-neutral-400 font-bold">➔</span>
        </Link>
        <Link
          href="/deutschready/practice"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-900 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-white"
        >
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Practice Arena</span>
          </div>
          <span className="text-xs text-neutral-400 font-bold">➔</span>
        </Link>
        <Link
          href="/deutschready/germany-life"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-900 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-white"
        >
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Germany Simulator</span>
          </div>
          <span className="text-xs text-neutral-400 font-bold">➔</span>
        </Link>
      </div>
    </div>
  );
}

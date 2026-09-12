'use client';

import { Sparkles, Flame, Clock, Award, CheckCircle2, BookmarkCheck, TrendingUp, Target } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { CURRICULUM_DATA } from '@/data/curriculum';

export default function ProgressPage() {
  const { progress } = useUserProgress();

  const completionPct = Math.round(
    (progress.completedLessons.length / CURRICULUM_DATA.length) * 100
  );

  const goalMinutes = progress.dailyGoalMinutes || 20;
  const practicedMinutes = progress.todayMinutesPracticed || 8;
  const goalPct = Math.min(100, Math.round((practicedMinutes / goalMinutes) * 100));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Learner Analytics &amp; Mastery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Aapki Pragati (Progress Dashboard)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Consistency se hi Germany mein B1 clear hota hai. Yahan apna daily track dekhein:
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            {progress.xp} <span className="text-xs font-bold text-indigo-500">Points</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Earned via lessons &amp; workouts</p>
        </div>

        {/* Streak */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Streak</span>
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            {progress.streakDays} <span className="text-xs font-bold text-orange-500">Days</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Keep the momentum going!</p>
        </div>

        {/* Daily Goal */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Target</span>
            <Target className="h-5 w-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            {practicedMinutes}/{goalMinutes} <span className="text-xs font-bold text-rose-500">Mins</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
            <div className="h-full bg-rose-500" style={{ width: `${goalPct}%` }} />
          </div>
        </div>

        {/* Units Completed */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Units</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            {progress.completedLessons.length}/{CURRICULUM_DATA.length}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">{completionPct}% of curriculum done</p>
        </div>
      </div>

      {/* Skills Radar / Breakdown */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          CEFR German Competency Breakdown
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Grammar &amp; V2 Sentence Structure</span>
              <span className="text-rose-600">80% Mastery</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Noun Genders (Der, Die, Das)</span>
              <span className="text-blue-600">65% (Practicing with Swiper)</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Pronunciation &amp; Umlauts (ä, ö, ü)</span>
              <span className="text-purple-600">75% (Speaking Lab Active)</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Real Germany Bureaucracy (Anmeldung, DB Bahn)</span>
              <span className="text-amber-600">85% Confident</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

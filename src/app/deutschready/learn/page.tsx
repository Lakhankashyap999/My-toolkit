'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { CURRICULUM_DATA } from '@/data/curriculum';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import { CefrLevel } from '@/types';

export default function LearnPage() {
  const { progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const levels = ['all', 'A0', 'A1', 'A2', 'B1', 'B2'];

  const filteredUnits = selectedLevel === 'all'
    ? CURRICULUM_DATA
    : CURRICULUM_DATA.filter((u) => u.level === selectedLevel);

  const completionPct = CURRICULUM_DATA.length > 0
    ? Math.round((progress.completedLessons.length / CURRICULUM_DATA.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-rose-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="h-4 w-4" />
          <span>CEFR Structured {t.curriculum} (A0 → B2)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          {t.curriculum} — German Learning Roadmap
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
          {progress.uiLanguage === 'german'
            ? 'Schritt für Schritt meistern. Jede Einheit enthält Audio-Aussprache, Grammatik und KI-Zweifel-Löser.'
            : progress.uiLanguage === 'english'
            ? 'Step by step mastery. Each unit has audio pronunciation, grammar connection, and 10-level AI Doubt Solver.'
            : 'Step-by-step master karein. Har unit mein audio pronunciation, Hindi grammar connection, aur 10-level AI Doubt Solver maujood hai!'}
        </p>

        {/* Progress Pill */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="h-2.5 w-full sm:w-64 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-neutral-300">
            {progress.completedLessons.length} of {CURRICULUM_DATA.length} units completed ({completionPct}%)
          </span>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Level:
        </span>
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 min-h-[40px] ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              {lvl === 'all' ? 'All Units' : `Level ${lvl}`}
            </button>
          );
        })}
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {filteredUnits.map((unit) => {
          const isCompleted = progress.completedLessons.includes(unit.id);

          return (
            <div
              key={unit.id}
              className={`rounded-3xl border transition-all p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-sm hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              {/* Unit Info */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {unit.level} • Unit {unit.unitNumber}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{unit.estimatedMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>+{unit.xpReward} XP</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                  {unit.titleHindi}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {unit.title}
                </p>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {unit.descriptionHindi}
                </p>

                {/* Topics Tag List */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {unit.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button & Status */}
              <div className="flex items-center md:flex-col justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Mastered!</span>
                  </div>
                ) : null}

                <Link
                  href={`/deutschready/lesson/${unit.id}`}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 min-h-[44px] ${
                    isCompleted
                      ? 'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900'
                  }`}
                >
                  <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

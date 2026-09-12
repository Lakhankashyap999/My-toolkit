'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { CURRICULUM_DATA } from '@/data/curriculum';
import { useUserProgress } from '@/lib/progressStore';

export default function LearnPage() {
  const { progress } = useUserProgress();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-rose-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="h-4 w-4" />
          <span>CEFR Structured Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          A0 → A1 German Learning Roadmap
        </h1>
        <p className="mt-2 text-sm text-neutral-300 max-w-2xl leading-relaxed">
          Step-by-step master karein. Har unit ke andar audio pronunciation, Hindi grammar connection (Karak/कारक), 
          aur har concept ke sath <span className="text-rose-400 font-bold">10-level AI Doubt Solver (&ldquo;❓ Samajh nahi aaya&rdquo;)</span> maujood hai!
        </p>

        {/* Progress Pill */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 w-48 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all"
              style={{
                width: `${Math.round((progress.completedLessons.length / CURRICULUM_DATA.length) * 100)}%`
              }}
            />
          </div>
          <span className="text-xs font-bold text-neutral-400">
            {progress.completedLessons.length} of {CURRICULUM_DATA.length} units completed
          </span>
        </div>
      </div>

      {/* Units Grid */}
      <div className="space-y-4">
        {CURRICULUM_DATA.map((unit) => {
          const isCompleted = progress.completedLessons.includes(unit.id);

          return (
            <div
              key={unit.id}
              className={`rounded-3xl border transition-all p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-sm hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              {/* Unit Info */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
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
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {unit.title}
                </p>

                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  {unit.descriptionHindi}
                </p>

                {/* Topics Tag List */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {unit.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button & Status */}
              <div className="flex items-center md:flex-col justify-end gap-3 shrink-0">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Mastered!</span>
                  </div>
                ) : null}

                <Link
                  href={`/deutschready/lesson/${unit.id}`}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-sm transition-all active:scale-95 ${
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

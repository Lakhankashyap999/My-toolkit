'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Zap, Layers } from 'lucide-react';
import { VOCABULARY_DATA } from '@/data/vocabulary';
import DerDieDasTrainer from '@/components/DerDieDasTrainer';
import SentenceBuilder from '@/components/SentenceBuilder';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<'gender' | 'sentence'>('gender');
  const { recordActivity, progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  useEffect(() => {
    recordActivity({
      type: 'practice',
      id: `practice-${activeTab}`,
      title: activeTab === 'gender' ? 'Der/Die/Das Swiper Trainer' : 'V2 Sentence Word Order Builder',
      detail: activeTab === 'gender' ? 'Article memorization workout' : 'Syntax & word order drill',
      path: '/deutschready/practice',
    });
  }, [activeTab, recordActivity]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          <Dumbbell className="h-3.5 w-3.5" />
          <span>{t.practice}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          {progress.uiLanguage === 'german'
            ? 'Aktives Sprach-Muskelgedächtnis'
            : progress.uiLanguage === 'english'
            ? 'Active Muscle Memory Workstation'
            : 'Active Muscle Memory Workstation'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {progress.uiLanguage === 'german'
            ? 'Nur Grammatik lesen reicht nicht. Täglich 5–10 Minuten mit diesen interaktiven Tools trainieren!'
            : progress.uiLanguage === 'english'
            ? 'Reading rules alone is not enough. Spend 5–10 minutes daily with interactive workouts!'
            : 'Sirf theory padhne se bhasha nahi aati. Daily 5–10 minute in interactive tools par workout karein!'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center">
        <div className="flex rounded-2xl bg-neutral-200/80 p-1 dark:bg-neutral-800">
          <button
            onClick={() => setActiveTab('gender')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'gender'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4 text-blue-500" />
            <span>Der / Die / Das Swiper</span>
          </button>

          <button
            onClick={() => setActiveTab('sentence')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'sentence'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Zap className="h-4 w-4 text-emerald-500" />
            <span>V2 Sentence Builder</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'gender' ? (
          <DerDieDasTrainer vocabulary={VOCABULARY_DATA} />
        ) : (
          <SentenceBuilder />
        )}
      </div>
    </div>
  );
}

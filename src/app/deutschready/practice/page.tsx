'use client';

import { useState } from 'react';
import { Dumbbell, Zap, Layers, Sparkles } from 'lucide-react';
import { VOCABULARY_DATA } from '@/data/vocabulary';
import DerDieDasTrainer from '@/components/DerDieDasTrainer';
import SentenceBuilder from '@/components/SentenceBuilder';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<'gender' | 'sentence'>('gender');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          <Dumbbell className="h-3.5 w-3.5" />
          <span>Daily Active Practice Arena</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Active Muscle Memory Workstation
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Sirf theory padhne se bhasha nahi aati. Daily 5–10 minute in interactive tools par workout karein!
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
            <Zap className="h-4 w-4 text-rose-500" />
            <span>German V2 Sentence Builder</span>
          </button>
        </div>
      </div>

      {/* Active Arena */}
      <div className="mt-6">
        {activeTab === 'gender' ? (
          <DerDieDasTrainer vocabulary={VOCABULARY_DATA} />
        ) : (
          <SentenceBuilder />
        )}
      </div>
    </div>
  );
}

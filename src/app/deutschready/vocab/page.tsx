'use client';

import { useState } from 'react';
import { BookmarkCheck, AlertCircle, Sparkles, Filter, CheckCircle2, RotateCw } from 'lucide-react';
import { VOCABULARY_DATA } from '@/data/vocabulary';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from '@/components/AudioPlayerButton';

export default function VocabPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'difficult'>('difficult');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const { progress, removeDifficultWord } = useUserProgress();

  const difficultList = VOCABULARY_DATA.filter((v) =>
    progress.difficultWords.includes(v.id)
  );

  const displayList = selectedTab === 'difficult' ? difficultList : VOCABULARY_DATA;

  const filteredList = displayList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <BookmarkCheck className="h-3.5 w-3.5" />
          <span>Spaced Repetition &amp; Memory Bank</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Wortschatz &amp; Memory Retention
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Ebbinghaus Forgetting Curve ke aadhar par banaya gaya active recall system.
        </p>
      </div>

      {/* Main Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div className="flex rounded-2xl bg-neutral-200/80 p-1 dark:bg-neutral-800">
          <button
            onClick={() => setSelectedTab('difficult')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === 'difficult'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
            <span>Mera Kamzor Vocab ({difficultList.length})</span>
          </button>

          <button
            onClick={() => setSelectedTab('all')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedTab === 'all'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <span>All Vocabulary ({VOCABULARY_DATA.length})</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {['all', 'nouns', 'verbs', 'bureaucracy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Flashcards Grid */}
      {filteredList.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Koi Kamzor Word Nahi Mila!
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Aapne sabhi words ko acche se yaad kar liya hai, ya practice arena mein quiz solve karein.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const isFlipped = flippedCards[item.id];
            const isDifficult = progress.difficultWords.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleFlip(item.id)}
                className="group relative cursor-pointer rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between min-h-[210px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <AudioPlayerButton text={`${item.article || ''} ${item.german}`} size="sm" />
                      {isDifficult && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDifficultWord(item.id);
                          }}
                          title="Mark Mastered (Remove from Difficult)"
                          className="rounded-full p-1 text-neutral-400 hover:text-emerald-600"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isFlipped ? (
                    <div>
                      <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
                        {item.article && (
                          <span
                            className={
                              item.article === 'der'
                                ? 'text-blue-600 dark:text-blue-400'
                                : item.article === 'die'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }
                          >
                            {item.article}{' '}
                          </span>
                        )}
                        {item.german}
                      </h3>
                      {item.plural && (
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Plural: {item.plural}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-neutral-400 italic">
                        Tap card to flip for Hindi meaning &amp; memory trick...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-neutral-900 dark:text-white">
                        {item.hindi} <span className="text-xs text-neutral-400 font-normal">({item.english})</span>
                      </div>
                      {item.memoryHook && (
                        <div className="rounded-xl bg-amber-50 p-2.5 text-[11px] font-medium text-amber-900 border border-amber-200/80 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
                          💡 <strong>Trick:</strong> {item.memoryHook}
                        </div>
                      )}
                      <p className="text-[11px] text-neutral-500 italic">
                        &ldquo;{item.exampleGerman}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 pt-2 dark:border-neutral-800">
                  <span>Level: {item.level}</span>
                  <span className="flex items-center gap-1 font-semibold text-neutral-500">
                    <RotateCw className="h-3 w-3" /> Flip
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

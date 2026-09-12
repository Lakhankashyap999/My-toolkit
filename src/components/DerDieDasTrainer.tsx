'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, ArrowRight, RotateCcw, AlertCircle, ShieldAlert } from 'lucide-react';
import { VocabItem, Gender } from '@/types';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from './AudioPlayerButton';

interface DerDieDasTrainerProps {
  vocabulary: VocabItem[];
}

export default function DerDieDasTrainer({ vocabulary }: DerDieDasTrainerProps) {
  const nounList = vocabulary.filter((v) => v.article);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong';
    selected: Gender;
    correct: Gender;
    memoryHook?: string;
  } | null>(null);

  const { addXp, addDifficultWord } = useUserProgress();
  const currentWord = nounList[currentIndex % nounList.length];

  const handleGuess = (guess: Gender) => {
    if (!currentWord || !currentWord.article || feedback !== null) return;

    const isCorrect = guess === currentWord.article;

    if (isCorrect) {
      setStreak((s) => s + 1);
      addXp(10);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // confetti fallback
      }
      setFeedback({
        status: 'correct',
        selected: guess,
        correct: currentWord.article,
        memoryHook: currentWord.memoryHook
      });
    } else {
      setStreak(0);
      setErrorCount((c) => {
        const next = c + 1;
        if (next >= 3) {
          setShowRescueModal(true);
        }
        return next;
      });
      addDifficultWord(currentWord.id);
      setFeedback({
        status: 'wrong',
        selected: guess,
        correct: currentWord.article,
        memoryHook: currentWord.memoryHook
      });
    }
  };

  const handleNextWord = () => {
    setFeedback(null);
    setCurrentIndex((i) => (i + 1) % nounList.length);
  };

  if (!currentWord) {
    return <div className="p-8 text-center text-neutral-500">No noun cards found.</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Top Streak & Counter Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
          <span>Card {currentIndex + 1} of {nounList.length}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Combo: {streak} 🔥</span>
        </div>
      </div>

      {/* Main Flashcard Arena */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="absolute top-4 right-4">
          <AudioPlayerButton text={`${currentWord.article || ''} ${currentWord.german}`} size="sm" />
        </div>

        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
          Noun Gender Trainer
        </div>

        {/* Big Word Display */}
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white my-3">
          {feedback ? (
            <span
              className={
                currentWord.article === 'der'
                  ? 'text-blue-600 dark:text-blue-400'
                  : currentWord.article === 'die'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            >
              {currentWord.article}{' '}
            </span>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-600">??? </span>
          )}
          {currentWord.german}
        </h2>

        <p className="text-lg font-medium text-neutral-600 dark:text-neutral-300">
          {currentWord.hindi} <span className="text-xs text-neutral-400 font-normal">({currentWord.english})</span>
        </p>

        {currentWord.plural && (
          <p className="mt-1 text-xs text-neutral-400">
            Plural: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{currentWord.plural}</span>
          </p>
        )}

        {/* Feedback / Memory Hook Reveal */}
        {feedback && (
          <div
            className={`mt-6 rounded-2xl p-4 text-xs font-medium border transition-all ${
              feedback.status === 'correct'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            <div className="font-bold text-sm mb-1 flex items-center justify-center gap-1.5">
              {feedback.status === 'correct' ? '🎉 Sehr Gut!' : '❌ Ops! Sahi Article: ' + feedback.correct.toUpperCase()}
            </div>
            {feedback.memoryHook && (
              <p className="mt-1">
                💡 <strong>Memory Hook:</strong> {feedback.memoryHook}
              </p>
            )}
          </div>
        )}

        {/* Gender Action Buttons */}
        {!feedback ? (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {/* DER - Blue */}
            <button
              onClick={() => handleGuess('der')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-50/50 py-4 text-blue-700 font-extrabold shadow-sm transition-all hover:bg-blue-500 hover:text-white active:scale-95 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <span className="text-xl">DER</span>
              <span className="text-[10px] font-medium opacity-80">Masculine (🔵)</span>
            </button>

            {/* DIE - Red */}
            <button
              onClick={() => handleGuess('die')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-rose-500 bg-rose-50/50 py-4 text-rose-700 font-extrabold shadow-sm transition-all hover:bg-rose-500 hover:text-white active:scale-95 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
            >
              <span className="text-xl">DIE</span>
              <span className="text-[10px] font-medium opacity-80">Feminine (🔴)</span>
            </button>

            {/* DAS - Green */}
            <button
              onClick={() => handleGuess('das')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 py-4 text-emerald-700 font-extrabold shadow-sm transition-all hover:bg-emerald-500 hover:text-white active:scale-95 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <span className="text-xl">DAS</span>
              <span className="text-[10px] font-medium opacity-80">Neuter (🟢)</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleNextWord}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 font-bold text-white shadow-md hover:bg-neutral-800 active:scale-98 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <span>Next Word (Nächster Begriff)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ARTICLE RESCUE MODAL (Auto-triggers on 3 consecutive mistakes) */}
      {showRescueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-amber-300 bg-amber-50 p-6 shadow-2xl dark:border-amber-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-sm uppercase tracking-wider mb-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Article Rescue (5-Min Emergency Guide)</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Gender yaad karne mein dikkat ho rahi hai?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
              Don&apos;t worry! 3 baar galat hua hai, iska matlab aapko ye 3 golden suffixes yaad karne ki zaroorat hai:
            </p>
            <div className="space-y-2 text-xs font-semibold">
              <div className="rounded-xl bg-white p-2.5 border border-rose-200 text-rose-800 dark:bg-neutral-800 dark:border-rose-900/60 dark:text-rose-200">
                🔴 <strong>-ung, -keit, -schaft, -tät</strong> = 100% DIE (Feminine)
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-emerald-200 text-emerald-800 dark:bg-neutral-800 dark:border-emerald-900/60 dark:text-emerald-200">
                🟢 <strong>-chen, -ment, -um</strong> = 100% DAS (Neuter)
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-blue-200 text-blue-800 dark:bg-neutral-800 dark:border-blue-900/60 dark:text-blue-200">
                🔵 <strong>Days, Months, Seasons</strong> = 100% DER (Masculine)
              </div>
            </div>
            <button
              onClick={() => {
                setShowRescueModal(false);
                setErrorCount(0);
              }}
              className="mt-5 w-full rounded-xl bg-amber-600 py-3 text-xs font-bold text-white hover:bg-amber-700 shadow-md"
            >
              Samajh Gaya! Wapas Khelte Hain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

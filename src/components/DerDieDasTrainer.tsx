'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
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
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakesForRescue, setMistakesForRescue] = useState(0);
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
    if (!currentWord?.article || feedback !== null) return;

    const isCorrect = guess === currentWord.article;
    setTotalAnswered((t) => t + 1);

    if (isCorrect) {
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
      setMistakesForRescue(0);
      addXp(10);
      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 }, zIndex: 999 });
      } catch {}
    } else {
      setStreak(0);
      const next = mistakesForRescue + 1;
      setMistakesForRescue(next);
      if (next >= 3) setShowRescueModal(true);
      addDifficultWord(currentWord.id);
    }

    setFeedback({
      status: isCorrect ? 'correct' : 'wrong',
      selected: guess,
      correct: currentWord.article,
      memoryHook: currentWord.memoryHook,
    });
  };

  const handleNext = () => {
    setFeedback(null);
    setCurrentIndex((i) => (i + 1) % nounList.length);
  };

  if (!currentWord) {
    return (
      <div className="py-12 text-center text-neutral-500">
        Vocabulary cards load nahi ho sake. Please refresh karein.
      </div>
    );
  }

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="relative mx-auto w-full max-w-lg px-2 sm:px-0">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-neutral-500">
          Card {currentIndex + 1}/{nounList.length}
          {totalAnswered > 0 && (
            <span className="ml-2 text-emerald-600 font-bold">{accuracy}% Accuracy</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Combo: {streak} 🔥
        </div>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 text-center shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="absolute top-4 right-4">
          <AudioPlayerButton text={`${currentWord.article || ''} ${currentWord.german}`} size="sm" />
        </div>

        <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Kaun sa Article hai?
        </div>

        {/* Word Display */}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white my-3 break-words">
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
            <span className="text-neutral-300 dark:text-neutral-700">___ </span>
          )}
          {currentWord.german}
        </h2>

        <p className="text-base sm:text-lg font-semibold text-neutral-600 dark:text-neutral-300">
          {currentWord.hindi}{' '}
          <span className="text-xs text-neutral-400 font-normal">({currentWord.english})</span>
        </p>

        {currentWord.plural && (
          <p className="mt-1 text-xs text-neutral-400">
            Plural: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{currentWord.plural}</span>
          </p>
        )}

        {/* Feedback reveal */}
        {feedback && (
          <div
            className={`mt-4 rounded-2xl p-4 text-xs font-medium border ${
              feedback.status === 'correct'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            <div className="font-bold text-sm mb-1">
              {feedback.status === 'correct'
                ? '🎉 Bilkul Sahi!'
                : `❌ Galat! Sahi article: ${feedback.correct.toUpperCase()}`}
            </div>
            {feedback.memoryHook && (
              <p>💡 <strong>Yaad rakhein:</strong> {feedback.memoryHook}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        {!feedback ? (
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            {/* DER */}
            <button
              onClick={() => handleGuess('der')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-50/50 py-4 sm:py-5 text-blue-700 font-extrabold transition-all hover:bg-blue-500 hover:text-white active:scale-95 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white min-h-[72px]"
            >
              <span className="text-xl sm:text-2xl">DER</span>
              <span className="text-[10px] font-medium opacity-80 hidden sm:block">Masculine 🔵</span>
            </button>
            {/* DIE */}
            <button
              onClick={() => handleGuess('die')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-rose-500 bg-rose-50/50 py-4 sm:py-5 text-rose-700 font-extrabold transition-all hover:bg-rose-500 hover:text-white active:scale-95 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white min-h-[72px]"
            >
              <span className="text-xl sm:text-2xl">DIE</span>
              <span className="text-[10px] font-medium opacity-80 hidden sm:block">Feminine 🔴</span>
            </button>
            {/* DAS */}
            <button
              onClick={() => handleGuess('das')}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 py-4 sm:py-5 text-emerald-700 font-extrabold transition-all hover:bg-emerald-500 hover:text-white active:scale-95 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white min-h-[72px]"
            >
              <span className="text-xl sm:text-2xl">DAS</span>
              <span className="text-[10px] font-medium opacity-80 hidden sm:block">Neuter 🟢</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 font-bold text-white hover:bg-neutral-800 active:scale-98 min-h-[56px] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            Agla Word (Nächster Begriff)
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Article Rescue Modal */}
      {showRescueModal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-amber-300 bg-amber-50 p-6 shadow-2xl dark:border-amber-800 dark:bg-neutral-900">
            {/* Drag handle for mobile */}
            <div className="w-10 h-1 rounded-full bg-amber-300 dark:bg-amber-700 mx-auto mb-4 sm:hidden" />
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-wider mb-2">
              <ShieldAlert className="h-5 w-5" />
              Article Rescue — 5 Min Emergency Guide
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              3 Baar Galti? Koi baat nahi!
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
              In 3 Golden Rules se 60% German articles bina soche pata chal jayenge:
            </p>
            <div className="space-y-2 text-xs font-semibold">
              <div className="rounded-xl bg-white p-3 border border-rose-200 dark:bg-neutral-800 dark:border-rose-900/60">
                🔴 <strong>-ung, -keit, -schaft, -tät, -tion, -heit</strong> = 100% DIE
                <p className="font-normal text-neutral-500 mt-0.5">Wohnung, Möglichkeit, Zeitung, Universität</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 dark:bg-neutral-800 dark:border-emerald-900/60">
                🟢 <strong>-chen, -ment, -um, -lein</strong> = 100% DAS
                <p className="font-normal text-neutral-500 mt-0.5">Mädchen, Dokument, Zentrum, Fräulein</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-blue-200 dark:bg-neutral-800 dark:border-blue-900/60">
                🔵 <strong>Days, Months, Seasons, -er (jobs)</strong> = 100% DER
                <p className="font-normal text-neutral-500 mt-0.5">Montag, Januar, Sommer, Lehrer, Arzt</p>
              </div>
            </div>
            <button
              onClick={() => { setShowRescueModal(false); setMistakesForRescue(0); }}
              className="mt-5 w-full rounded-xl bg-amber-600 py-3.5 text-xs font-bold text-white hover:bg-amber-700 shadow-md min-h-[52px]"
            >
              Samajh Gaya! Wapas Practice Karte Hain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

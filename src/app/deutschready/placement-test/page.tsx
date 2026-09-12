'use client';

import { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { PLACEMENT_QUESTIONS } from '@/data/placementQuestions';
import { useUserProgress } from '@/lib/progressStore';

export default function PlacementTestPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { addXp } = useUserProgress();

  const q = PLACEMENT_QUESTIONS[currentIdx];

  const handleSelect = (option: string) => {
    setUserAnswers((prev) => ({ ...prev, [q.id]: option }));

    if (currentIdx + 1 < PLACEMENT_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setIsCompleted(true);
      addXp(50);
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const calculateScore = () => {
    let correct = 0;
    PLACEMENT_QUESTIONS.forEach((quest) => {
      if (userAnswers[quest.id] === quest.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / PLACEMENT_QUESTIONS.length) * 100);

  let recommendation = {
    level: 'A0 (Absolute Beginner)',
    text: 'Aapko German ke Basic Sounds, Umlauts (ä, ö, ü) aur First Greetings se shuru karna chahiye.',
    targetUnitId: 'a0-u1'
  };

  if (percentage >= 80) {
    recommendation = {
      level: 'Strong A1 Foundation',
      text: 'Aapka grammar aur basic vocabulary bahut accha hai! Aap seedha V2 Rule aur Akkusativ Cases par focus karein.',
      targetUnitId: 'a1-u4'
    };
  } else if (percentage >= 50) {
    recommendation = {
      level: 'A1 Beginner',
      text: 'Aapko basic shabdon ka idea hai. Der/Die/Das rules aur basic sentences se shuru karein.',
      targetUnitId: 'a1-u3'
    };
  }

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          <Award className="h-3.5 w-3.5" />
          <span>Diagnostic Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Apna German Level Pehchaniye
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          6 quick questions solve karke jaaniye ki aapko kahan se padhai shuru karni chahiye.
        </p>
      </div>

      {!isCompleted ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold">Question {currentIdx + 1} of {PLACEMENT_QUESTIONS.length}</span>
            <span>{Math.round(((currentIdx + 1) / PLACEMENT_QUESTIONS.length) * 100)}% Complete</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
            <div
              className="h-full bg-rose-500 transition-all"
              style={{ width: `${((currentIdx + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="py-4">
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              {q.question}
            </h3>
            {q.questionHindi && (
              <p className="text-sm font-medium text-neutral-500 mt-1">
                {q.questionHindi}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="w-full text-left rounded-2xl border border-neutral-200 p-4 font-bold text-sm text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition-all active:scale-98 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-white"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Evaluation Screen */
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 text-center shadow-xl dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              Aapka Estimated Level: <span className="text-rose-600">{recommendation.level}</span>
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto">
              Score: <strong>{score} / {PLACEMENT_QUESTIONS.length}</strong> ({percentage}%)
            </p>
            <p className="mt-3 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 max-w-lg mx-auto dark:bg-neutral-800 dark:border-neutral-700">
              💡 {recommendation.text}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/deutschready/lesson/${recommendation.targetUnitId}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
            >
              <span>Recommended Lesson Shuru Karein</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={handleRetake}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 px-5 py-3.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Test</span>
            </button>
          </div>

          {/* Honest Disclaimer */}
          <div className="border-t border-neutral-100 pt-6 text-[11px] text-neutral-400 flex items-center justify-center gap-2 dark:border-neutral-800">
            <ShieldCheck className="h-4 w-4 text-neutral-500" />
            <span>Yeh test keval aapki padhai ka starting point batane ke liye hai. Yeh koi official certificate nahi hai.</span>
          </div>
        </div>
      )}
    </div>
  );
}

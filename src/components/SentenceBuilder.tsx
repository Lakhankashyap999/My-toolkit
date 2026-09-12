'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from './AudioPlayerButton';

interface SentenceExercise {
  id: string;
  hindiPrompt: string;
  englishPrompt: string;
  tokens: string[];
  verbToken: string;
  correctOrder: string[];
  explanation: string;
}

const SAMPLE_SENTENCES: SentenceExercise[] = [
  {
    id: 's-1',
    hindiPrompt: 'आज मैं जर्मन सीख रहा हूँ। (आज = Heute)',
    englishPrompt: 'Today I am learning German.',
    tokens: ['Heute', 'lerne', 'ich', 'Deutsch.'],
    verbToken: 'lerne',
    correctOrder: ['Heute', 'lerne', 'ich', 'Deutsch.'],
    explanation: 'V2 Rule: "Heute" position 1 par hai, isliye verb "lerne" ko position 2 par aana padega. "ich" position 3 par chala gaya!'
  },
  {
    id: 's-2',
    hindiPrompt: 'सोमवार को हम बर्लिन जा रहे हैं।',
    englishPrompt: 'On Monday we are traveling to Berlin.',
    tokens: ['Am Montag', 'fahren', 'wir', 'nach Berlin.'],
    verbToken: 'fahren',
    correctOrder: ['Am Montag', 'fahren', 'wir', 'nach Berlin.'],
    explanation: 'Time element "Am Montag" position 1 hai. Verb "fahren" position 2 par baitha hai.'
  },
  {
    id: 's-3',
    hindiPrompt: 'सुबह वह कॉफ़ी पीता है।',
    englishPrompt: 'In the morning he drinks coffee.',
    tokens: ['Morgens', 'trinkt', 'er', 'Kaffee.'],
    verbToken: 'trinkt',
    correctOrder: ['Morgens', 'trinkt', 'er', 'Kaffee.'],
    explanation: '"Morgens" = Pos 1, "trinkt" = Pos 2 (Verb), "er" = Pos 3.'
  },
  {
    id: 's-4',
    hindiPrompt: 'बर्लिन में मैं रहता हूँ।',
    englishPrompt: 'In Berlin I live.',
    tokens: ['In Berlin', 'wohne', 'ich.'],
    verbToken: 'wohne',
    correctOrder: ['In Berlin', 'wohne', 'ich.'],
    explanation: 'Location "In Berlin" = Pos 1. Verb "wohne" = Pos 2. Subject "ich" = Pos 3.'
  },
  {
    id: 's-5',
    hindiPrompt: 'कल वह काम करेगा।',
    englishPrompt: 'Tomorrow he will work.',
    tokens: ['Morgen', 'arbeitet', 'er.'],
    verbToken: 'arbeitet',
    correctOrder: ['Morgen', 'arbeitet', 'er.'],
    explanation: 'Time word "Morgen" = Pos 1. Verb "arbeitet" = Pos 2.'
  }
];

export default function SentenceBuilder() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong_v2' | 'wrong'>('idle');
  const { addXp } = useUserProgress();

  const current = SAMPLE_SENTENCES[exerciseIndex % SAMPLE_SENTENCES.length];
  const availableTokens = current.tokens.filter(
    (token) => !selectedTokens.includes(token)
  );

  const handleSelectToken = (token: string) => {
    if (status === 'correct') return;
    const newSelection = [...selectedTokens, token];
    setSelectedTokens(newSelection);
    setStatus('idle');
  };

  const handleRemoveToken = (token: string) => {
    if (status === 'correct') return;
    setSelectedTokens(selectedTokens.filter((t) => t !== token));
    setStatus('idle');
  };

  const handleReset = () => {
    setSelectedTokens([]);
    setStatus('idle');
  };

  const handleCheck = () => {
    if (selectedTokens.length !== current.tokens.length) return;

    // Check V2 Rule Violation specifically
    const verbPosition = selectedTokens.indexOf(current.verbToken);
    if (verbPosition !== 1) {
      setStatus('wrong_v2');
      return;
    }

    const isCorrect = selectedTokens.every((token, idx) => token === current.correctOrder[idx]);
    if (isCorrect) {
      setStatus('correct');
      addXp(20);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
    } else {
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    setSelectedTokens([]);
    setStatus('idle');
    setExerciseIndex((i) => (i + 1) % SAMPLE_SENTENCES.length);
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            German V2 Sentence Builder
          </span>
          <span className="text-xs text-neutral-400 font-medium">
            {exerciseIndex + 1}/{SAMPLE_SENTENCES.length}
          </span>
        </div>
        <button
          onClick={handleReset}
          title="Reset"
          aria-label="Reset tokens"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Target Prompt */}
      <div className="mb-6 rounded-2xl bg-neutral-50 p-4 border border-neutral-100 dark:bg-neutral-800/40 dark:border-neutral-800">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
          Translate this sentence to German:
        </p>
        <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
          {current.hindiPrompt}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          ({current.englishPrompt})
        </p>
      </div>

      {/* Slots / Drop Zone */}
      <div className="min-h-[80px] rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-3 flex flex-wrap items-center gap-2 mb-6 dark:border-neutral-700 dark:bg-neutral-950/40">
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-neutral-400 font-medium italic mx-auto text-center px-2">
            Niche diye shabdon par tap karke sahi kram mein sajaiye...
          </span>
        ) : (
          selectedTokens.map((token, index) => {
            const isVerb = token === current.verbToken;
            return (
              <button
                key={index}
                onClick={() => handleRemoveToken(token)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all min-h-[44px] active:scale-95 ${
                  isVerb
                    ? 'border-2 border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                    : 'border border-neutral-300 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
                }`}
              >
                <span className="text-[10px] text-neutral-400 font-mono">[{index + 1}]</span>
                <span>{token}</span>
                {isVerb && (
                  <span className="rounded-full bg-rose-200 px-1.5 py-0.5 text-[9px] font-black text-rose-800 dark:bg-rose-900">
                    VERB
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Available Token Pool */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-neutral-400 mb-2">Available Word Chips (Tap to place):</p>
        <div className="flex flex-wrap gap-2">
          {availableTokens.map((token) => {
            const isVerb = token === current.verbToken;
            return (
              <button
                key={token}
                onClick={() => handleSelectToken(token)}
                className={`rounded-xl px-4 py-3 text-xs sm:text-sm font-bold shadow-sm border transition-all active:scale-95 min-h-[44px] ${
                  isVerb
                    ? 'border-rose-300 bg-rose-50/60 text-rose-900 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Alerts */}
      {status === 'wrong_v2' && (
        <div className="mb-4 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-semibold text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-sm">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Achtung! German Police V2 Rule Violation!</span>
          </div>
          Verb &ldquo;{current.verbToken}&rdquo; ko hamesha <strong>Position 2</strong> par aana chahiye! Position 1 par jo marzi aaye, Verb apni seat number 2 nahi chhodega.
        </div>
      )}

      {status === 'correct' && (
        <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Ausgezeichnet! +20 XP</span>
            </span>
            <AudioPlayerButton text={current.correctOrder.join(' ')} size="sm" />
          </div>
          <p className="mt-1 leading-relaxed">{current.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      {status !== 'correct' ? (
        <button
          onClick={handleCheck}
          disabled={selectedTokens.length !== current.tokens.length}
          className="w-full rounded-2xl bg-neutral-900 py-4 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-neutral-800 active:scale-98 disabled:opacity-40 min-h-[52px] dark:bg-white dark:text-neutral-900"
        >
          Check Sentence Order
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98 min-h-[52px]"
        >
          Next Sentence ➔
        </button>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Lightbulb, ShieldCheck } from 'lucide-react';
import { DoubtResponse, UiLanguage } from '@/types';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from './AudioPlayerButton';

interface AiDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  contextGerman?: string;
  userAnswer?: string;
  correctAnswer?: string;
}

export default function AiDoubtModal({
  isOpen,
  onClose,
  topic,
  contextGerman,
  userAnswer,
  correctAnswer
}: AiDoubtModalProps) {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState<DoubtResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const { progress } = useUserProgress();

  const fetchExplanation = async (lvl: number) => {
    setLoading(true);
    setQuizSelected(null);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contextGerman,
          userAnswer,
          correctAnswer,
          currentLevel: lvl,
          language: progress.uiLanguage
        })
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLevel(1);
      fetchExplanation(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, topic]);

  const handleNextLevel = () => {
    const nextLvl = Math.min(10, level + 1);
    setLevel(nextLvl);
    fetchExplanation(nextLvl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm shadow-rose-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>AI Doubt Solver</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  Level {level} of 10
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Topic: <strong className="text-neutral-700 dark:text-neutral-300">{topic}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Level Progress Indicator */}
        <div className="flex w-full items-center gap-1 bg-neutral-100 px-6 py-2 dark:bg-neutral-950">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx + 1 <= level
                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                  : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-rose-500 border-t-transparent" />
              <p className="text-sm font-medium text-neutral-500">
                AI Simplification Engine is crafting Level {level} explanation...
              </p>
            </div>
          ) : data ? (
            <>
              {/* Main Explanation */}
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100 dark:bg-neutral-800/50 dark:border-neutral-800">
                <h4 className="font-semibold text-neutral-900 text-sm mb-1.5 flex items-center gap-2 dark:text-neutral-100">
                  <BookOpen className="h-4 w-4 text-rose-500" />
                  <span>{data.title}</span>
                </h4>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {data.explanation}
                </p>
              </div>

              {/* Hindi Analogy Bridge */}
              {data.hindiAnalogy && (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 dark:text-amber-300">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    <span>🇮🇳 Desi Mental Bridge (हिंदी से समझें)</span>
                  </h4>
                  <p className="text-sm font-medium text-amber-950 dark:text-amber-200">
                    {data.hindiAnalogy}
                  </p>
                </div>
              )}

              {/* Indian Learner Trap Identification */}
              {data.whyIndiansMakeThisMistake && (
                <div className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-950/60 dark:bg-rose-950/30">
                  <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Indian Learners Yahan Galti Kyu Karte Hain?</span>
                  </h4>
                  <p className="text-xs text-rose-950 dark:text-rose-200">
                    {data.whyIndiansMakeThisMistake}
                  </p>
                </div>
              )}

              {/* Visual Comparison Card */}
              {data.visualComparison && (
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                    Side-by-Side Comparison
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-rose-50/80 p-3 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50">
                      <div className="font-bold text-rose-700 dark:text-rose-300 mb-1">❌ Common Mistake</div>
                      <code className="text-rose-900 dark:text-rose-200">{data.visualComparison.wrongExample}</code>
                    </div>
                    <div className="rounded-lg bg-emerald-50/80 p-3 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">✅ German Correct Rule</div>
                      <code className="text-emerald-900 dark:text-emerald-200 font-semibold">{data.visualComparison.correctExample}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* Micro Quick Practice Question */}
              {data.quickPracticeQuestion && (
                <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>1-Step Mastery Check: Ab Try Karo!</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    {data.quickPracticeQuestion.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {data.quickPracticeQuestion.options.map((opt, idx) => {
                      const isCorrect = idx === data.quickPracticeQuestion?.correctIndex;
                      const isSelected = quizSelected === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuizSelected(idx)}
                          className={`rounded-lg py-2 px-3 text-xs font-bold border transition-all ${
                            quizSelected === null
                              ? 'border-neutral-200 bg-white text-neutral-800 hover:border-indigo-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                              : isSelected
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-rose-500 bg-rose-500 text-white'
                              : isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-neutral-200 opacity-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizSelected !== null && (
                    <p className="mt-3 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {quizSelected === data.quickPracticeQuestion.correctIndex ? '🎉 Bilkul Sahi! ' : '💡 Yaad rakhein: '}
                      {data.quickPracticeQuestion.explanation}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer (Ladder Escalation) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            {level < 10
              ? 'Abhi bhi confuse ho? AI isko aur aasan bhasha mein samjhayega.'
              : 'Aap Level 10 tak pohoch gaye hain! Keep practicing.'}
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {level < 10 && (
              <button
                onClick={handleNextLevel}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <span>Aur Aasan Bhasha Mein Samjhao (Level {level + 1})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Theek Hai, Samajh Gaya!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

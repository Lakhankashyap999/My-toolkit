'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Lightbulb, ShieldCheck, ChevronUp } from 'lucide-react';
import { DoubtResponse } from '@/types';
import { useUserProgress } from '@/lib/progressStore';

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
  correctAnswer,
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
          language: progress.uiLanguage,
        }),
      });
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
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

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleNextLevel = () => {
    const next = Math.min(10, level + 1);
    setLevel(next);
    fetchExplanation(next);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet on mobile, modal on desktop */}
      <div className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-4 sm:px-6 py-3 sm:py-4 dark:border-neutral-800 dark:bg-neutral-950/50 shrink-0">
          {/* Mobile drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:hidden" />

          <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                AI Doubt Solver
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  Level {level}/10
                </span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-sm">
                {topic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Level Progress */}
        <div className="flex items-center gap-1 bg-neutral-100 px-4 sm:px-6 py-2 dark:bg-neutral-950 shrink-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i + 1 <= level ? 'bg-rose-500' : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
              <p className="text-sm font-medium text-neutral-500">Level {level} explanation loading...</p>
            </div>
          ) : data ? (
            <>
              {/* Main Explanation */}
              <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 dark:bg-neutral-800/50 dark:border-neutral-800">
                <h4 className="font-bold text-neutral-900 text-sm mb-2 flex items-center gap-2 dark:text-white">
                  <BookOpen className="h-4 w-4 text-rose-500 shrink-0" />
                  {data.title}
                </h4>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {data.explanation}
                </p>
              </div>

              {/* Hindi Bridge */}
              {data.hindiAnalogy && (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5 dark:text-amber-300">
                    <Lightbulb className="h-4 w-4 text-amber-600 shrink-0" />
                    🇮🇳 Desi Mental Bridge
                  </h4>
                  <p className="text-sm font-medium text-amber-950 dark:text-amber-200">{data.hindiAnalogy}</p>
                </div>
              )}

              {/* Indian Mistake */}
              {data.whyIndiansMakeThisMistake && (
                <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-950/60 dark:bg-rose-950/30">
                  <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    Indian Learners ki Common Galti
                  </h4>
                  <p className="text-xs text-rose-950 dark:text-rose-200">{data.whyIndiansMakeThisMistake}</p>
                </div>
              )}

              {/* Visual Comparison */}
              {data.visualComparison && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Side-by-Side Comparison</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-rose-50 p-3 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50">
                      <div className="font-bold text-rose-700 mb-1 dark:text-rose-300">❌ Galat</div>
                      <code className="text-rose-900 dark:text-rose-200 break-all">{data.visualComparison.wrongExample}</code>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50">
                      <div className="font-bold text-emerald-700 mb-1 dark:text-emerald-300">✅ Sahi German</div>
                      <code className="text-emerald-900 dark:text-emerald-200 font-bold break-all">{data.visualComparison.correctExample}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Practice */}
              {data.quickPracticeQuestion && (
                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Quick Mastery Check
                  </div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
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
                          className={`rounded-xl py-3 px-3 text-xs font-bold border transition-all min-h-[48px] ${
                            quizSelected === null
                              ? 'border-neutral-200 bg-white hover:border-indigo-400 dark:border-neutral-700 dark:bg-neutral-800'
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
                      {quizSelected === data.quickPracticeQuestion.correctIndex
                        ? '🎉 Bilkul Sahi! '
                        : '💡 Yaad rakhein: '}
                      {data.quickPracticeQuestion.explanation}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50 px-4 sm:px-6 py-3 sm:py-4 dark:border-neutral-800 dark:bg-neutral-950 shrink-0">
          <p className="text-xs text-neutral-500 text-center sm:text-left dark:text-neutral-400">
            {level < 10 ? 'Abhi bhi confuse? AI aur aasan karega!' : '🎓 Aapne Level 10 complete kiya!'}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {level < 10 && (
              <button
                onClick={handleNextLevel}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-3 text-xs font-bold text-white hover:bg-neutral-800 active:scale-95 disabled:opacity-50 min-h-[44px] dark:bg-white dark:text-neutral-900"
              >
                Aur Aasan Bhasha (Level {level + 1})
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-4 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-100 min-h-[44px] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Theek Hai ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

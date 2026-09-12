'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { MapPin, User, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Lightbulb } from 'lucide-react';
import { GermanyScenario } from '@/types';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from './AudioPlayerButton';

interface GermanyScenarioCardProps {
  scenario: GermanyScenario;
  onComplete?: () => void;
}

export default function GermanyScenarioCard({ scenario, onComplete }: GermanyScenarioCardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const { addXp } = useUserProgress();

  const step = scenario.steps[currentStepIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const chosen = step.options[index];

    if (chosen.isCorrect) {
      addXp(30);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  const handleNextStep = () => {
    setSelectedOption(null);
    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      setIsDone(true);
      if (onComplete) onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setIsDone(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
      {/* Location & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>{scenario.locationName}</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white mt-0.5">
            {scenario.titleHindi}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {scenario.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {scenario.level} Practical
          </span>
          <button
            onClick={handleRestart}
            title="Restart Scenario"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cultural Etiquette Tips Bar */}
      {scenario.culturalTips.length > 0 && (
        <div className="my-4 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/80 text-xs text-amber-950 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Germany Etiquette & Survival Tips</span>
          </div>
          <ul className="list-disc pl-4 space-y-0.5 font-medium">
            {scenario.culturalTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {!isDone && step ? (
        <div className="mt-4 space-y-5">
          {/* Speaker Speech Bubble */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {step.speaker}
                  </span>
                  <span className="ml-1 text-[10px] text-neutral-400">({step.role})</span>
                </div>
              </div>
              <AudioPlayerButton text={step.germanText} size="sm" />
            </div>

            <p className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
              &ldquo;{step.germanText}&rdquo;
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {step.hindiTranslation}
            </p>
            <p className="text-xs text-neutral-400 italic mt-0.5">
              ({step.englishTranslation})
            </p>

            {step.culturalNote && (
              <div className="mt-3 text-[11px] font-semibold text-rose-700 bg-rose-50/60 px-2.5 py-1 rounded-lg dark:bg-rose-950/40 dark:text-rose-300 inline-block">
                ⚡ {step.culturalNote}
              </div>
            )}
          </div>

          {/* User Prompt */}
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              👉 {step.userPromptHindi}
            </p>
            <div className="space-y-2.5">
              {step.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left rounded-2xl p-4 border transition-all ${
                      selectedOption === null
                        ? 'border-neutral-200 bg-white hover:border-rose-300 hover:bg-rose-50/20 dark:border-neutral-800 dark:bg-neutral-900'
                        : isSelected
                        ? opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 ring-2 ring-rose-500/20'
                        : opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-50/50 opacity-90'
                        : 'border-neutral-200 opacity-40 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm text-neutral-900 dark:text-white">
                          {opt.german}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                          {opt.hindi}
                        </p>
                      </div>
                      {selectedOption !== null && (
                        <div>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : isSelected ? (
                            <AlertCircle className="h-5 w-5 text-rose-600" />
                          ) : null}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-xs font-medium border-t border-neutral-200/60 pt-2 dark:border-neutral-700/60">
                        {opt.feedback}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          {selectedOption !== null && (
            <button
              onClick={handleNextStep}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-neutral-800 active:scale-98 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <span>Continue (Weiter)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* Scenario Completed Celebration */
        <div className="py-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Award className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
            Scenario Successfully Mastered!
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
            Aapne is German situation ko successfully handle kiya hai. Aapka confidence ab real Germany life ke liye 1 step aage badh chuka hai!
          </p>
          <button
            onClick={handleRestart}
            className="rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-700 active:scale-95"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}

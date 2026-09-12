'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM_DATA } from '@/data/curriculum';
import { useUserProgress } from '@/lib/progressStore';
import AudioPlayerButton from '@/components/AudioPlayerButton';
import AiDoubtModal from '@/components/AiDoubtModal';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;
  const unit = CURRICULUM_DATA.find((u) => u.id === lessonId);

  const { markLessonComplete } = useUserProgress();

  // Active Doubt Modal State
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [doubtTopic, setDoubtTopic] = useState('');
  const [doubtContext, setDoubtContext] = useState('');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!unit) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Lesson not found</h2>
        <Link href="/deutschready/learn" className="mt-4 inline-block text-sm text-rose-600 font-bold hover:underline">
          Return to Curriculum ➔
        </Link>
      </div>
    );
  }

  const openDoubt = (topic: string, context?: string) => {
    setDoubtTopic(topic);
    setDoubtContext(context || '');
    setDoubtOpen(true);
  };

  const handleSelectQuiz = (qId: string, option: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    markLessonComplete(unit.id, unit.xpReward);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <Link
          href="/deutschready/learn"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Curriculum Par Wapas Jayein</span>
        </Link>

        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          {unit.level} • Unit {unit.unitNumber}
        </span>
      </div>

      {/* Lesson Banner */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          {unit.titleHindi}
        </h1>
        <p className="mt-1 text-base font-semibold text-neutral-500 dark:text-neutral-400">
          {unit.title}
        </p>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {unit.descriptionHindi}
        </p>
      </div>

      {/* Theory & Grammar Sections */}
      <div className="space-y-8">
        {unit.sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-6"
          >
            {/* Section Header with "Samajh nahi aaya" Quick Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Part {sIdx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                  {section.titleHindi}
                </h2>
                <p className="text-xs text-neutral-400 font-medium">{section.title}</p>
              </div>

              {/* THE GAME-CHANGING AI DOUBT SOLVER BUTTON */}
              <button
                onClick={() => openDoubt(section.title, section.explanationHindi)}
                className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-95 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
              >
                <HelpCircle className="h-4 w-4" />
                <span>❓ Samajh nahi aaya</span>
              </button>
            </div>

            {/* Explanation Content */}
            <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-800 leading-relaxed whitespace-pre-line border border-neutral-100 dark:bg-neutral-950/50 dark:border-neutral-800 dark:text-neutral-200">
              {section.explanationHindi}
            </div>

            {/* German Examples with Audio Playback */}
            {section.germanExamples.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Examples (Hören &amp; Sprechen):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.germanExamples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div>
                        <div className="font-bold text-neutral-900 text-sm dark:text-white">
                          {ex.german}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-300">
                          {ex.hindi}
                        </div>
                        {ex.breakdown && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            {ex.breakdown}
                          </div>
                        )}
                      </div>
                      <AudioPlayerButton text={ex.german} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tip Card */}
            {section.proTip && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
                  <Lightbulb className="h-4 w-4" />
                  <span>Guru Mantra / Pro-Tip</span>
                </div>
                <p className="font-medium leading-relaxed">{section.proTip}</p>
              </div>
            )}

            {/* Common Mistake for Indian Learners */}
            {section.commonMistakeForIndians && (
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 text-xs text-rose-950 dark:border-rose-950/60 dark:bg-rose-950/30 dark:text-rose-200">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Indian Students Yahan Sabse Zyada Galti Karte Hain</span>
                </div>
                <p className="font-medium leading-relaxed">{section.commonMistakeForIndians}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Unit Quiz */}
      {unit.quiz.length > 0 && (
        <div className="rounded-3xl border-2 border-neutral-900/10 bg-white p-6 sm:p-10 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Award className="h-4 w-4" />
              <span>Unit Knowledge Check</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              Unit Mastery Quiz (अंतिम जाँच)
            </h2>
            <p className="text-xs text-neutral-500">
              Sahi uttar chuniye aur concepts ko pakka karein. Har galat sawal par AI Doubt Solver help karega!
            </p>
          </div>

          <div className="space-y-6">
            {unit.quiz.map((q, qIdx) => {
              const selected = quizAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-950/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-neutral-400">Question {qIdx + 1}</span>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                        {q.question}
                      </h4>
                      {q.questionHindi && (
                        <p className="text-xs text-neutral-500">{q.questionHindi}</p>
                      )}
                    </div>

                    <button
                      onClick={() => openDoubt(q.grammarTopic, q.question)}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Doubt?</span>
                    </button>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options?.map((opt) => {
                      const isChosen = selected === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectQuiz(q.id, opt)}
                          disabled={quizSubmitted}
                          className={`rounded-xl p-3 text-left text-xs font-bold border transition-all ${
                            !quizSubmitted
                              ? isChosen
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                              : isChosen
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                                : 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                              : opt === q.correctAnswer
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold'
                              : 'border-neutral-200 opacity-40'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submit */}
                  {quizSubmitted && (
                    <div
                      className={`mt-2 rounded-xl p-3 text-xs font-medium border ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : 'border-rose-200 bg-rose-50/60 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 mb-0.5">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Bilkul Sahi!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-rose-600" />
                            <span>Galti: Sahi uttar &ldquo;{q.correctAnswer}&rdquo; hai.</span>
                          </>
                        )}
                      </div>
                      <p>{q.explanationHindi}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleFinishQuiz}
              disabled={Object.keys(quizAnswers).length !== unit.quiz.length}
              className="w-full rounded-2xl bg-neutral-900 py-4 text-sm font-bold text-white shadow-md hover:bg-neutral-800 active:scale-98 disabled:opacity-40 dark:bg-white dark:text-neutral-900"
            >
              Submit Quiz &amp; Claim +{unit.xpReward} XP
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-6 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Unit Mastered &amp; Recorded to Your Profile!</span>
              </div>
              <Link
                href="/deutschready/learn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
              >
                <span>Continue to Next Lesson</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Global AI Doubt Solver Drawer */}
      <AiDoubtModal
        isOpen={doubtOpen}
        onClose={() => setDoubtOpen(false)}
        topic={doubtTopic}
        contextGerman={doubtContext}
      />
    </div>
  );
}

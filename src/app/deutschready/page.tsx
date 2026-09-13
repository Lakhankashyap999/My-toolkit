'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Dumbbell,
  Mic,
  Compass,
  BookmarkCheck,
  ShieldCheck,
  HelpCircle,
  Zap,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';
import MissionSnapModal from '@/components/MissionSnapModal';

export default function HomePage() {
  const router = useRouter();
  const { progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('/deutschready/learn');

  // When user clicks any tool or "Start Learning", show Mission note if not seen
  const handleToolClick = (e: React.MouseEvent, url: string) => {
    try {
      const seen = localStorage.getItem('deutschready_mission_seen');
      if (!seen) {
        e.preventDefault();
        setTargetUrl(url);
        setMissionModalOpen(true);
        return;
      }
    } catch {}
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[550px] rounded-full bg-gradient-to-tr from-rose-500/15 via-amber-500/15 to-indigo-500/15 blur-3xl" />

        <div className="mx-auto max-w-4xl">
          {/* Heartfelt Mission Badge Trigger */}
          <button
            onClick={() => {
              setTargetUrl('/deutschready/learn');
              setMissionModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/90 px-4 py-1.5 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 mb-6 cursor-pointer transition-all active:scale-95"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>{t.heroBadge} • 🤝 Our Mission</span>
          </button>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
            {t.tagline}{' '}
            <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
              {t.taglineSpan}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {t.subtagline}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/deutschready/learn"
              onClick={(e) => handleToolClick(e, '/deutschready/learn')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-neutral-800 active:scale-98 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all cursor-pointer"
            >
              <span>{t.startLearning}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/deutschready/placement-test"
              onClick={(e) => handleToolClick(e, '/deutschready/placement-test')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-base font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 active:scale-98 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <span>{t.placementTest}</span>
            </Link>
          </div>

          {/* Micro Trust Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left border-t border-neutral-200/80 pt-6 dark:border-neutral-800">
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{t.stat1}</div>
              <div className="text-xs text-neutral-500 font-medium">{t.stat1sub}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{t.stat2}</div>
              <div className="text-xs text-neutral-500 font-medium">{t.stat2sub}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{t.stat3}</div>
              <div className="text-xs text-neutral-500 font-medium">{t.stat3sub}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{t.stat4}</div>
              <div className="text-xs text-neutral-500 font-medium">{t.stat4sub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHATGPT & COACHING INSTITUTES FAIL VS DEUTSCHREADY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white">
            {t.whyTitle}{' '}
            <span className="text-rose-600">{t.whyTitleSpan}</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {t.whySubtitle}
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-950/60 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <th className="p-4 sm:p-5">{t.tableFeature}</th>
                <th className="p-4 sm:p-5 text-neutral-400">{t.colCoaching}</th>
                <th className="p-4 sm:p-5 text-neutral-400">{t.colChatgpt}</th>
                <th className="p-4 sm:p-5 bg-rose-50/50 text-rose-700 font-black dark:bg-rose-950/40 dark:text-rose-300">
                  {t.colUs}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs sm:text-sm font-medium">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">{t.tableFees}</td>
                <td className="p-4 sm:p-5 text-rose-600 font-semibold">₹60,000 - ₹1,20,000+</td>
                <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">$20/month</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-emerald-600 dark:bg-rose-950/20">
                  100% Free Core Access
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">{t.tableDoubt}</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">
                  {progress.uiLanguage === 'german' ? 'Lehrer wird ungeduldig' : progress.uiLanguage === 'english' ? 'Teacher gets impatient' : 'Teacher gets impatient'}
                </td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">
                  {progress.uiLanguage === 'german' ? 'Langweiliger 500-Wort-Aufsatz' : progress.uiLanguage === 'english' ? 'Boring 500-word essay' : 'Boring 500-word essay'}
                </td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  10-Level Progressive Doubt Ladder (Hinglish Analogy)
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">{t.tablePractice}</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">
                  {progress.uiLanguage === 'german' ? 'Papierhausaufgaben' : 'Paper homework'}
                </td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    {progress.uiLanguage === 'german' ? 'Nur passiver Text' : progress.uiLanguage === 'english' ? 'Only passive text reading' : 'Only passive text reading'}
                  </span>
                </td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  Der/Die/Das Swiper &amp; V2 Word Order Arranger
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">{t.tableAudio}</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">1 hour group class</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">Fast robotic voice</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  0.75x Slow Turtle Audio + Mic Syllable Feedback
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">{t.tableGermany}</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">Textbook only</td>
                <td className="p-4 sm:p-5 text-neutral-500 dark:text-neutral-400">Prompt engineering required</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  Interactive RPG: Anmeldung, Bahn, Arzt, Supermarkt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. CORE WORKSTATIONS SHOWCASE */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {t.featuresTitle}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">{t.featuresSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 10-Level Doubt Ladder */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              10-Level Progressive Doubt Ladder
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Immer wenn Sie verwirrt sind, klicken Sie auf "❓ Noch Fragen?". Die KI erklärt Schritt für Schritt auf Einfachem.'
                : progress.uiLanguage === 'english'
                ? 'Whenever confused, click "❓ Still confused?". AI explains step-by-step in simple language with Hindi analogies.'
                : 'Jab bhi samajh na aaye, "❓ Samajh nahi aaya" click karo. AI level-by-level aasan bhasha, Hindi analogy aur mini-quizzes ke zariye doubt clear karega.'}
            </p>
            <Link
              href="/deutschready/learn"
              onClick={(e) => handleToolClick(e, '/deutschready/learn')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
            >
              {t.startLearning} ➔
            </Link>
          </div>

          {/* Card 2: Der / Die / Das Swiper */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Der/Die/Das Arena &amp; Article Rescue
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Swipe-Spiel zum Artikel-Lernen. Bei 3 Fehlern zeigt "Artikel-Rettung" sofortige Suffixregeln.'
                : progress.uiLanguage === 'english'
                ? 'Tinder-style swipe game to memorise articles. After 3 mistakes, "Article Rescue" shows instant suffix shortcuts (-ung = DIE).'
                : 'Tinder-style swipe karke articles yaad karo. Agar 3 baar galti hui, to "Article Rescue" instant shortcut endings batayega.'}
            </p>
            <Link
              href="/deutschready/practice"
              onClick={(e) => handleToolClick(e, '/deutschready/practice')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            >
              {progress.uiLanguage === 'german' ? 'Üben ➔' : 'Start Swiping ➔'}
            </Link>
          </div>

          {/* Card 3: German V2 Police Engine */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              German V2 Sentence Builder
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Goldene Regel: Das Verb steht immer an 2. Position! Interaktive Wort-Chips anordnen und Fehler korrigieren.'
                : progress.uiLanguage === 'english'
                ? 'Golden rule: Verb always at position 2! Arrange interactive word chips and get corrected by the V2 police alert.'
                : 'German grammar ka golden rule: Verb hamesha Position 2 par aayega! Interactive chips arrange karein aur syntax police ke alert se galti sudharein.'}
            </p>
            <Link
              href="/deutschready/practice"
              onClick={(e) => handleToolClick(e, '/deutschready/practice')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
            >
              {progress.uiLanguage === 'german' ? 'Sätze üben ➔' : 'Build Sentences ➔'}
            </Link>
          </div>

          {/* Card 4: Speaking Lab */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-4">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {t.speakingLab} &amp; 0.75x Slow Audio
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Umlauts (ä, ö, ü) und CH/SCH Sounds üben. Langsames Audio hören und mit dem Mikrofon wiederholen.'
                : progress.uiLanguage === 'english'
                ? 'Clear umlauts (ä, ö, ü) and CH/SCH sounds. Hear turtle audio and record yourself — no judgement.'
                : 'Umlauts (ä, ö, ü) aur CH/SCH ke sounds clear karein. Turtle audio suno aur mic mein bol kar pronunciation check karo bina kisi dar ke.'}
            </p>
            <Link
              href="/deutschready/speak"
              onClick={(e) => handleToolClick(e, '/deutschready/speak')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
            >
              {progress.uiLanguage === 'german' ? 'Sprechen ➔' : 'Test Voice ➔'}
            </Link>
          </div>

          {/* Card 5: Germany Life Simulator */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {progress.uiLanguage === 'german' ? 'Deutschland-Leben Simulator' : progress.uiLanguage === 'english' ? 'Real Germany Life Simulator' : 'Real Germany Life Simulator'}
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Bürgeramt, Deutsche Bahn, Supermarkt und Arzt — interactive Dialoge vorab meistern.'
                : progress.uiLanguage === 'english'
                ? 'Master Bürgeramt, Deutsche Bahn delays, Supermarket checkout, and Doctor clinic before you arrive.'
                : 'Bürgeramt Anmeldung, Deutsche Bahn train delay, Supermarket checkout, aur Doctor clinic ke interactive dialogues pehle hi master karo.'}
            </p>
            <Link
              href="/deutschready/germany-life"
              onClick={(e) => handleToolClick(e, '/deutschready/germany-life')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
            >
              {progress.uiLanguage === 'german' ? 'Simulator öffnen ➔' : 'Enter Simulator ➔'}
            </Link>
          </div>

          {/* Card 6: Spaced Repetition Flashcards */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
              <BookmarkCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {t.wordsIForget}
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {progress.uiLanguage === 'german'
                ? 'Wörter, die Sie vergessen, wandern automatisch in die "Schwierige Wörter"-Liste für tägliche 5-Minuten-Wiederholung.'
                : progress.uiLanguage === 'english'
                ? 'Words you forget automatically move to the "Words I Keep Forgetting" bucket for daily 5-minute spaced repetition.'
                : 'Jo words aap bhoolte hain, wo automatically "Words I Keep Forgetting" bucket mein chale jate hain taaki daily 5-minute revision ho sake.'}
            </p>
            <Link
              href="/deutschready/vocab"
              onClick={(e) => handleToolClick(e, '/deutschready/vocab')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              {progress.uiLanguage === 'german' ? 'Wortschatz ➔' : 'Review Words ➔'}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ETHICAL TRANSPARENCY & LEGAL DISCLAIMER */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            {t.disclaimerTitle}
          </h4>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t.disclaimerText}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-neutral-500">
            <Link href="/deutschready/disclaimer" className="hover:text-rose-600">Disclaimer</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-rose-600">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-rose-600">Terms of Service</Link>
          </div>
        </div>
      </section>

      {/* Mission Snap Modal with Thanos Particle Disintegration */}
      <MissionSnapModal
        isOpen={missionModalOpen}
        onClose={() => setMissionModalOpen(false)}
        onProceed={() => router.push(targetUrl)}
      />
    </div>
  );
}

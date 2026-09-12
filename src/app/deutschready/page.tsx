'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Dumbbell, 
  Mic, 
  Compass, 
  BookmarkCheck, 
  ShieldCheck, 
  HelpCircle, 
  Zap,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';
import { TRANSLATIONS } from '@/lib/i18n';

export default function HomePage() {
  const { progress } = useUserProgress();
  const t = TRANSLATIONS[progress.uiLanguage] || TRANSLATIONS.hinglish;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[550px] rounded-full bg-gradient-to-tr from-rose-500/15 via-amber-500/15 to-indigo-500/15 blur-3xl" />

        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-xs font-bold text-rose-700 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>Bharat ke Students aur Professionals ke liye</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            German Seekho Apni Bhasha Mein.{' '}
            <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
              Zero Se B2 Tak.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Coaching fees ke <strong>₹60,000–₹1,20,000 bachao</strong>. 
            AI Doubt Solver (<code className="text-xs bg-neutral-200 px-1.5 py-0.5 rounded dark:bg-neutral-800">❓ Samajh nahi aaya</code>), 
            0.75x Slow Speaking Lab, aur Real Germany Life Simulators ke saath <strong>100% confidence paao</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/deutschready/learn"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-neutral-800 active:scale-98 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <span>{t.startLearning}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/deutschready/placement-test"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-base font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 active:scale-98 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span>{t.placementTest}</span>
            </Link>
          </div>

          {/* Micro Trust Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left border-t border-neutral-200/80 pt-6 dark:border-neutral-800">
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">A0 → B2</div>
              <div className="text-xs text-neutral-500 font-medium">CEFR Structured Path</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">10 Levels</div>
              <div className="text-xs text-neutral-500 font-medium">Progressive Doubt Ladder</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">0.75x Slow</div>
              <div className="text-xs text-neutral-500 font-medium">Native Audio Training</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">₹0 Fees</div>
              <div className="text-xs text-neutral-500 font-medium">Accessible to Everyone</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHATGPT & COACHING INSTITUTES FAIL VS DEUTSCHREADY */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white">
            ChatGPT ya Traditional Coaching se <span className="text-rose-600">Behtar Kyun Hai?</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Kyun generic AI aur mehenge institutes Indian learners ko dimaagi roop se confuse kar dete hain:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-950/60 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <th className="p-4 sm:p-5">Feature / Problem</th>
                <th className="p-4 sm:p-5 text-neutral-400">Traditional Coaching</th>
                <th className="p-4 sm:p-5 text-neutral-400">ChatGPT / Generic AI</th>
                <th className="p-4 sm:p-5 bg-rose-50/50 text-rose-700 font-black dark:bg-rose-950/40 dark:text-rose-300">
                  DeutschReady Platform
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs sm:text-sm font-medium">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">Fees / Cost</td>
                <td className="p-4 sm:p-5 text-rose-600 font-semibold">₹60,000 - ₹1,20,000+</td>
                <td className="p-4 sm:p-5 text-neutral-600">$20/month</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-emerald-600 dark:bg-rose-950/20">
                  100% Free Core Access
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">Doubt Explanation</td>
                <td className="p-4 sm:p-5 text-neutral-500">Teacher gets impatient</td>
                <td className="p-4 sm:p-5 text-neutral-500">Boring 500-word essay</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  10-Level Progressive Doubt Ladder (Hinglish Analogy)
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">Active Muscle Memory</td>
                <td className="p-4 sm:p-5 text-neutral-500">Paper homework</td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Only passive text reading</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  Der/Die/Das Swiper &amp; V2 Word Order Arranger
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">Pronunciation &amp; Audio</td>
                <td className="p-4 sm:p-5 text-neutral-500">1 hour group class</td>
                <td className="p-4 sm:p-5 text-neutral-500">Fast robotic robot voice</td>
                <td className="p-4 sm:p-5 bg-rose-50/30 font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                  0.75x Slow Turtle Audio + Mic Syllable Feedback
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white">Real Germany Survival</td>
                <td className="p-4 sm:p-5 text-neutral-500">Textbook only</td>
                <td className="p-4 sm:p-5 text-neutral-500">Prompt engineering required</td>
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
            6 Powerful Workstations Built for Rapid Fluency
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Har ek feature real-life confidence build karne ke liye design kiya gaya hai.</p>
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
              Jab bhi samajh na aaye, &ldquo;❓ Samajh nahi aaya&rdquo; click karo. AI level-by-level aasan bhasha, Hindi analogy (कारक bridge) aur mini-quizzes ke zariye doubt clear karega.
            </p>
            <Link href="/deutschready/learn" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline">
              Try a Lesson ➔
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
              Tinder-style swipe karke articles yaad karo. Agar 3 baar galti hui, to &ldquo;Article Rescue&rdquo; instant shortcut endings batayega (-ung, -heit = 100% DIE).
            </p>
            <Link href="/deutschready/practice" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
              Start Swiping ➔
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
              German grammar ka golden rule: Verb hamesha Position 2 par aayega! Interactive chips arrange karein aur syntax police ke alert se galti sudharein.
            </p>
            <Link href="/deutschready/practice" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
              Build Sentences ➔
            </Link>
          </div>

          {/* Card 4: Speaking Lab */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-4">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Speaking Lab &amp; 0.75x Slow Audio
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Umlauts (ä, ö, ü) aur CH/SCH ke sounds clear karein. Turtle audio suno aur mic mein bol kar pronunciation check karo bina kisi dar ke.
            </p>
            <Link href="/deutschready/speak" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline">
              Test Voice ➔
            </Link>
          </div>

          {/* Card 5: Germany Life Simulator */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Real Germany Life Simulator
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Bürgeramt Anmeldung, Deutsche Bahn train delay, Supermarket checkout, aur Doctor clinic ke interactive dialogues pehle hi master karo.
            </p>
            <Link href="/deutschready/germany-life" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
              Enter Simulator ➔
            </Link>
          </div>

          {/* Card 6: Spaced Repetition Flashcards */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
              <BookmarkCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Mera Kamzor Vocab (SRS Engine)
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Jo words aap bhoolte hain, wo automatically &ldquo;Words I Keep Forgetting&rdquo; bucket mein chale jate hain taaki daily 5-minute revision ho sake.
            </p>
            <Link href="/deutschready/vocab" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
              Review Words ➔
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
            Ethical Education &amp; Legal Disclaimers
          </h4>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            DeutschReady ek independent German learning platform hai. Hum kisi bhi official examination body 
            (Goethe-Institut, Telc, ÖSD) se affiliated nahi hain. Hum 100% original educational curriculum provide karte hain. 
            Koi bhi fake visa, job, ya exam pass guarantee nahi di jati — aapki mehnat aur hamare tools se aapka result banega.
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
    </div>
  );
}

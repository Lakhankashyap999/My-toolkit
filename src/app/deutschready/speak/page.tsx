'use client';

import { useState } from 'react';
import { Mic, Volume2, Snail, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import AudioPlayerButton from '@/components/AudioPlayerButton';
import VoiceRecorder from '@/components/VoiceRecorder';

interface SpeakingCard {
  id: string;
  phrase: string;
  hindi: string;
  phoneticTip: string;
  focusSound: string;
}

const PHONETIC_DRILLS: SpeakingCard[] = [
  {
    id: 'p-1',
    phrase: 'Entschuldigung',
    hindi: 'माफ़ कीजिये (Excuse me / Sorry)',
    phoneticTip: 'Ent-shul-di-gung (SCH ko shh bolo, ch nahi)',
    focusSound: 'SCH sound'
  },
  {
    id: 'p-2',
    phrase: 'Das Brötchen',
    hindi: 'ब्रेड रोल (Bread roll)',
    phoneticTip: 'Ö sound: Lips ko O banao, awaz E nikalo! (-chen = k-hen)',
    focusSound: 'Ö Umlaut + CH'
  },
  {
    id: 'p-3',
    phrase: 'Ich möchte einen Termin',
    hindi: 'मुझे एक अपॉइंटमेंट चाहिए',
    phoneticTip: 'möch-te (m-ö-khte) + Ter-min (stress on min)',
    focusSound: 'CH & Ö'
  },
  {
    id: 'p-4',
    phrase: 'Auf Wiedersehen',
    hindi: 'फिर मिलेंगे (Formal Goodbye)',
    phoneticTip: 'W sounds like V (व). ie = ee. Auf Vee-der-zee-hen.',
    focusSound: 'W as V & IE as EE'
  },
  {
    id: 'p-5',
    phrase: 'Fünfunddreißig',
    hindi: 'पैंतीस (35)',
    phoneticTip: 'Ü sound: Whistle lips shape. ß = sharp S (dry-sig).',
    focusSound: 'Ü Umlaut & Eszett ß'
  }
];

export default function SpeakPage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const card = PHONETIC_DRILLS[activeCardIndex];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          <Mic className="h-3.5 w-3.5" />
          <span>Speech &amp; Pronunciation Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Bolo Bina Kisi Sharm Ke!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Yahan koi aapko judge nahi karega. Turtle mode (0.75x) se slow audio sunein aur mic par repeat karein.
        </p>
      </div>

      {/* Main Practice Console */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 text-center shadow-xl dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-bold">Sound Drill {activeCardIndex + 1} of {PHONETIC_DRILLS.length}</span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {card.focusSound}
          </span>
        </div>

        {/* Big German Word */}
        <div className="space-y-2 py-4">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
            {card.phrase}
          </h2>
          <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">
            {card.hindi}
          </p>
          <div className="inline-block rounded-xl bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900 border border-amber-200/80 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
            💡 <strong>Desi Sound Hack:</strong> {card.phoneticTip}
          </div>
        </div>

        {/* Audio Playback Controls */}
        <div className="flex items-center justify-center gap-3">
          <AudioPlayerButton text={card.phrase} size="lg" showText />
        </div>

        {/* Microphone Recording Component */}
        <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <VoiceRecorder targetPhrase={card.phrase} />
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {PHONETIC_DRILLS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === activeCardIndex
                  ? 'w-8 bg-rose-500'
                  : 'w-2.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Psychological Comfort Card */}
      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-neutral-900 dark:text-white mb-1">
            Indian Accent German mein 100% Acceptable Hai!
          </h4>
          <p className="leading-relaxed">
            Germany ke offices, hospitals aur universities mein hazaron Indians kaam kar rahe hain. 
            Aapko native German jaise bolne ki zaroorat nahi hai — sirf aapka message clear aur grammatical v2 structure sahi hona chahiye. 
            Confidence rakhein!
          </p>
        </div>
      </div>
    </div>
  );
}

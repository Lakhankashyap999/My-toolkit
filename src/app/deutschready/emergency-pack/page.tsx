'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Bookmark, 
  Printer, 
  FileText,
  Volume2
} from 'lucide-react';
import AudioPlayerButton from '@/components/AudioPlayerButton';

export default function EmergencyPackPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/deutschready"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>DeutschReady Home</span>
        </Link>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-600" />
          <span>Exam &amp; Interview Cheat Sheet</span>
        </span>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 p-6 sm:p-10 text-white shadow-xl space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          ⚡ German Emergency Survival Pack
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
          Exam se 1 ghante pehle ya job interview ke baahar baithe hue is page ko revise karein. 
          Ismein German grammar ke <strong>Top 5 Golden Rules</strong>, <strong>Irregular Verb cheat codes</strong>, 
          aur <strong>Germany life ke critical terms</strong> ek jagah hain!
        </p>
      </div>

      {/* 1. Article Golden Rules */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black text-xs">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
              Der, Die, Das Suffix Cheat Codes
            </h2>
          </div>
          <button
            onClick={() => handleCopy('-ung, -heit, -keit, -schaft, -tion, -tät = DIE\n-chen, -lein, -ment, -um = DAS\nDays, Months, Seasons, -er professions = DER', 'rule1')}
            className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {copiedSection === 'rule1' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copiedSection === 'rule1' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-2">
              🔴 100% DIE (Feminine)
            </div>
            <ul className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 space-y-1">
              <li>• <strong>-ung</strong> (die Wohnung, die Zeitung)</li>
              <li>• <strong>-heit / -keit</strong> (die Freiheit, Möglichkeit)</li>
              <li>• <strong>-schaft</strong> (die Botschaft, Freundschaft)</li>
              <li>• <strong>-tion / -tät</strong> (die Station, Universität)</li>
              <li>• <strong>Plurals</strong>: HAMESHA DIE!</li>
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
              🟢 100% DAS (Neuter)
            </div>
            <ul className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 space-y-1">
              <li>• <strong>-chen / -lein</strong> (das Mädchen, Brötchen)</li>
              <li>• <strong>-ment</strong> (das Dokument, Instrument)</li>
              <li>• <strong>-um</strong> (das Zentrum, Museum)</li>
              <li>• <strong>Verbs as Nouns</strong> (das Essen, das Leben)</li>
              <li>• <strong>Metals</strong> (das Gold, das Silber)</li>
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
              🔵 100% DER (Masculine)
            </div>
            <ul className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 space-y-1">
              <li>• <strong>Days</strong> (der Montag, Dienstag)</li>
              <li>• <strong>Months</strong> (der Januar, Mai)</li>
              <li>• <strong>Seasons</strong> (der Sommer, Winter)</li>
              <li>• <strong>Directions</strong> (der Norden, Süden)</li>
              <li>• <strong>-er Male Jobs</strong> (der Lehrer, Arzt)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Cases Formula */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-black text-xs">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
              Cases Cheat Sheet: Nominativ, Akkusativ, Dativ
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold border border-neutral-200 rounded-2xl overflow-hidden dark:border-neutral-800">
            <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <tr>
                <th className="p-3 text-left">Case / Role</th>
                <th className="p-3 text-left text-blue-600 dark:text-blue-400">Masculine</th>
                <th className="p-3 text-left text-rose-600 dark:text-rose-400">Feminine</th>
                <th className="p-3 text-left text-emerald-600 dark:text-emerald-400">Neuter</th>
                <th className="p-3 text-left text-amber-600 dark:text-amber-400">Plural</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr>
                <td className="p-3 font-black">Nominativ (Subject - कौन)</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">der / ein</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">die / eine</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">das / ein</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">die / keine</td>
              </tr>
              <tr className="bg-rose-50/30 dark:bg-rose-950/10">
                <td className="p-3 font-black">Akkusativ (Direct Object - किसको/क्या)</td>
                <td className="p-3 font-black text-rose-600 dark:text-rose-400">den / einen ⚡</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">die / eine (Same!)</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">das / ein (Same!)</td>
                <td className="p-3 text-neutral-800 dark:text-neutral-200">die / keine (Same!)</td>
              </tr>
              <tr className="bg-blue-50/30 dark:bg-blue-950/10">
                <td className="p-3 font-black">Dativ (Indirect Object - किसके लिए)</td>
                <td className="p-3 font-black text-blue-600 dark:text-blue-400">dem / einem</td>
                <td className="p-3 font-black text-blue-600 dark:text-blue-400">der / einer ⚡</td>
                <td className="p-3 font-black text-blue-600 dark:text-blue-400">dem / einem</td>
                <td className="p-3 font-black text-blue-600 dark:text-blue-400">den / keinen + n</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium">
          💡 <strong>Akkusativ trick:</strong> Sirf Masculine badalta hai (der → den). Baaki sab same rehte hain!<br />
          💡 <strong>Dativ trick:</strong> Feminine "die" badalkar "der" ban jata hai (ulta lagta hai!).
        </p>
      </div>

      {/* 3. Top 10 Irregular Verbs with Perfekt */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs">
              03
            </span>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
              Top 10 High-Frequency Verbs in Perfekt Past
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { inf: 'gehen (to go)', past: 'ist gegangen', ex: 'Ich bin nach Hause gegangen.' },
            { inf: 'fahren (to travel)', past: 'ist gefahren', ex: 'Wir sind mit dem Zug gefahren.' },
            { inf: 'kommen (to come)', past: 'ist gekommen', ex: 'Er ist pünktlich gekommen.' },
            { inf: 'aufstehen (to wake up)', past: 'ist aufgestanden', ex: 'Ich bin um 6 Uhr aufgestanden.' },
            { inf: 'essen (to eat)', past: 'hat gegessen', ex: 'Ich habe eine Pizza gegessen.' },
            { inf: 'trinken (to drink)', past: 'hat getrunken', ex: 'Wir haben Tee getrunken.' },
            { inf: 'schreiben (to write)', past: 'hat geschrieben', ex: 'Ich habe eine E-Mail geschrieben.' },
            { inf: 'sprechen (to speak)', past: 'hat gesprochen', ex: 'Sie hat Deutsch gesprochen.' },
            { inf: 'sehen (to see)', past: 'hat gesehen', ex: 'Ich habe den Arzt gesehen.' },
            { inf: 'bleiben (to stay)', past: 'ist geblieben', ex: 'Er ist im Hotel geblieben.' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white">
                  {item.inf} ➔ <span className="text-rose-600 dark:text-rose-400">{item.past}</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5 italic">
                  {item.ex}
                </div>
              </div>
              <AudioPlayerButton text={item.ex} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Crucial Germany Survival Phrases */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-black text-xs">
              04
            </span>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
              Essential Germany Life Survival Sentences
            </h2>
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { de: 'Könnten Sie das bitte noch einmal wiederholen?', hi: 'क्या आप कृपया इसे एक बार और दोहरा सकते हैं? (Job / Office)', cat: 'Polite' },
            { de: 'Ich habe seit zwei Tagen hohes Fieber und brauche eine Krankmeldung.', hi: 'मुझे दो दिन से बुखार है और डॉक्टर सिक नोट चाहिए। (Doctor)', cat: 'Health' },
            { de: 'Ich möchte meinen neuen Wohnsitz anmelden. Hier sind meine Unterlagen.', hi: 'मैं अपना नया पता रजिस्टर करवाना चाहता हूँ। (Bürgeramt)', cat: 'Anmeldung' },
            { de: 'Entschuldigung, von welchem Gleis fährt der Zug nach München ab?', hi: 'माफ़ कीजिए, म्यूनिख जाने वाली ट्रेन किस ट्रैक से जाएगी? (Train)', cat: 'Bahnhof' },
            { de: 'Sehr geehrte Damen und Herren, anbei finden Sie meinen Lebenslauf.', hi: 'आदरणीय महोदय, साथ में मेरा बायोडाटा संलग्न है। (Email)', cat: 'Work' }
          ].map((ph, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
              <div className="space-y-0.5">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[9px] font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {ph.cat}
                </span>
                <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                  &ldquo;{ph.de}&rdquo;
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {ph.hi}
                </p>
              </div>
              <AudioPlayerButton text={ph.de} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

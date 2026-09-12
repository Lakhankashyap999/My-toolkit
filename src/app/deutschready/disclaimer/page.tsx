import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>

      <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex items-center gap-2 text-rose-600">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Transparency &amp; Legal Notice</span>
        </div>

        <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
          Platform Disclaimers
        </h1>

        <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            1. Independent Educational Platform
          </h2>
          <p>
            DeutschReady is an independent digital educational learning platform. DeutschReady is NOT affiliated with, endorsed by, or sponsored by the Goethe-Institut, telc gGmbH, TestDaF-Institut, ÖSD, or any governmental agency in Germany, India, or elsewhere.
          </p>

          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            2. Original Practice Content
          </h2>
          <p>
            All curricula, mock quizzes, roleplay scenarios, and diagnostic questions provided on DeutschReady are 100% original educational material created for self-study and practice. They do not constitute official past examination papers.
          </p>

          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            3. Zero Visa, Job, or University Guarantee
          </h2>
          <p>
            DeutschReady does not promise or guarantee visa issuance, job offers, Ausbildung placements, university admissions, or passing any official language examination. Language mastery and immigration outcomes depend entirely on individual dedication, study hours, official exam performance, and external regulatory requirements.
          </p>

          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            4. AI-Generated Explanations
          </h2>
          <p>
            Our AI Doubt Solver provides contextual explanations designed to simplify complex German concepts. While we continuously refine our models for pedagogical accuracy, users are encouraged to verify critical legal or bureaucratic terms with official German municipal (Bürgeramt) or embassy resources.
          </p>
        </div>
      </div>
    </div>
  );
}

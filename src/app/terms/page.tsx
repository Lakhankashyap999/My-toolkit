// @ts-nocheck
"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#f5f5f7]/80 border-b border-black/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <span className="text-[17px] font-semibold">ToolBox</span>
          </a>
          <a href="/" className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors">
            ← Back to Home
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-6">Terms & Conditions</h1>
        <p className="text-[15px] text-[#6e6e73] mb-8">Last updated: August 2026</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              By accessing or using ToolBox services, you agree to be bound by these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              ToolBox provides online tools for PDF editing, resume creation, image compression, and other utilities. Some tools are free, while Pro features require a one-time payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Pro Subscription</h2>
            <ul className="text-[15px] leading-relaxed text-[#6e6e73] list-disc pl-5 space-y-2">
              <li>Pro access is valid for 30 days from the date of payment.</li>
              <li>The subscription is linked to the email address used during payment.</li>
              <li>No refunds will be issued once payment is completed, unless required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. User Responsibilities</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              You agree not to misuse our services, attempt to bypass paywalls, or use our tools for illegal purposes. We reserve the right to terminate access for violations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              ToolBox is provided "as is" without warranties. We are not liable for any damages arising from the use of our services, including data loss or processing errors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              We may update these Terms from time to time. Continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              For questions about these Terms, contact us at <a href="mailto:support@toolbox.in" className="text-[#0071e3] hover:underline">support@toolbox.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
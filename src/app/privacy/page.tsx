// @ts-nocheck
"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-semibold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-[15px] text-[#6e6e73] mb-8">Last updated: August 2026</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              We collect your email address only when you register to use our tools. We do not collect personal information like name, phone number, or address unless you provide it voluntarily.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="text-[15px] leading-relaxed text-[#6e6e73] list-disc pl-5 space-y-2">
              <li>To verify your email and provide access to tools</li>
              <li>To manage your Pro subscription</li>
              <li>To improve our services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              Your files (PDFs, images, etc.) are processed entirely in your browser and are never uploaded to our servers. Your email and subscription details are stored securely in our database (Supabase) with encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Sharing of Information</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              We do not sell, trade, or rent your personal information to third parties. We may share data with service providers (like Razorpay for payments, Supabase for database) solely to operate our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              We use localStorage to remember your login email and Pro access on your device. We do not use tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
            <p className="text-[15px] leading-relaxed text-[#6e6e73]">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@toolbox.in" className="text-[#0071e3] hover:underline">support@toolbox.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
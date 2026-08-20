// @ts-nocheck
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since no backend, open mail client with prefilled details
    const subject = `Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    window.location.href = `mailto:support@toolbox.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

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
        <h1 className="text-4xl font-semibold tracking-tight mb-6 text-center">Contact Us</h1>
        <p className="text-center text-[15px] text-[#6e6e73] mb-10">
          Have a question, suggestion, or need support? We'd love to hear from you.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white py-3 rounded-full font-semibold transition-colors"
            >
              Send Message
            </button>
            {submitted && (
              <p className="text-center text-sm text-green-600">
                Your email client should open. If not, email us at support@toolbox.in
              </p>
            )}
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-[#6e6e73]">
          <p>📧 Email: <a href="mailto:support@toolbox.in" className="text-[#0071e3] hover:underline">support@toolbox.in</a></p>
          <p className="mt-2">🕐 Response time: 24-48 hours</p>
        </div>
      </div>
    </div>
  );
}
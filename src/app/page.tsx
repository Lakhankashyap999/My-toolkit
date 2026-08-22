// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const tools = [
  {
    id: 1,
    name: "PDF Editor",
    icon: "📄",
    gradient: "from-rose-400 to-orange-400",
    glow: "rgba(251,146,60,0.35)",
    badge: "Popular",
    price: "₹0 / Free",
    proPrice: "₹29 Pro",
    desc: "Merge, split, compress, and convert PDFs instantly.",
    features: ["Merge PDF", "Split PDF", "Compress PDF", "Image to PDF"],
    path: "/pdf-tools",
  },
  {
    id: 2,
    name: "Resume Maker",
    icon: "📝",
    gradient: "from-blue-400 to-indigo-400",
    glow: "rgba(99,102,241,0.35)",
    badge: "New",
    price: "₹29 Pro",
    proPrice: "₹29 One-time",
    desc: "Create ATS-friendly resumes with beautiful templates.",
    features: ["3 Templates", "Live Preview", "Download as PDF", "No Watermark"],
    path: "/resume-maker",
  },
  {
    id: 3,
    name: "Image Compressor",
    icon: "🖼️",
    gradient: "from-emerald-400 to-teal-400",
    glow: "rgba(45,212,191,0.35)",
    badge: "Fast",
    price: "₹0 / Free",
    proPrice: "Unlimited",
    desc: "Reduce image size without losing quality.",
    features: ["Compress up to 80%", "Batch Processing", "High Quality", "No Upload Limit"],
    path: "/image-compressor",
  },
  {
    id: 4,
    name: "Chatbot Help",
    icon: "💬",
    gradient: "from-purple-400 to-pink-400",
    glow: "rgba(217,70,239,0.35)",
    badge: "AI",
    price: "Coming Soon",
    proPrice: "Free in Pro",
    desc: "Instant answers to all your tool-related queries.",
    features: ["24/7 Support", "Smart Suggestions", "Quick Replies"],
    path: "/chatbot",
  },
];

const comingSoonTools = [
  { icon: "📄", name: "PDF to Word" },
  { icon: "🔁", name: "Word to PDF" },
  { icon: "🖼️", name: "PDF to JPG" },
  { icon: "🔒", name: "PDF Locker" },
  { icon: "📊", name: "PDF to Excel" },
  { icon: "📈", name: "Excel to PDF" },
  { icon: "📑", name: "PDF to PPT" },
  { icon: "📊", name: "PPT to PDF" },
  { icon: "🔢", name: "PDF Page Numberer" },
  { icon: "✍️", name: "PDF Signature" },
  { icon: "📖", name: "PDF Reader" },
  { icon: "📏", name: "Image Resizer" },
  { icon: "🔄", name: "Format Converter" },
  { icon: "🎯", name: "Background Remover" },
  { icon: "✂️", name: "Image Cropper" },
  { icon: "📸", name: "Passport Photo Maker" },
  { icon: "🔍", name: "Image to Text (OCR)" },
  { icon: "😂", name: "Meme Generator" },
  { icon: "💧", name: "Image Watermark" },
  { icon: "📝", name: "Text to PDF" },
  { icon: "🔤", name: "Word Counter" },
  { icon: "✏️", name: "Grammar Checker" },
  { icon: "🔎", name: "Plagiarism Checker" },
  { icon: "🔳", name: "QR Code Generator" },
  { icon: "📊", name: "Barcode Generator" },
  { icon: "🧾", name: "Invoice Generator" },
  { icon: "📨", name: "Letter Writer" },
  { icon: "🔐", name: "File Encryptor" },
  { icon: "🗝️", name: "Password Generator" },
  { icon: "📦", name: "File Compressor" },
  { icon: "🔍", name: "Duplicate File Finder" },
  { icon: "🏦", name: "EMI Calculator" },
  { icon: "🎂", name: "Age Calculator" },
  { icon: "📊", name: "Percentage Calculator" },
  { icon: "🧮", name: "GST Calculator" },
  { icon: "⚖️", name: "Unit Converter" },
  { icon: "⚕️", name: "BMI Calculator" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Freelance Designer",
    text: "This toolbox saved me hours every week. Image compressor is lightning fast!",
    avatar: "👨‍💻",
  },
  {
    name: "Priya Patel",
    role: "HR Manager",
    text: "Resume maker is super easy. I recommend it to all candidates.",
    avatar: "👩‍💼",
  },
  {
    name: "Amit Kumar",
    role: "Student",
    text: "PDF merge for college projects? Best free tool ever. No signup needed!",
    avatar: "👨‍🎓",
  },
];

const faqs = [
  {
    q: "Is this tool really free?",
    a: "Yes! Most basic features are free forever. Pro plan is only ₹29 for advanced tools and unlimited access.",
  },
  {
    q: "Do I need to create an account?",
    a: "No, you can use tools directly without any login. Your files are processed securely and deleted after download.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We don't store your files. All processing happens on your device or temporary server with auto-delete.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, Paytm, Google Pay, PhonePe, and all major debit/credit cards via Razorpay.",
  },
];

const navLinks = [
  { href: "#tools", label: "Tools" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New states for active users
  const [userCount, setUserCount] = useState<number>(0);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/public-users");
        const data = await res.json();
        if (res.ok) {
          setUserCount(data.total);
          setUsersList(data.users || []);
        }
      } catch {}
    };
    fetchUsers();
  }, []);

  return (
    <div
      className={`${inter.variable} font-sans min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white antialiased`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 dark:bg-[#040404]/75 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
            </a>

            <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#1d1d1f]/80 dark:text-white/80">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
              <a href="/account" className="hover:text-[#0071e3] dark:hover:text-white transition-colors flex items-center gap-1">
                <span className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-sm">👤</span>
                <span>My Account</span>
              </a>
              <button className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-medium transition-colors">
                Get Started Free
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <a href="/account" className="w-9 h-9 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-lg">
                👤
              </a>
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-label="Menu"
                className="w-9 h-9 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex flex-col items-center justify-center gap-[3px]"
              >
                <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-5 pt-1 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-[15px] font-medium text-[#1d1d1f]/80 dark:text-white/80 hover:bg-[#f5f5f7] dark:hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button className="mt-2 bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-[15px]">
                Get Started Free
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 sm:pt-28 pb-16 sm:pb-24 px-4">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-400/15 to-purple-400/20 dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-purple-500/15 blur-3xl" />
          <div className="absolute top-40 -left-20 w-64 h-64 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-24 -right-16 w-64 h-64 rounded-full bg-orange-300/20 dark:bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#f5f5f7] dark:bg-white/10 px-4 py-1.5 rounded-full text-[13px] font-medium mb-7 sm:mb-8 text-[#1d1d1f]/70 dark:text-white/70">
            <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full" />
            Trusted by {userCount > 0 ? `${userCount}+` : "..."} users in India
          </div>
          <h1 className="text-[36px] sm:text-[68px] font-semibold tracking-tight leading-[1.08] sm:leading-[1.05] mb-5 sm:mb-6">
            All your daily tools.
            <br />
            <span className="text-[#0071e3]">In one place.</span>
          </h1>
          <p className="text-[16px] sm:text-[21px] text-[#6e6e73] dark:text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Edit PDFs, create resumes, compress images, and get instant help —
            all with a beautifully simple interface. No signup required, just start using.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="#tools" className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px] shadow-lg shadow-blue-500/25">
              Explore Tools
            </a>
            <a href="#pricing" className="bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px]">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 mb-16 sm:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">
              {userCount > 0 ? `${userCount}+` : "..."}
            </div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Active Users</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">1.5K+</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Files Processed</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">4.5/5</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Average Rating</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">No Signup</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Required</div>
          </div>
        </div>

        {/* See active users button */}
        <div className="text-center mt-5">
          <button
            onClick={() => setShowUsers(true)}
            className="text-sm text-[#0071e3] hover:underline font-medium"
          >
            See our active users →
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Why choose ToolBox?</h2>
        <p className="text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          We focus on speed, privacy, and simplicity. No clutter, no ads, just tools that work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Process files in seconds, right in your browser." },
            { icon: "🔒", title: "100% Secure", desc: "Your files are never stored. Auto-delete after processing." },
            { icon: "💸", title: "Affordable Pro", desc: "Unlock all tools for just ₹29 — one-time, no subscription." },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-3xl p-6 sm:p-8 hover:bg-[#eeeef0] dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-2xl mb-5 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-semibold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-[#6e6e73] dark:text-white/60 text-[14px] sm:text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Tools */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Available tools</h2>
        <p className="text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          Pick a tool and get started instantly — no login, no hassle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white dark:bg-[#111113] rounded-3xl border border-black/5 dark:border-white/10 p-6 flex flex-col hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)] dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-5`}
                style={{ boxShadow: `0 10px 24px -6px ${tool.glow}` }}
              >
                {tool.icon}
              </div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-[18px] font-semibold tracking-tight">{tool.name}</h3>
                <span className="text-[11px] bg-[#0071e3]/10 text-[#0071e3] dark:bg-white/10 dark:text-white px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  {tool.badge}
                </span>
              </div>
              <p className="text-[#6e6e73] dark:text-white/60 text-[14px] mb-4 leading-relaxed">{tool.desc}</p>
              <ul className="space-y-1.5 mb-4 flex-grow">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-[13px] text-[#6e6e73] dark:text-white/50 flex items-center gap-2">
                    <span className="text-[#30d158]">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/10">
                <span className="text-[13px] font-medium text-[#6e6e73] dark:text-white/50">{tool.price}</span>
                {tool.path ? (
                  <Link
                    href={tool.path}
                    className="text-[13px] font-semibold text-[#0071e3] hover:underline transition"
                  >
                    Use Tool →
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(`${tool.name} will be live soon!`)}
                    className="text-[13px] font-semibold text-[#0071e3] hover:underline transition"
                  >
                    Use Tool →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Coming Soon</h2>
        <p className="text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          Our team is working on these tools. Stay tuned!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {comingSoonTools.map((tool, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedTool(tool);
                setShowModal(true);
              }}
              className="group relative bg-white dark:bg-[#111113] rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 p-4 sm:p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                {tool.icon}
              </div>
              <h3 className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-gray-800 dark:text-white">{tool.name}</h3>
              <span className="text-[10px] sm:text-[11px] bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white/60 px-2 py-0.5 rounded-full mt-2 inline-block">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f5f5f7] dark:bg-white/5 py-14 sm:py-20 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">How it works</h2>
          <p className="text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
            Three simple steps to get your work done.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              { step: "1", title: "Choose a Tool", desc: "Select the tool you need from the list above." },
              { step: "2", title: "Upload & Process", desc: "Upload your file or fill in details. Our tool does the rest." },
              { step: "3", title: "Download & Go", desc: "Get your processed file instantly. No waiting, no login." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#0071e3] text-white rounded-full flex items-center justify-center text-lg font-semibold mb-5 shadow-lg shadow-blue-500/25">
                  {s.step}
                </div>
                <h3 className="text-[18px] font-semibold mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[#6e6e73] dark:text-white/60 text-[14px] sm:text-[15px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">What users say</h2>
        <p className="text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 px-2">Loved by students, professionals, and creators.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-3xl p-6 sm:p-7 hover:bg-[#eeeef0] dark:hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-4">{t.avatar}</div>
              <p className="text-[#1d1d1f] dark:text-white/80 text-[14px] sm:text-[15px] leading-relaxed mb-5">"{t.text}"</p>
              <div className="font-semibold text-[14px] tracking-tight">{t.name}</div>
              <div className="text-[13px] text-[#6e6e73] dark:text-white/50">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#f5f5f7] dark:bg-white/5 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight mb-3 sm:mb-4">Simple, honest pricing</h2>
          <p className="text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14">Free forever. Upgrade only when you need more.</p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            <div className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left">
              <h3 className="text-[15px] font-semibold mb-2 text-[#6e6e73] dark:text-white/60">Free</h3>
              <p className="text-4xl font-semibold tracking-tight mb-5">₹0</p>
              <ul className="space-y-2.5 text-[14px] text-[#1d1d1f]/80 dark:text-white/70 mb-7">
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> PDF Merge & Split</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Image Compressor (5/day)</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Basic Resume Template</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> No Ads, No Signup</li>
              </ul>
              <button className="w-full bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white py-3 rounded-full font-medium hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors">
                Start Free
              </button>
            </div>
            <div className="bg-[#0071e3] rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left relative text-white shadow-xl shadow-blue-500/20">
              <span className="absolute top-6 right-6 bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-medium">POPULAR</span>
              <h3 className="text-[15px] font-semibold mb-2 text-white/80">Pro</h3>
              <p className="text-4xl font-semibold tracking-tight mb-1">₹29</p>
              <p className="text-[13px] text-white/70 mb-5">one-time payment</p>
              <ul className="space-y-2.5 text-[14px] text-white/90 mb-7">
                <li className="flex items-center gap-2"><span>✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span>✓</span> Unlimited Image Compression</li>
                <li className="flex items-center gap-2"><span>✓</span> 3+ Resume Templates</li>
                <li className="flex items-center gap-2"><span>✓</span> PDF Compress & Convert</li>
                <li className="flex items-center gap-2"><span>✓</span> Priority Support</li>
              </ul>
              <Link
                href="/payment"
                className="block w-full bg-white text-[#0071e3] py-3 rounded-full font-semibold hover:bg-white/90 transition-colors text-center"
              >
                Get Pro for ₹29
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-14 sm:py-20">
        <h2 className="text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-10 sm:mb-12">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-5 sm:p-6">
              <summary className="flex justify-between items-center gap-4 cursor-pointer font-medium text-[14px] sm:text-[15px] tracking-tight list-none">
                {faq.q}
                <span className="text-[#6e6e73] dark:text-white/50 shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[#6e6e73] dark:text-white/60 text-[13px] sm:text-[14px] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-[28px] sm:rounded-[40px] py-12 sm:py-16 px-6 text-center text-white shadow-xl shadow-blue-500/20">
          <h2 className="text-[26px] sm:text-5xl font-semibold tracking-tight mb-4">Ready to simplify your daily tasks?</h2>
          <p className="text-[15px] sm:text-[17px] opacity-90 mb-8">Join thousands of happy users. No signup required.</p>
          <a
            href="#tools"
            className="inline-block bg-white text-[#0071e3] px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-[14px] sm:text-[15px] hover:bg-white/90 transition-colors"
          >
            Start Using Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 py-10 sm:py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-3 pb-8 sm:pb-10 mb-8 sm:mb-10 border-b border-black/5 dark:border-white/10">
            <span className="text-[11px] uppercase tracking-widest text-[#6e6e73] dark:text-white/40 font-medium">
              Crafted by
            </span>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center text-white font-semibold text-lg shadow-md ring-4 ring-[#f5f5f7] dark:ring-white/10">
              LK
            </div>
            <div>
              <div className="font-semibold text-[15px] tracking-tight">Lakhan Kashyap</div>
              <div className="text-[13px] text-[#6e6e73] dark:text-white/50">Founder & Developer</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛠️</span>
              <span className="font-semibold text-[15px] tracking-tight">ToolBox</span>
            </div>
            <div className="text-[13px] text-[#6e6e73] dark:text-white/50">
              © {new Date().getFullYear()} ToolBox. All rights reserved.
            </div>
            <div className="flex gap-5 text-[13px] text-[#6e6e73] dark:text-white/50">
              <a href="/privacy" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      {showModal && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">{selectedTool.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{selectedTool.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              This tool is currently under development.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Our team is working hard to bring it to you soon. Stay tuned!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Active Users Modal */}
      {showUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold tracking-tight">
                👥 Active Users ({userCount})
              </h2>
              <button
                onClick={() => setShowUsers(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {usersList.length > 0 ? (
              <ul className="space-y-3">
                {usersList.map((user, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-[#f5f5f7] dark:bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-sm font-medium truncate">{user.email}</span>
                    <span className="text-xs text-[#6e6e73] dark:text-white/50 whitespace-nowrap ml-3">
                      {user.joined}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#6e6e73]">No users yet.</p>
            )}

            <p className="mt-4 text-xs text-[#6e6e73] text-center">
              🔒 Emails are masked to protect privacy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
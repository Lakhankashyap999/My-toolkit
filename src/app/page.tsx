// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LaptopScene = dynamic(() => import("../components/LaptopScene"), { ssr: false });
const VirtualOffice = dynamic(() => import("../components/VirtualOffice"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

/* ========================================================================== */
/*  DATA DEFINITIONS                                                          */
/* ========================================================================== */

const TOOL_CATEGORIES = ["All Tools", "PDF Suite", "Image Tools", "Resume & HR", "Utilities", "AI Assistant"];

const tools = [
  {
    id: 1,
    name: "PDF Editor",
    category: "PDF Suite",
    icon: "📄",
    gradient: "from-rose-400 to-orange-400",
    glow: "rgba(251,146,60,0.35)",
    badge: "Popular",
    price: "₹0 / Free",
    proPrice: "₹29 Pro",
    desc: "Merge, split, compress, and convert PDFs instantly in your browser.",
    features: ["Merge PDF", "Split PDF", "Compress PDF", "Image to PDF"],
    path: "/pdf-tools",
  },
  {
    id: 2,
    name: "Resume Maker",
    category: "Resume & HR",
    icon: "📝",
    gradient: "from-blue-400 to-indigo-400",
    glow: "rgba(99,102,241,0.35)",
    badge: "New",
    price: "₹29 Pro",
    proPrice: "₹29 One-time",
    desc: "Create ATS-friendly resumes with 5 clean professional templates.",
    features: ["5 ATS Templates", "Live Sheet Preview", "Download PDF", "Sample Data Fill"],
    path: "/resume-maker",
  },
  {
    id: 3,
    name: "Image Compressor",
    category: "Image Tools",
    icon: "🖼️",
    gradient: "from-emerald-400 to-teal-400",
    glow: "rgba(45,212,191,0.35)",
    badge: "Fast",
    price: "₹0 / Free",
    proPrice: "Unlimited",
    desc: "Reduce image size up to 80% without losing visual quality.",
    features: ["Compress up to 80%", "Batch Processing", "High Quality", "No Upload Limit"],
    path: "/image-compressor",
  },
  {
    id: 4,
    name: "QR Code Generator",
    category: "Utilities",
    icon: "🔳",
    gradient: "from-slate-500 to-gray-700",
    glow: "rgba(100,116,139,0.35)",
    badge: "New",
    price: "₹0 / Free",
    proPrice: "Free",
    desc: "Create high-resolution QR codes from any text or URL instantly.",
    features: ["High-Quality PNG", "Instant Download", "No Signup Required"],
    path: "/qr-code-generator",
  },
  {
    id: 5,
    name: "PDF to Word",
    category: "PDF Suite",
    icon: "📄",
    gradient: "from-amber-400 to-orange-400",
    glow: "rgba(245,158,11,0.35)",
    badge: "New",
    price: "₹0 / Free",
    proPrice: "Free",
    desc: "Convert PDF documents into editable Word (.docx) files smoothly.",
    features: ["Text Extraction", "Preserves Formatting", "Free & Blazing Fast"],
    path: "/pdf-to-word",
  },
  {
    id: 6,
    name: "ULTRON 3.0 AI",
    category: "AI Assistant",
    icon: "💬",
    gradient: "from-purple-400 to-pink-400",
    glow: "rgba(217,70,239,0.35)",
    badge: "AI 3.0",
    price: "Free AI",
    proPrice: "Neural Engine",
    desc: "Instant multi-lingual AI assistance for document tools and coding queries.",
    features: ["Multi-Lingual Engine", "Smart Suggestions", "Embedded Tool Cards"],
    path: "/chatbot",
  },
];

const comingSoonTools = [
  { icon: "🔁", name: "Word to PDF", cat: "PDF Suite" },
  { icon: "🖼️", name: "PDF to JPG", cat: "PDF Suite" },
  { icon: "🔒", name: "PDF Locker", cat: "PDF Suite" },
  { icon: "📊", name: "PDF to Excel", cat: "PDF Suite" },
  { icon: "📈", name: "Excel to PDF", cat: "PDF Suite" },
  { icon: "📑", name: "PDF to PPT", cat: "PDF Suite" },
  { icon: "📊", name: "PPT to PDF", cat: "PDF Suite" },
  { icon: "🔢", name: "PDF Page Numberer", cat: "PDF Suite" },
  { icon: "✍️", name: "PDF Signature", cat: "PDF Suite" },
  { icon: "📖", name: "PDF Reader", cat: "PDF Suite" },
  { icon: "📏", name: "Image Resizer", cat: "Image Tools" },
  { icon: "🔄", name: "Format Converter", cat: "Image Tools" },
  { icon: "🎯", name: "Background Remover", cat: "Image Tools" },
  { icon: "✂️", name: "Image Cropper", cat: "Image Tools" },
  { icon: "📸", name: "Passport Photo Maker", cat: "Image Tools" },
  { icon: "🔍", name: "Image to Text (OCR)", cat: "Utilities" },
  { icon: "😂", name: "Meme Generator", cat: "Image Tools" },
  { icon: "💧", name: "Image Watermark", cat: "Image Tools" },
  { icon: "📝", name: "Text to PDF", cat: "PDF Suite" },
  { icon: "🔤", name: "Word Counter", cat: "Utilities" },
  { icon: "✏️", name: "Grammar Checker", cat: "AI Assistant" },
  { icon: "🔎", name: "Plagiarism Checker", cat: "AI Assistant" },
  { icon: "📊", name: "Barcode Generator", cat: "Utilities" },
  { icon: "🧾", name: "Invoice Generator", cat: "Utilities" },
  { icon: "📨", name: "Letter Writer", cat: "Utilities" },
  { icon: "🔐", name: "File Encryptor", cat: "Utilities" },
  { icon: "🗝️", name: "Password Generator", cat: "Utilities" },
  { icon: "📦", name: "File Compressor", cat: "Utilities" },
  { icon: "🔍", name: "Duplicate File Finder", cat: "Utilities" },
  { icon: "🏦", name: "EMI Calculator", cat: "Utilities" },
  { icon: "🎂", name: "Age Calculator", cat: "Utilities" },
  { icon: "📊", name: "Percentage Calculator", cat: "Utilities" },
  { icon: "🧮", name: "GST Calculator", cat: "Utilities" },
  { icon: "⚖️", name: "Unit Converter", cat: "Utilities" },
  { icon: "⚕️", name: "BMI Calculator", cat: "Utilities" },
];

const navLinks = [
  { href: "#office", label: "🏢 Virtual Office" },
  { href: "#tools", label: "Tools" },
  { href: "#showcase", label: "Live Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: "/chatbot", label: "AI Assistant" },
];

function parseStatValue(raw) {
  const m = String(raw).match(/([\d.]+)\s*(K|k)?/);
  if (!m) return null;
  const num = parseFloat(m[1]);
  const isK = !!m[2];
  return { num: isK ? num * 1000 : num, isK, suffix: raw.replace(m[0], "") };
}

function formatStatValue(value, meta) {
  if (!meta) return String(value);
  if (meta.isK) return `${(value / 1000).toFixed(1)}K${meta.suffix}`;
  if (Number.isInteger(meta.num)) return `${Math.round(value)}${meta.suffix}`;
  return `${value.toFixed(1)}${meta.suffix}`;
}

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userCount, setUserCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tools");

  const rootRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroPRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const blobsRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/public-users");
        const data = await res.json();
        if (res.ok) {
          setUserCount(data.total);
        }
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === "All Tools" || tool.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || `${tool.name} ${tool.desc} ${tool.features.join(" ")}`.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const filteredComingSoon = useMemo(() => {
    return comingSoonTools.filter((t) => {
      const matchesCategory = selectedCategory === "All Tools" || t.cat === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || t.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  /* GSAP Animations */
  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(heroBadgeRef.current, { autoAlpha: 0, y: 14, duration: 0.6 })
        .from(heroH1Ref.current, { autoAlpha: 0, y: 26, duration: 0.8 }, "-=0.35")
        .from(heroPRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.45")
        .from(heroBtnsRef.current?.children || [], { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 }, "-=0.4");

      if (!reduceMotion && blobsRef.current) {
        gsap.utils.toArray(blobsRef.current.children).forEach((blob, i) => {
          gsap.to(blob, {
            y: i % 2 === 0 ? 18 : -14,
            x: i % 2 === 0 ? -10 : 10,
            duration: 8 + i,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.classList.add("js-ready");
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none", once: true },
          immediateRender: false,
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const values = ["", "1.5K+", "4.5/5", "No Signup"];
    values[0] = userCount > 0 ? `${userCount}+` : "0+";

    const ctx = gsap.context(() => {
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const meta = parseStatValue(values[i]);
        if (!meta) return;
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: meta.num,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = formatStatValue(proxy.v, meta);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [userCount]);

  return (
    <div
      ref={rootRef}
      className={`${inter.variable} font-sans min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white antialiased overflow-x-hidden`}
    >
      <style jsx global>{`
        .js-ready .reveal-up {
          visibility: hidden;
          will-change: transform, opacity;
        }
        .js-ready .reveal-up.gsap-reveal-visible {
          visibility: visible;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          width: 200%;
          animation: marquee 32s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 dark:bg-[#040404]/75 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
            </a>

            <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#1d1d1f]/80 dark:text-white/80">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
              <a href="/account" className="hover:text-[#0071e3] dark:hover:text-white transition-colors flex items-center gap-1">
                <span className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-sm">👤</span>
                <span>My Account</span>
              </a>
              <a href="#tools" className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-medium transition-colors shadow-md shadow-blue-500/20">
                Explore Tools
              </a>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <a href="/account" className="w-9 h-9 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-lg">👤</a>
              <button onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu" className="w-9 h-9 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex flex-col items-center justify-center gap-[3px]">
                <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-5 pt-1 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-[15px] font-medium text-[#1d1d1f]/80 dark:text-white/80 hover:bg-[#f5f5f7] dark:hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a href="#tools" className="mt-2 bg-[#0071e3] text-white px-4 py-2.5 rounded-xl font-medium text-center text-[15px]">
                Explore Tools
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 sm:pt-28 pb-10 sm:pb-16 px-4">
        <div ref={blobsRef} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-purple-400/15 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div ref={heroBadgeRef} className="inline-flex items-center gap-2 bg-[#f5f5f7] dark:bg-white/10 px-4 py-1.5 rounded-full text-[13px] font-medium mb-7 sm:mb-8 text-[#1d1d1f]/70 dark:text-white/70 border border-black/[0.04]">
            <span className="w-1.5 h-1.5 bg-[#30d158] rounded-full" />
            Trusted by {userCount > 0 ? `${userCount}+` : "..."} users worldwide
          </div>
          <h1 ref={heroH1Ref} className="text-[36px] sm:text-[68px] font-semibold tracking-tight leading-[1.08] sm:leading-[1.05] mb-5 sm:mb-6">
            All your daily tools.
            <br />
            <span className="text-[#0071e3]">In one place.</span>
          </h1>
          <p ref={heroPRef} className="text-[16px] sm:text-[21px] text-[#6e6e73] dark:text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Edit PDFs, create resumes, compress images, and get instant help —
            supervised live by our virtual office team. No signup required.
          </p>
          <div ref={heroBtnsRef} className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="#office" className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px] shadow-lg shadow-blue-500/25">
              Enter Virtual Office 🏢
            </a>
            <a href="#tools" className="bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px]">
              Skip to Tools ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── 🏢 TOP-DOWN LIVING VIRTUAL OFFICE FLOOR ──────────────────────────── */}
      <section id="office" className="relative scroll-mt-20">
        <VirtualOffice />
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 my-14 sm:my-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[0] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">
              {userCount > 0 ? `${userCount}+` : "0+"}
            </div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Active Users</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[1] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">1.5K+</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Files Processed</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[2] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">4.5/5</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Average Rating</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[3] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">No Signup</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Required</div>
          </div>
        </div>
      </section>

      {/* Live 3D Showcase */}
      <section id="showcase" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">
          See ToolBox at work
        </h2>
        <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-8 sm:mb-12 max-w-xl mx-auto px-2">
          A live look at Merge PDF, Image Compressor and Resume Builder running end to end — right inside your browser.
        </p>

        <div className="reveal-up w-full max-w-4xl mx-auto">
          <LaptopScene className="w-full" />
        </div>
      </section>

      {/* Available Tools */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Available tools</h2>
        <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
          Pick a tool and get started instantly — no login, no hassle.
        </p>

        {/* Category Tabs */}
        <div className="reveal-up flex justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-6">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#0071e3] text-white shadow-md shadow-blue-500/20"
                  : "bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.04] dark:border-white/5 text-[#1d1d1f]/70 dark:text-white/70 hover:bg-[#e8e8ed]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="reveal-up max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g., PDF, QR, resume...)"
              className="w-full px-5 py-3.5 pr-12 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#111113] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0071e3] shadow-sm"
            />
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative bg-white dark:bg-[#111113] rounded-3xl border border-black/5 dark:border-white/10 p-6 flex flex-col hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-5`}>
                  {tool.icon}
                </div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-[18px] font-semibold tracking-tight">{tool.name}</h3>
                  <span className="text-[11px] bg-[#0071e3]/10 text-[#0071e3] dark:bg-white/10 dark:text-white px-2 py-1 rounded-full font-medium whitespace-nowrap">{tool.badge}</span>
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
                  <Link href={tool.path} className="text-[13px] font-semibold text-[#0071e3] hover:underline transition">Use Tool →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-[#1d1d1f] dark:text-white">No tools found</p>
          </div>
        )}
      </section>

      {/* Coming Soon Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Coming Soon</h2>
        <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          Our team is actively building these upcoming tools. Stay tuned!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {filteredComingSoon.map((tool, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedTool(tool);
                setShowModal(true);
              }}
              className="group relative bg-white dark:bg-[#111113] rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 p-4 sm:p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">{tool.icon}</div>
              <h3 className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-gray-800 dark:text-white">{tool.name}</h3>
              <span className="text-[10px] sm:text-[11px] bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white/60 px-2 py-0.5 rounded-full mt-2 inline-block">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#f5f5f7] dark:bg-white/5 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight mb-3 sm:mb-4">Simple, honest pricing</h2>
          <p className="reveal-up text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14">Free forever. Upgrade only when you need more.</p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            <div className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left">
              <h3 className="text-[15px] font-semibold mb-2 text-[#6e6e73] dark:text-white/60">Free</h3>
              <p className="text-4xl font-semibold tracking-tight mb-5">₹0</p>
              <ul className="space-y-2.5 text-[14px] text-[#1d1d1f]/80 dark:text-white/70 mb-7">
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> PDF Merge &amp; Split</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Image Compressor (5/day)</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Basic Resume Template</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> No Ads, No Signup</li>
              </ul>
              <a href="#tools" className="block w-full bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white py-3 rounded-full font-medium hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors text-center text-xs font-bold">Start Free</a>
            </div>
            <div className="bg-[#0071e3] rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left relative text-white shadow-xl shadow-blue-500/20">
              <span className="absolute top-6 right-6 bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-medium">POPULAR</span>
              <h3 className="text-[15px] font-semibold mb-2 text-white/80">Pro</h3>
              <p className="text-4xl font-semibold tracking-tight mb-1">₹29</p>
              <p className="text-[13px] text-white/70 mb-5">one-time payment</p>
              <ul className="space-y-2.5 text-[14px] text-white/90 mb-7">
                <li className="flex items-center gap-2"><span>✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span>✓</span> Unlimited Image Compression</li>
                <li className="flex items-center gap-2"><span>✓</span> 5 ATS Resume Templates</li>
                <li className="flex items-center gap-2"><span>✓</span> PDF Compress &amp; Convert</li>
                <li className="flex items-center gap-2"><span>✓</span> Priority Support</li>
              </ul>
              <Link href="/payment" className="block w-full bg-white text-[#0071e3] py-3 rounded-full font-semibold hover:bg-white/90 transition-colors text-center text-xs">Get Pro for ₹29</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ULTRA-COOL FOUNDER FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-black/5 dark:border-white/10 pt-12 pb-8 overflow-hidden relative bg-white dark:bg-[#07090e]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          
          {/* FOUNDER BRANDING CARD */}
          <div className="flex flex-col items-center gap-3 pb-8 mb-8 border-b border-black/5 dark:border-white/10">
            <div className="text-[11px] uppercase tracking-widest text-[#0071e3] dark:text-blue-400 font-extrabold">
              Crafted with Excellence by
            </div>

            {/* Glowing Circle Founder Avatar */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#0071e3] via-indigo-500 to-emerald-400 blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#0071e3] to-indigo-600 p-[2.5px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-inner border-2 border-white dark:border-slate-900">
                  LK
                </div>
              </div>
            </div>

            {/* Founder Name & Role Badges */}
            <div className="mt-1 space-y-1">
              <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-[#0071e3] to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-300">
                Lakhan Kashyap
              </h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] dark:bg-blue-950/60 dark:text-blue-300 font-bold px-3 py-1 rounded-full border border-[#0071e3]/20">
                  Founder &amp; Chief Architect
                </span>
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                  ToolBox Suite
                </span>
              </div>
            </div>
          </div>

          {/* ── SMOOTH LOW-SPEED MARQUEE TICKER LINE ───────────────────── */}
          <div className="w-full overflow-hidden bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl py-3.5 mb-8">
            <div className="animate-marquee-slow whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 opacity-70">
              <span className="inline-flex items-center gap-4 px-4">
                <span>🚀 <strong>Our Mission:</strong> Eliminating heavy app installs &amp; shady sites — providing instant, privacy-first browser utilities for everyone worldwide.</span>
                <span>•</span>
                <span>⚡ <strong>100% Client-Side:</strong> Your files never leave your device. Zero server logging.</span>
                <span>•</span>
                <span>💡 Built for extreme speed, simplicity, and efficiency.</span>
                <span>•</span>
              </span>
              <span className="inline-flex items-center gap-4 px-4">
                <span>🚀 <strong>Our Mission:</strong> Eliminating heavy app installs &amp; shady sites — providing instant, privacy-first browser utilities for everyone worldwide.</span>
                <span>•</span>
                <span>⚡ <strong>100% Client-Side:</strong> Your files never leave your device. Zero server logging.</span>
                <span>•</span>
                <span>💡 Built for extreme speed, simplicity, and efficiency.</span>
                <span>•</span>
              </span>
            </div>
          </div>

          <div className="text-xs text-[#6e6e73] dark:text-white/50 font-medium">
            © {new Date().getFullYear()} ToolBox Platform • All rights reserved. Made with ❤️ by Lakhan Kashyap.
          </div>
        </div>
      </footer>
    </div>
  );
}
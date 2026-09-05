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
/*  DATA DEFINITIONS (CA, LEGAL, CNC & DEV SUITE AT #1 PRIORITY)             */
/* ========================================================================== */

const TOOL_CATEGORIES = [
  "All Tools",
  "Daily Office & Dev",
  "Industrial & CNC",
  "Legal & Court",
  "Govt & Exam",
  "PDF Suite",
  "Calculators",
  "Image Tools",
  "Utilities",
  "Media & Audio",
  "Resume & HR",
  "AI Assistant",
];

const tools = [
  {
    id: 102,
    name: "IT & Developer Daily Office Suite",
    category: "Daily Office & Dev",
    icon: "💻",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    glow: "rgba(59,130,246,0.45)",
    badge: "💻 NEW • 14 DEV TOOLS",
    price: "👑 Pro Pass",
    desc: "14 Everyday IT & Developer Power Tools: .env Diff, Figma SVG to JSX, cURL to Fetch, JWT Inspector, JSON to C#/TS, Tailwind WCAG, Indian Mock Data, Git PR & Cron.",
    features: [
      "100% Client-Side (0 Data/Secret Leaks)",
      "Instant 0.01s (No AI Prompting Needed)",
      "Interactive Sliders & AST Parsers",
      "14-in-1 Daily Developer Suite",
    ],
    path: "/office-dev-suite",
  },
  {
    id: 101,
    name: "CNC & VMC Machine Diagnostic Suite",
    category: "Industrial & CNC",
    icon: "⚙️",
    gradient: "from-amber-500 via-orange-600 to-yellow-500",
    glow: "rgba(245,158,11,0.45)",
    badge: "🏭 NEW • INDUSTRIAL PRO",
    price: "👑 Pro Pass",
    desc: "1,000+ Alarm Codes (Fanuc, Siemens, Mitsubishi, Haas), Servo Drives, ATC Jam Recovery, Coolant/Lube Fault Trees & Part Defect Solver.",
    features: [
      "Fanuc, Siemens, Mitsubishi & Haas Alarms",
      "ATC Tool Changer Jam Recovery",
      "Coolant, Lube (15 Bar) & Pneumatics",
      "Part Defect & Speeds/Feeds Calculator",
    ],
    path: "/cnc-diagnostics",
  },
  {
    id: 1,
    name: "CA & Tax Master Suite",
    category: "Calculators",
    icon: "💎",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "rgba(245,158,11,0.45)",
    badge: "🌟 NEW RELEASE • TOP PRO",
    price: "👑 Pro Pass",
    desc: "Old vs New Tax Regime comparator (Budget 2024), GST Engine, TDS Matrix (Sec 206AA) & Official Printable CA Memo.",
    features: [
      "GST Master & GSTR Late Fee",
      "Complete TDS Matrix & Sec 206AA",
      "Depreciation IT WDV vs Co. Act SLM",
      "Printable Official CA Memo Sheet",
    ],
    path: "/tax-suite",
  },
  {
    id: 2,
    name: "Advocate & Legal Master Suite",
    category: "Legal & Court",
    icon: "⚖️",
    gradient: "from-indigo-600 via-purple-600 to-blue-600",
    glow: "rgba(99,102,241,0.45)",
    badge: "🏛️ NEW • LAW PRO",
    price: "👑 Pro Pass",
    desc: "IPC to BNS (2024 Law) Section Converter, 1950-2025 Supreme Court Landmark Rulings Matrix, 1-Click Court Notice Generator & Limitation Engine.",
    features: [
      "IPC ⟷ BNS & CrPC ⟷ BNSS (2024)",
      "Supreme Court Precedents Matrix",
      "1-Click Sec 138 / Eviction Notices",
      "Limitation & Court Fee Calculator",
    ],
    path: "/legal-suite",
  },
  {
    id: 202,
    name: "Exam Photo & Sign Resizer",
    category: "Govt & Exam",
    icon: "📸",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.35)",
    badge: "🔥 Hot Exam Tool",
    price: "₹0 / Free",
    desc: "SSC, UPSC, IBPS, Police aur Railway ke exact KB (20-50KB), Dimension & Name-Date on Photo banayein.",
    features: ["Exact KB Targeting (20-50KB)", "Name & Date of Photo (DOP)", "SSC/UPSC/IBPS Presets", "100% In-Browser"],
    path: "/exam-resizer",
  },
  {
    id: 3,
    name: "Passport Size Photo Maker",
    category: "Image Tools",
    icon: "🪪",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.35)",
    badge: "Print Ready",
    price: "₹0 / Free",
    desc: "Ghar baithe 4x6 ya A4 sheet pe 6, 8 ya 30 photos ki print-ready passport grid sheet banayein.",
    features: ["4x6 & A4 Sheet Layout", "Background Color Change", "Cutting Border Lines", "Print-Ready Output"],
    path: "/passport-photo",
  },
  {
    id: 4,
    name: "Background Remover (AI HD)",
    category: "Image Tools",
    icon: "🎯",
    gradient: "from-pink-500 to-rose-600",
    glow: "rgba(244,63,94,0.35)",
    badge: "👑 Pro HD",
    price: "👑 Pro",
    desc: "1-Click instant transparent PNG background cutout & cyber studio background replacer.",
    features: ["Transparent Cutout", "Studio Colors & Gradients", "Ultra Crisp Edges", "Instant PNG Export"],
    path: "/background-remover",
  },
  {
    id: 5,
    name: "Image Cropper & Rotate",
    category: "Image Tools",
    icon: "✂️",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.35)",
    badge: "Social Presets",
    price: "₹0 / Free",
    desc: "1:1 DP, 16:9 YouTube, 9:16 Reels/Story presets, 90° rotate and flip images in 1-click.",
    features: ["1:1, 16:9, 9:16, 4:5 Ratios", "90° Rotate Left/Right", "Horizontal & Vertical Flip", "High-Res JPEG Export"],
    path: "/image-cropper",
  },
  {
    id: 6,
    name: "Universal Format Converter",
    category: "Image Tools",
    icon: "🔄",
    gradient: "from-purple-500 to-indigo-600",
    glow: "rgba(168,85,247,0.35)",
    badge: "Favicon .ICO",
    price: "₹0 / Free",
    desc: "Convert JPG, PNG, WEBP and create 64x64 Website Favicon (.ICO) with quality slider.",
    features: ["JPG / PNG / WEBP", "64x64 .ICO Favicon Maker", "Quality Compression Slider", "Batch Convert"],
    path: "/format-converter",
  },
  {
    id: 7,
    name: "Image Compressor",
    category: "Image Tools",
    icon: "🖼️",
    gradient: "from-emerald-400 to-teal-400",
    glow: "rgba(45,212,191,0.35)",
    badge: "Fast",
    price: "₹0 / Free",
    desc: "Reduce image size up to 80% without losing visual sharpness or resolution.",
    features: ["Compress up to 80%", "Batch Processing", "Lossless Quality", "No Upload Limit"],
    path: "/image-compressor",
  },
  {
    id: 8,
    name: "Audio & Ringtone Cutter",
    category: "Media & Audio",
    icon: "🎵",
    gradient: "from-purple-500 to-pink-600",
    glow: "rgba(168,85,247,0.35)",
    badge: "Waveform Trimmer",
    price: "₹0 / Free",
    desc: "Kisi bhi audio file ya gaane se cut karke WhatsApp status aur ringtone banayein.",
    features: ["Exact Millisecond Trimmer", "Audio Waveform View", "WAV/MP3 Audio Export", "Zero Latency"],
    path: "/audio-cutter",
  },
  {
    id: 9,
    name: "Online GST Calculator",
    category: "Calculators",
    icon: "🧮",
    gradient: "from-blue-600 to-cyan-600",
    glow: "rgba(37,99,235,0.35)",
    badge: "Tax Engine",
    price: "₹0 / Free",
    desc: "Inclusive & Exclusive GST, 5%, 12%, 18%, 28% slabs with CGST/SGST/IGST breakdown.",
    features: ["+GST & -GST Modes", "CGST & SGST Split", "5%, 12%, 18%, 28% Presets", "Printable Tax Summary"],
    path: "/gst-calculator",
  },
  {
    id: 10,
    name: "Loan EMI Calculator",
    category: "Calculators",
    icon: "🏦",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
    badge: "Amortization",
    price: "₹0 / Free",
    desc: "Home, Car & Personal loan monthly EMI, Principal vs Interest ratio bar & yearly schedule.",
    features: ["Interactive Sliders", "Visual Ratio Bar", "Yearly Breakdown Schedule", "Home/Car/Personal Presets"],
    path: "/emi-calculator",
  },
  {
    id: 11,
    name: "Exact Age & Birthday Countdown",
    category: "Calculators",
    icon: "🎂",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.35)",
    badge: "Live Ticking",
    price: "₹0 / Free",
    desc: "Exact years, months, days, ticking seconds lived, zodiac sign, and next birthday countdown.",
    features: ["Live Seconds Counter", "Next Birthday Timer", "Zodiac & Born Day Finder", "Total Hours & Weeks Lived"],
    path: "/age-calculator",
  },
  {
    id: 12,
    name: "4-in-1 Percentage Calculator",
    category: "Calculators",
    icon: "📊",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.35)",
    badge: "Multi Math",
    price: "₹0 / Free",
    desc: "X% of Y, percentage increase/decrease, ratios, and sale discount price calculator.",
    features: ["What is X% of Y", "Percentage Increase/Decrease", "Sale Discount & Savings", "Instant Math Engine"],
    path: "/percentage-calculator",
  },
  {
    id: 13,
    name: "Universal Unit Converter",
    category: "Calculators",
    icon: "⚖️",
    gradient: "from-indigo-500 to-blue-600",
    glow: "rgba(99,102,241,0.35)",
    badge: "Land Acre/Bigha",
    price: "₹0 / Free",
    desc: "Convert Length, Mass, Indian Land Area (Acre, Bigha, Gaj), Temp & Digital Storage.",
    features: ["Indian Land Area (Bigha/Gaj)", "Length & Weight Units", "Temperature & Data Storage", "1-Click Unit Swap"],
    path: "/unit-converter",
  },
  {
    id: 14,
    name: "BMI & Ideal Weight Calculator",
    category: "Calculators",
    icon: "⚕️",
    gradient: "from-teal-500 to-emerald-600",
    glow: "rgba(20,184,166,0.35)",
    badge: "WHO Health",
    price: "₹0 / Free",
    desc: "WHO standard BMI meter, healthy weight range for height, and daily BMR maintenance calories.",
    features: ["WHO Standard Meter", "Ideal Weight Range", "Daily BMR Calories", "Metric & Imperial"],
    path: "/bmi-calculator",
  },
  {
    id: 15,
    name: "GST Invoice & Bill Generator",
    category: "Utilities",
    icon: "🧾",
    gradient: "from-blue-600 to-indigo-700",
    glow: "rgba(37,99,235,0.35)",
    badge: "👑 Pro Invoice",
    price: "👑 Pro",
    desc: "Create professional GST invoices with dynamic line items, auto tax calculation and PDF print.",
    features: ["Dynamic Line Items", "Auto Rate & Subtotal", "GST Breakdown", "Print / Save PDF"],
    path: "/invoice-generator",
  },
  {
    id: 16,
    name: "Secure Password Generator",
    category: "Utilities",
    icon: "🗝️",
    gradient: "from-slate-600 to-gray-800",
    glow: "rgba(100,116,139,0.35)",
    badge: "AES Entropy",
    price: "₹0 / Free",
    desc: "Generate crypto-secure passwords with length slider, entropy crack-time meter & bulk list.",
    features: ["4-48 Length Slider", "Crack Time Strength Meter", "1-Click Copy", "Bulk 5-Password List"],
    path: "/password-generator",
  },
  {
    id: 17,
    name: "Barcode Generator & Sheet",
    category: "Utilities",
    icon: "📊",
    gradient: "from-gray-700 to-black",
    glow: "rgba(75,85,99,0.35)",
    badge: "18-in-1 Sheet",
    price: "₹0 / Free",
    desc: "Code-128, EAN-13, UPC barcodes with instant PNG download + 18-in-1 printable sticker sheet.",
    features: ["Code-128 / EAN-13 / UPC", "18-in-1 Printable Sheet", "Custom Height/Width", "Vector Sharp PNG"],
    path: "/barcode-generator",
  },
  {
    id: 18,
    name: "QR Code Generator",
    category: "Utilities",
    icon: "🔳",
    gradient: "from-slate-500 to-gray-700",
    glow: "rgba(100,116,139,0.35)",
    badge: "Instant QR",
    price: "₹0 / Free",
    desc: "Create high-resolution QR codes from any text or URL instantly without signup.",
    features: ["High-Quality PNG", "Instant Download", "No Signup Required", "Custom Foreground"],
    path: "/qr-code-generator",
  },
  {
    id: 19,
    name: "Word & Character Counter",
    category: "Utilities",
    icon: "🔤",
    gradient: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.35)",
    badge: "Content Tool",
    price: "₹0 / Free",
    desc: "Real-time words, characters, sentences, reading time, keyword density, and text casing.",
    features: ["Live Word/Char Counter", "Reading & Speaking Time", "Top Keyword Density", "UPPER/Lower/Camel Case"],
    path: "/word-counter",
  },
  {
    id: 20,
    name: "Mobile Doc Scanner & Clean PDF",
    category: "Utilities",
    icon: "📷",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
    badge: "CamScanner Alt",
    price: "₹0 / Free",
    desc: "Photo se gande background & shadows saaf karke clean printed A4 PDF banayein.",
    features: ["Magic Color Filter", "Pure Black & White Filter", "Multi-Page Scan", "Instant PDF Download"],
    path: "/doc-scanner",
  },
  {
    id: 21,
    name: "Image to Text (OCR)",
    category: "Utilities",
    icon: "🔍",
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.35)",
    badge: "AI Text OCR",
    price: "₹0 / Free",
    desc: "Extract text from receipts, screenshots, and book pages with editable notepad & .TXT download.",
    features: ["Instant Text Extraction", "Live Word Counter", "Editable Notepad", "Save as .TXT"],
    path: "/image-to-text",
  },
  {
    id: 22,
    name: "Accurate PDF to Word (.DOCX)",
    category: "PDF Suite",
    icon: "📄",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.35)",
    badge: "⚡ 0.2s Engine",
    price: "₹0 / Free",
    desc: "Extract text from PDF without scattered words. Live editable document preview & clean .DOCX export.",
    features: ["Preserved Line Structure", "0.2s In-Browser Speed", "Live Word Preview & Editor", "Download .DOCX & .TXT"],
    path: "/pdf-to-word",
  },
  {
    id: 23,
    name: "Text to Clean A4 PDF",
    category: "PDF Suite",
    icon: "📝",
    gradient: "from-indigo-500 to-purple-600",
    glow: "rgba(99,102,241,0.35)",
    badge: "Clean Layout",
    price: "₹0 / Free",
    desc: "Convert notes, essays, assignments and legal text into beautiful formatted A4 PDF files.",
    features: ["Custom Title & Author", "Auto Page Pagination", "Font Size & Family", "Instant A4 Download"],
    path: "/text-to-pdf",
  },
  {
    id: 24,
    name: "Visual PDF Editor",
    category: "PDF Suite",
    icon: "✏️",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.35)",
    badge: "👑 Pro Studio",
    price: "👑 Pro",
    desc: "Type text anywhere, whiteout typos, draw digital signatures, highlight and rotate pages.",
    features: ["Type Text Anywhere", "Magic Whiteout Eraser", "Draw Digital Signature", "Rotate & Delete Pages"],
    path: "/pdf-tools/edit",
  },
  {
    id: 25,
    name: "PDF Suite (Merge/Split/Compress)",
    category: "PDF Suite",
    icon: "📑",
    gradient: "from-rose-400 to-orange-400",
    glow: "rgba(251,146,60,0.35)",
    badge: "All-in-One",
    price: "₹0 / Free",
    desc: "Merge multiple PDFs, split pages, compress file size, and convert images to PDF.",
    features: ["Merge Multiple PDFs", "Extract / Split Pages", "Compress PDF File Size", "Image to PDF"],
    path: "/pdf-tools",
  },
  {
    id: 26,
    name: "ATS Resume Maker",
    category: "Resume & HR",
    icon: "💼",
    gradient: "from-blue-400 to-indigo-400",
    glow: "rgba(99,102,241,0.35)",
    badge: "👑 Pro ATS",
    price: "👑 Pro",
    desc: "Create ATS-friendly resumes with 5 clean professional corporate templates.",
    features: ["5 ATS Templates", "Live Sheet Preview", "Download Crisp PDF", "Auto Sample Fill"],
    path: "/resume-maker",
  },
  {
    id: 27,
    name: "ULTRON 3.0 AI Assistant",
    category: "AI Assistant",
    icon: "🤖",
    gradient: "from-purple-400 to-pink-400",
    glow: "rgba(217,70,239,0.35)",
    badge: "👑 Pro AI",
    price: "👑 Pro",
    desc: "Instant neural AI assistance for coding, document formatting, and tool guidance.",
    features: ["Neural Multilingual AI", "Smart Formatting Advice", "Instant Code Generation", "Embedded Tool Actions"],
    path: "/chatbot",
  },
];

const comingSoonTools = [
  { icon: "🔁", name: "Word to PDF", cat: "PDF Suite" },
  { icon: "🖼️", name: "PDF to JPG", cat: "PDF Suite" },
  { icon: "🔒", name: "PDF Locker (Password)", cat: "PDF Suite" },
  { icon: "📊", name: "PDF to Excel", cat: "PDF Suite" },
  { icon: "📈", name: "Excel to PDF", cat: "PDF Suite" },
  { icon: "📑", name: "PDF to PPT", cat: "PDF Suite" },
  { icon: "📊", name: "PPT to PDF", cat: "PDF Suite" },
  { icon: "🔢", name: "PDF Page Numberer", cat: "PDF Suite" },
  { icon: "😂", name: "Meme Generator", cat: "Image Tools" },
  { icon: "💧", name: "Image Watermark Stamp", cat: "Image Tools" },
  { icon: "✏️", name: "Grammar Checker", cat: "AI Assistant" },
  { icon: "🔎", name: "Plagiarism Checker", cat: "AI Assistant" },
  { icon: "📨", name: "Letter & Email Writer", cat: "Utilities" },
  { icon: "🔐", name: "File Encryptor (AES-256)", cat: "Utilities" },
  { icon: "📦", name: "File Compressor", cat: "Utilities" },
  { icon: "🔍", name: "Duplicate File Finder", cat: "Utilities" },
];

const navLinks = [
  { href: "#office", label: "🏢 Virtual Office" },
  { href: "#tools", label: "Tools (28+)" },
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
    const values = ["", "2.5K+", "4.9/5", "100% Client-Side"];
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
                Explore Tools (28+)
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
                Explore Tools (28+)
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
            CNC &amp; VMC Industrial Diagnostics, CA Taxes, IPC to BNS Legal Converter, resize exam photos, edit PDFs, convert formats, generate invoices, and get instant AI help —
            supervised live by our virtual office team. 100% private, no software install required.
          </p>
          <div ref={heroBtnsRef} className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="#office" className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px] shadow-lg shadow-blue-500/25">
              Enter Virtual Office 🏢
            </a>
            <a href="#tools" className="bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white px-6 sm:px-7 py-3 rounded-full font-medium transition-colors text-[14px] sm:text-[15px]">
              Explore 28+ Tools ↓
            </a>
          </div>
        </div>
      </section>

      {/* Virtual Office Floor */}
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
            <div ref={(el) => (statRefs.current[1] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">28+ Live</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Online Tools</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[2] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">4.9/5</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Average Rating</div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 sm:p-7">
            <div ref={(el) => (statRefs.current[3] = el)} className="text-xl sm:text-3xl font-semibold tracking-tight text-[#0071e3]">100% In-Browser</div>
            <div className="text-[11px] sm:text-[13px] text-[#6e6e73] dark:text-white/50 mt-1">Privacy First</div>
          </div>
        </div>
      </section>

      {/* 3D Laptop Showcase */}
      <section id="showcase" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">
          See ToolBox at work
        </h2>
        <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-8 sm:mb-12 max-w-xl mx-auto px-2">
          A live look at our smart tools running end to end — right inside your browser.
        </p>

        <div className="reveal-up w-full max-w-4xl mx-auto">
          <LaptopScene className="w-full" />
        </div>
      </section>

      {/* Available Tools Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Active Catalog ({tools.length} Tools)
          </span>
          <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mt-3 mb-3 sm:mb-4">
            Available Tools
          </h2>
          <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 max-w-2xl mx-auto px-2">
            Pick a tool and get started instantly — ultra fast, private, and 100% in-browser.
          </p>
        </div>

        {/* Categories */}
        <div className="reveal-up flex justify-center flex-wrap gap-2 max-w-5xl mx-auto mb-6">
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

        {/* Search */}
        <div className="reveal-up max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 28+ tools (e.g. CNC, Fanuc, CA Tax, GST, TDS, EMI, PDF, Word, QR, OCR...)"
              className="w-full px-5 py-3.5 pr-12 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#111113] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0071e3] shadow-sm"
            />
          </div>
        </div>

        {/* Grid Cards */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative bg-white dark:bg-[#111113] rounded-3xl border border-black/5 dark:border-white/10 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-5`} style={{ boxShadow: `0 8px 20px -4px ${tool.glow}` }}>
                  {tool.icon}
                </div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-[17px] font-bold tracking-tight">{tool.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${tool.badge.includes("NEW") ? "bg-amber-500 text-white shadow-sm" : tool.price.includes("Pro") ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-[#0071e3]/10 text-[#0071e3] dark:bg-white/10 dark:text-white"}`}>{tool.badge}</span>
                </div>
                <p className="text-[#6e6e73] dark:text-white/60 text-[13px] mb-4 leading-relaxed">{tool.desc}</p>
                <ul className="space-y-1.5 mb-5 flex-grow">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="text-[12px] text-[#6e6e73] dark:text-white/50 flex items-center gap-2">
                      <span className="text-[#30d158] font-bold">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/10">
                  <span className="text-[12px] font-bold text-[#6e6e73] dark:text-white/50">{tool.price}</span>
                  <Link href={tool.path} className="text-xs font-bold bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-98">Use Tool →</Link>
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

      {/* Upcoming Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="reveal-up text-[28px] sm:text-5xl font-semibold tracking-tight text-center mb-3 sm:mb-4">Upcoming in Next Release</h2>
        <p className="reveal-up text-center text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14 max-w-2xl mx-auto px-2">
          Our team is actively engineering these remaining tools. Stay tuned!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
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
          <p className="reveal-up text-[15px] sm:text-[17px] text-[#6e6e73] dark:text-white/60 mb-10 sm:mb-14">Free forever for essential daily tools. Upgrade to Pro for heavy utilities.</p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            <div className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left">
              <h3 className="text-[15px] font-semibold mb-2 text-[#6e6e73] dark:text-white/60">Free Plan</h3>
              <p className="text-4xl font-semibold tracking-tight mb-5">₹0</p>
              <ul className="space-y-2.5 text-[13px] text-[#1d1d1f]/80 dark:text-white/70 mb-7">
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Exam Photo &amp; Sign Resizer</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> Passport Size Photo Maker</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> GST, EMI, Age, BMI Calculators</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> PDF to Word &amp; Text to PDF</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> PDF Merge, Split &amp; Compress</li>
                <li className="flex items-center gap-2"><span className="text-[#30d158]">✓</span> No Ads, 100% In-Browser</li>
              </ul>
              <a href="#tools" className="block w-full bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white py-3 rounded-full font-bold hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors text-center text-xs">Start Free</a>
            </div>
            <div className="bg-[#0071e3] rounded-3xl p-7 sm:p-8 w-full sm:w-72 text-left relative text-white shadow-xl shadow-blue-500/20">
              <span className="absolute top-6 right-6 bg-white/20 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">ALL ACCESS</span>
              <h3 className="text-[15px] font-semibold mb-2 text-white/80">Pro Access Pass</h3>
              <p className="text-4xl font-black tracking-tight mb-1">₹99</p>
              <p className="text-[12px] text-white/70 mb-5">30-day all-inclusive pass</p>
              <ul className="space-y-2.5 text-[13px] text-white/90 mb-7">
                <li className="flex items-center gap-2"><span>✓</span> 💻 IT &amp; Developer Daily Office Suite (14-in-1)</li>
                <li className="flex items-center gap-2"><span>✓</span> ⚙️ CNC &amp; VMC Industrial Suite</li>
                <li className="flex items-center gap-2"><span>✓</span> 💎 CA &amp; Tax Master Suite</li>
                <li className="flex items-center gap-2"><span>✓</span> ⚖️ Advocate &amp; Legal Master Suite</li>
                <li className="flex items-center gap-2"><span>✓</span> AI HD Background Remover</li>
                <li className="flex items-center gap-2"><span>✓</span> GST Invoice &amp; Bill Generator</li>
                <li className="flex items-center gap-2"><span>✓</span> ATS Resume Builder (5 Themes)</li>
                <li className="flex items-center gap-2"><span>✓</span> ULTRON 3.0 AI Assistant</li>
              </ul>
              <Link href="/payment" className="block w-full bg-white text-[#0071e3] py-3 rounded-full font-black hover:bg-white/90 transition-colors text-center text-xs">Unlock Pro for ₹99</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Clean Founder & Signature Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] py-16 bg-[#fafafa] dark:bg-[#06070a] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Main Founder Signature Card */}
          <div className="relative rounded-3xl bg-white dark:bg-[#0c0e14] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-9 shadow-sm dark:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Sleek Minimalist Monogram */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md border border-white/20">
                  LK
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0e14] flex items-center justify-center text-[10px] text-white font-bold"
                  title="Verified Creator"
                >
                  ✓
                </span>
              </div>

              {/* Founder Details & Mission */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0071e3] dark:text-blue-400">
                    Designed &amp; Engineered by
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Lakhan Kashyap
                  </h3>
                  <span className="text-[11px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-0.5 rounded-full border border-black/5 dark:border-white/10">
                    Founder &amp; Chief Architect
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  Built with a clear vision: eliminating bloated software installs and shady websites by providing instant, private, client-side tools for engineers, accountants &amp; legal minds worldwide.
                </p>

                {/* 3 Clean Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    100% Client-Side Sandbox
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Zero Cloud Logging
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5">
                    🇮🇳 Made with Passion
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Bottom Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 29+ Tools Live &amp; Operational</span>
            </div>
            <p className="font-medium text-center sm:text-right">
              © {new Date().getFullYear()} ToolBox Platform • All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
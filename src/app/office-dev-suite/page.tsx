// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AuthGate from "@/components/AuthGate";
import ProGate from "@/components/ProGate";

// 🚀 Dedicated Modular Tool Components
import EnvDiffTool from "@/components/dev-suite/EnvDiffTool";
import JsonModelTool from "@/components/dev-suite/JsonModelTool";
import SvgReactTool from "@/components/dev-suite/SvgReactTool";
import CurlFetchTool from "@/components/dev-suite/CurlFetchTool";
import JwtInspectTool from "@/components/dev-suite/JwtInspectTool";
import TailwindPaletteTool from "@/components/dev-suite/TailwindPaletteTool";
import UrlParserTool from "@/components/dev-suite/UrlParserTool";
import CsvJsonTool from "@/components/dev-suite/CsvJsonTool";
import SqlStudioTool from "@/components/dev-suite/SqlStudioTool";
import MockDataTool from "@/components/dev-suite/MockDataTool";
import GitPrTool from "@/components/dev-suite/GitPrTool";
import TimestampTool from "@/components/dev-suite/TimestampTool";
import CronJobTool from "@/components/dev-suite/CronJobTool";
import RegexTestTool from "@/components/dev-suite/RegexTestTool";

/* ========================================================================== */
/*  14 MASTER DAILY OFFICE & DEV TOOLS DEFINITIONS                            */
/* ========================================================================== */

interface ToolMeta {
  id: string;
  name: string;
  cat: "Frontend & UI" | "Backend & API" | "Database & SQL" | "DevOps & Daily";
  icon: string;
  badge: string;
  desc: string;
  problemSolved: string;
}

const ALL_OFFICE_TOOLS: ToolMeta[] = [
  // 💻 Frontend & UI
  {
    id: "jsonmodel",
    name: "JSON ➔ TypeScript & C# Model",
    cat: "Frontend & UI",
    icon: "📦",
    badge: "TS & C# 9",
    desc: "Generate strict TypeScript interfaces, C# records, Zod schemas, and Go structs from raw API responses.",
    problemSolved: "Saves 2 hours of manual model typing and eliminates runtime type mismatch bugs.",
  },
  {
    id: "svgreact",
    name: "Figma SVG ➔ React JSX Optimizer",
    cat: "Frontend & UI",
    icon: "🎨",
    badge: "SVGO Clean",
    desc: "Converts messy Figma SVG export into a clean, prop-ready React icon component with live preview.",
    problemSolved: "Fixes JSX errors like class, stroke-width, fill-rule, and clip-path instantly.",
  },
  {
    id: "tailwind",
    name: "Tailwind 50-950 Palette & WCAG",
    cat: "Frontend & UI",
    icon: "🌈",
    badge: "Contrast WCAG",
    desc: "Generate complete 50-950 Tailwind color scales from a single hex code with live contrast scores.",
    problemSolved: "Instant accessible dark/light mode palette generation without designer wait time.",
  },
  {
    id: "csvjson",
    name: "Excel / CSV ➔ React State JSON",
    cat: "Frontend & UI",
    icon: "📊",
    badge: "Data Import",
    desc: "Paste spreadsheet data or CSV to instantly get clean, typed JSON array for mockups.",
    problemSolved: "Eliminates manually typing dummy client tables and table prototypes.",
  },

  // 📡 Backend & API
  {
    id: "curlfetch",
    name: "cURL ➔ Clean Fetch & Axios Code",
    cat: "Backend & API",
    icon: "📡",
    badge: "Async/Await",
    desc: "Transform terminal cURL commands into clean JavaScript fetch, Axios, or Python requests.",
    problemSolved: "No manual header, query string, or payload parsing from Postman or network tabs.",
  },
  {
    id: "jwtinspect",
    name: "JWT Token & Claims Inspector",
    cat: "Backend & API",
    icon: "🗝️",
    badge: "100% Private",
    desc: "Inspect Bearer token headers, claims, scopes, and live countdown expiry 100% offline.",
    problemSolved: "Zero risk of leaking sensitive staging or production credentials to cloud servers.",
  },
  {
    id: "envdiff",
    name: ".env Diff & Secret Leak Detector",
    cat: "Backend & API",
    icon: "🔐",
    badge: "Zero Crash",
    desc: "Compare local .env against .env.example, spot missing keys, and detect leaked secret tokens.",
    problemSolved: "Prevents fatal production server crashes caused by forgotten environment variables.",
  },
  {
    id: "urlparser",
    name: "URL & Query Param Inspector",
    cat: "Backend & API",
    icon: "🔗",
    badge: "Decode & Edit",
    desc: "Deconstruct encoded URLs, inspect UTM campaign tags, and edit query params in a clean table.",
    problemSolved: "Easy debugging of complex redirect URLs, OAuth callbacks, and analytics UTM parameters.",
  },

  // 🗄️ Database & SQL
  {
    id: "sqlstudio",
    name: "SQL Formatter & Table to C# Entity",
    cat: "Database & SQL",
    icon: "🗄️",
    badge: "SQL Server",
    desc: "Beautify complex SQL queries and auto-generate clean C# Entity or Dapper models from CREATE TABLE.",
    problemSolved: "Makes unreadable legacy SQL queries clean and eliminates manual ORM model drafting.",
  },
  {
    id: "mockdata",
    name: "Indian Mock & Dummy Data Generator",
    cat: "Database & SQL",
    icon: "🎲",
    badge: "Indian Presets",
    desc: "Generate realistic Indian names, phone numbers, emails, GSTIN, PAN, and city records.",
    problemSolved: "Realistic local seed data for testing Indian FinTech, E-Commerce, and SaaS demos.",
  },

  // 🚀 DevOps & Daily
  {
    id: "gitpr",
    name: "Conventional Git Commit & PR Writer",
    cat: "DevOps & Daily",
    icon: "🚀",
    badge: "Conventional",
    desc: "Format strict Conventional Commits (feat, fix, refactor) and generate GitHub/GitLab PR checklists.",
    problemSolved: "Speed up code reviews with clean, uniform commit messages and pull request descriptions.",
  },
  {
    id: "timestamp",
    name: "Unix Epoch & Global Timezones",
    cat: "DevOps & Daily",
    icon: "⏰",
    badge: "IST / EST / UTC",
    desc: "Convert Unix timestamps to Indian Standard Time (IST), US Eastern, UTC, and relative human time.",
    problemSolved: "Eliminates confusion between milliseconds vs seconds and cross-border server log timestamps.",
  },
  {
    id: "cronjob",
    name: "Cron Job Human Explainer & Schedule",
    cat: "DevOps & Daily",
    icon: "⏱️",
    badge: "Background Jobs",
    desc: "Translates complex 5-part cron syntax into plain English with next scheduled trigger times.",
    problemSolved: "Avoids disastrous production scheduler mistakes and cron syntax confusion.",
  },
  {
    id: "regextest",
    name: "Regex Pattern Tester & Form Helpers",
    cat: "DevOps & Daily",
    icon: "🔍",
    badge: "Regex Cheats",
    desc: "Tested regex patterns for Indian Mobile (+91), GSTIN, PAN, Email, and strong password checks.",
    problemSolved: "No more searching through 10 broken StackOverflow threads for validation patterns.",
  },
];

const CATEGORIES = ["All Tools", "Frontend & UI", "Backend & API", "Database & SQL", "DevOps & Daily"];

export default function OfficeDevSuitePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeToolId, setActiveToolId] = useState<string>("envdiff");
  const [showVsAiModal, setShowVsAiModal] = useState<boolean>(false);

  const filteredTools = useMemo(() => {
    return ALL_OFFICE_TOOLS.filter((t) => {
      const matchCat = selectedCategory === "All Tools" || t.cat === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.problemSolved.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [selectedCategory, searchQuery]);

  const currentToolMeta = useMemo(() => {
    return ALL_OFFICE_TOOLS.find((t) => t.id === activeToolId) || ALL_OFFICE_TOOLS[0];
  }, [activeToolId]);

  return (
    <AuthGate>
      <ProGate toolName="IT & Developer Daily Office Suite">
        <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#06070a] text-[#1d1d1f] dark:text-white font-sans antialiased selection:bg-[#0071e3] selection:text-white pb-16">
          {/* Apple-style Glass Navigation Bar */}
          <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#fbfbfd]/80 dark:bg-[#06070a]/80 border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href="/"
                  className="text-xs font-semibold text-[#6e6e73] hover:text-[#0071e3] dark:text-white/60 dark:hover:text-white transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>←</span> ToolBox
                </Link>
                <span className="text-black/10 dark:text-white/15">/</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">💻</span>
                  <h1 className="text-[15px] font-bold tracking-tight text-[#1d1d1f] dark:text-white truncate">
                    IT &amp; Dev Studio
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] bg-[#0071e3]/10 text-[#0071e3] dark:bg-blue-950/60 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
                    14 Tools
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full hidden md:inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  100% Client-Side Private
                </span>
                <Link
                  href="/account"
                  className="text-xs bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white font-semibold px-3.5 py-1.5 rounded-full transition-colors border border-black/[0.04] dark:border-white/[0.08]"
                >
                  My Account
                </Link>
              </div>
            </div>
          </nav>

          {/* Subheader: Category Navigation & Quick Search */}
          <div className="border-b border-black/[0.05] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-[#0071e3] text-white shadow-sm shadow-blue-500/25"
                        : "bg-[#f5f5f7] dark:bg-white/5 text-[#6e6e73] dark:text-white/60 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#e8e8ed] dark:hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-64 relative">
                <input
                  type="text"
                  placeholder="Search tools (e.g. env, svg, json)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-[#1d1d1f] dark:text-white placeholder-[#6e6e73] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
                />
              </div>
            </div>
          </div>

          {/* Trust Banner: Why Devs Choose ToolBox Over Plain AI */}
          <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border-b border-black/[0.04] dark:border-white/[0.06] px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-[#1d1d1f]/80 dark:text-white/80">
                <span className="bg-[#0071e3] text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  ⚡ 10x vs AI
                </span>
                <span className="font-bold">Why Devs Choose This:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ 100% In-Browser (0 Leaks)</span>
                <span className="text-black/20 dark:text-white/20 hidden md:inline">•</span>
                <span className="text-[#0071e3] dark:text-blue-300 font-medium">✓ 0.01s Instant</span>
                <span className="text-black/20 dark:text-white/20 hidden md:inline">•</span>
                <span className="text-purple-600 dark:text-purple-300 font-medium">✓ Zero Hallucinations</span>
              </div>

              <button
                onClick={() => setShowVsAiModal(true)}
                className="text-[11px] font-bold text-[#0071e3] dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer"
              >
                Detailed Comparison vs AI →
              </button>
            </div>
          </div>

          {/* Comparison Modal */}
          {showVsAiModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                  <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white">
                    ToolBox Studio vs ChatGPT / Claude
                  </h3>
                  <button
                    onClick={() => setShowVsAiModal(false)}
                    className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-white/10 text-[#6e6e73] hover:text-[#1d1d1f] dark:text-white/60 dark:hover:text-white flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5f5f7] dark:bg-white/5 text-[#6e6e73] dark:text-white/60 border-b border-black/5 dark:border-white/10">
                      <tr>
                        <th className="p-2.5">Feature</th>
                        <th className="p-2.5 text-rose-500">ChatGPT / Claude</th>
                        <th className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">ToolBox Suite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#1d1d1f] dark:text-white/80">
                      <tr>
                        <td className="p-2.5 font-semibold">Data Privacy</td>
                        <td className="p-2.5 text-rose-500">Sent to AI Cloud servers</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Client-Side Sandbox</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Speed</td>
                        <td className="p-2.5 text-[#6e6e73]">10-15s prompt waiting</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">0.01s Instant Output</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Accuracy</td>
                        <td className="p-2.5 text-[#6e6e73]">Occasional syntax hallucination</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">Deterministic Mathematical AST</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => setShowVsAiModal(false)}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                >
                  Close &amp; Continue Coding
                </button>
              </div>
            </div>
          )}

          {/* Main Studio Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar Tools List */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e6e73] dark:text-white/40">
                  Select Utility ({filteredTools.length})
                </span>
                <span className="text-[11px] text-[#0071e3] font-semibold">v1.0 Pro</span>
              </div>

              {/* Scrollable Tool Cards List */}
              <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {filteredTools.map((tool) => {
                  const isActive = activeToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveToolId(tool.id);
                        if (window.innerWidth < 1024) {
                          document.getElementById("studio-canvas")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                        isActive
                          ? "bg-white dark:bg-[#11131a] border-[#0071e3] shadow-md shadow-blue-500/10 ring-1 ring-[#0071e3]"
                          : "bg-white/60 dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.05] hover:border-black/10"
                      }`}
                    >
                      <span className="text-2xl pt-0.5">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4
                            className={`text-xs font-bold truncate ${
                              isActive ? "text-[#0071e3] dark:text-white" : "text-[#1d1d1f] dark:text-white/80"
                            }`}
                          >
                            {tool.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#6e6e73] dark:text-white/50 line-clamp-1 leading-snug">
                          {tool.desc}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[9px] bg-[#f5f5f7] dark:bg-white/10 text-[#6e6e73] dark:text-white/60 px-2 py-0.5 rounded-full font-medium">
                            {tool.cat}
                          </span>
                          <span className="text-[9px] bg-[#0071e3]/10 text-[#0071e3] dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                            {tool.badge}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Studio Canvas */}
            <main
              id="studio-canvas"
              className="lg:col-span-8 xl:col-span-9 bg-white dark:bg-[#0c0d12] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-2xl flex flex-col"
            >
              {/* Active Tool Header */}
              <div className="pb-5 mb-6 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-2xl shrink-0">
                    {currentToolMeta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                        {currentToolMeta.name}
                      </h2>
                      <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] font-bold px-2.5 py-0.5 rounded-full">
                        {currentToolMeta.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6e6e73] dark:text-white/60 mt-0.5">{currentToolMeta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white px-3 py-1 rounded-full font-medium">
                    🛡️ {currentToolMeta.problemSolved}
                  </span>
                </div>
              </div>

              {/* ACTIVE TOOL VIEW SWITCHER (ALL 14 MODULAR TOOLS) */}
              <div className="flex-1">
                {activeToolId === "envdiff" && <EnvDiffTool />}
                {activeToolId === "jsonmodel" && <JsonModelTool />}
                {activeToolId === "svgreact" && <SvgReactTool />}
                {activeToolId === "curlfetch" && <CurlFetchTool />}
                {activeToolId === "jwtinspect" && <JwtInspectTool />}
                {activeToolId === "tailwind" && <TailwindPaletteTool />}
                {activeToolId === "urlparser" && <UrlParserTool />}
                {activeToolId === "csvjson" && <CsvJsonTool />}
                {activeToolId === "sqlstudio" && <SqlStudioTool />}
                {activeToolId === "mockdata" && <MockDataTool />}
                {activeToolId === "gitpr" && <GitPrTool />}
                {activeToolId === "timestamp" && <TimestampTool />}
                {activeToolId === "cronjob" && <CronJobTool />}
                {activeToolId === "regextest" && <RegexTestTool />}
              </div>
            </main>
          </div>
        </div>
      </ProGate>
    </AuthGate>
  );
}

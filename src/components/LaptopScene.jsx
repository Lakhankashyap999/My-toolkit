// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

/* ========================================================================== */
/*  EXACT SUPABASE-STYLE LIVE ANIMATED TOOL ENGINE & OFFICE SHOWCASE          */
/* ========================================================================== */

const SHOWCASE_TABS = [
  { id: "office", label: "🏢 Virtual Office", icon: "👑" },
  { id: "pdf", label: "PDF Editor & Merger", icon: "📄" },
  { id: "compressor", label: "Image Compressor", icon: "🖼️" },
  { id: "resume", label: "ATS Resume Builder", icon: "📝" },
  { id: "qr", label: "QR Code Generator", icon: "🔳" },
];

export default function LaptopScene({ className = "" }) {
  const [activeTab, setActiveTab] = useState("office");
  
  // Simulation Ticker State (Step 0 to 5)
  const [step, setStep] = useState(0);
  const [typedName, setTypedName] = useState("");
  const [typedTitle, setTypedTitle] = useState("");

  // Auto Step Progression Engine
  useEffect(() => {
    setStep(0);
    setTypedName("");
    setTypedTitle("");

    const interval = setInterval(() => {
      setStep((prevStep) => {
        if (prevStep >= 5) return 5;
        return prevStep + 1;
      });
    }, 1150);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Typing animation simulation for Resume tool
  useEffect(() => {
    if (activeTab === "resume") {
      const fullText = "Lakhan Kashyap";
      const fullTitle = "Senior Full Stack Engineer";
      
      let nameIdx = 0;
      let titleIdx = 0;

      const typingTimer = setInterval(() => {
        if (nameIdx <= fullText.length) {
          setTypedName(fullText.slice(0, nameIdx));
          nameIdx++;
        } else if (titleIdx <= fullTitle.length) {
          setTypedTitle(fullTitle.slice(0, titleIdx));
          titleIdx++;
        }
      }, 55);

      return () => clearInterval(typingTimer);
    }
  }, [activeTab]);

  // Auto Scene Rotation after completing execution
  useEffect(() => {
    const sceneRotationTimer = setInterval(() => {
      setActiveTab((curr) => {
        const ids = SHOWCASE_TABS.map((t) => t.id);
        const nextIdx = (ids.indexOf(curr) + 1) % ids.length;
        return ids[nextIdx];
      });
    }, 7500);

    return () => clearInterval(sceneRotationTimer);
  }, []);

  /* ──────────────────────────────────────────────────────────────────────────
     PERFECTLY CALIBRATED UI ELEMENT TARGET COORDINATES (Tip Anchored at 0,0)
  ─────────────────────────────────────────────────────────────────────────── */
  const getCursorPos = () => {
    if (activeTab === "office") {
      switch (step) {
        case 0: return { x: 18, y: 35, label: "HR Cabin" }; 
        case 1: return { x: 74, y: 36, label: "RELAX Desk" }; 
        case 2: return { x: 74, y: 36, clicking: true, label: "Click Assign" }; 
        case 3: return { x: 26, y: 44, label: "Briefing" }; 
        case 4: return { x: 86, y: 8, clicking: true, label: "Run Live" }; 
        case 5: return { x: 50, y: 88, label: "Downloaded" };
        default: return { x: 50, y: 50 };
      }
    }
    if (activeTab === "pdf") {
      switch (step) {
        case 0: return { x: 45, y: 30, label: "File 1" };
        case 1: return { x: 45, y: 46, clicking: true, label: "Select File 2" };
        case 2: return { x: 45, y: 62, clicking: true, label: "Select File 3" };
        case 3: return { x: 86, y: 8, label: "Merge CTA" };
        case 4: return { x: 86, y: 8, clicking: true, label: "Click Merge" };
        case 5: return { x: 50, y: 88, label: "Done" };
        default: return { x: 50, y: 50 };
      }
    }
    if (activeTab === "compressor") {
      switch (step) {
        case 0: return { x: 40, y: 32, label: "Banner Image" };
        case 1: return { x: 40, y: 48, clicking: true, label: "Optimize 1" };
        case 2: return { x: 40, y: 64, clicking: true, label: "Optimize 2" };
        case 3: return { x: 86, y: 8, label: "Compress" };
        case 4: return { x: 86, y: 8, clicking: true, label: "Executing" };
        case 5: return { x: 50, y: 88, label: "Saved Space" };
        default: return { x: 50, y: 50 };
      }
    }
    if (activeTab === "resume") {
      switch (step) {
        case 0: return { x: 24, y: 34, label: "Name Input" };
        case 1: return { x: 24, y: 34, clicking: true, label: "Typing Name" };
        case 2: return { x: 24, y: 52, clicking: true, label: "Typing Title" };
        case 3: return { x: 70, y: 38, label: "Live Sheet" };
        case 4: return { x: 86, y: 8, clicking: true, label: "Export PDF" };
        case 5: return { x: 50, y: 88, label: "Resume Ready" };
        default: return { x: 50, y: 50 };
      }
    }
    if (activeTab === "qr") {
      switch (step) {
        case 0: return { x: 30, y: 40, label: "URL Input" };
        case 1: return { x: 30, y: 40, clicking: true, label: "Focus URL" };
        case 2: return { x: 80, y: 42, label: "Vector QR" };
        case 3: return { x: 86, y: 8, label: "Export" };
        case 4: return { x: 86, y: 8, clicking: true, label: "Generating" };
        case 5: return { x: 50, y: 88, label: "Downloaded" };
        default: return { x: 50, y: 50 };
      }
    }
    return { x: 50, y: 50 };
  };

  const cursor = getCursorPos();

  return (
    <div className={`w-full flex flex-col items-center gap-4 sm:gap-6 px-1 sm:px-4 ${className}`}>
      
      {/* ── TOP FEATURE PILL TABS (Mobile Scrollable) ─────────────────── */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 gap-2 sm:gap-3">
        {SHOWCASE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shrink-0 border ${
                isActive
                  ? "bg-[#0071e3] text-white border-transparent shadow-lg shadow-blue-500/25 scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── MAC WINDOW FRAME (Mobile Responsive) ──────────────────────── */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0b0f17] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all">
        
        {/* MAC TITLEBAR */}
        <div className="h-9 sm:h-10 bg-slate-100 dark:bg-[#080c14] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
          </div>

          <div className="text-[10px] sm:text-xs font-semibold text-slate-500 font-mono flex items-center gap-1">
            <span className="text-emerald-500 animate-pulse">●</span> 
            <span className="truncate max-w-[150px] sm:max-w-none">Live Tool Simulation</span>
          </div>

          <div className="text-[10px] sm:text-xs font-bold text-[#0071e3] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            Step {step + 1}/6
          </div>
        </div>

        {/* APP MAIN BODY */}
        <div className="flex min-h-[420px] sm:min-h-[480px] text-slate-800 dark:text-slate-100 relative overflow-hidden">
          
          {/* LEFT ICON SIDEBAR (Responsive) */}
          <div className="w-11 sm:w-14 bg-slate-50 dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800 p-2 flex flex-col items-center justify-between shrink-0 select-none">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#0071e3] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-md">
                🛠️
              </div>
              <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-800 mx-auto" />
              
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { icon: "🏢", id: "office" },
                  { icon: "📄", id: "pdf" },
                  { icon: "🖼️", id: "compressor" },
                  { icon: "📝", id: "resume" },
                  { icon: "🔳", id: "qr" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm transition ${
                      activeTab === item.id
                        ? "bg-[#0071e3] text-white font-bold shadow-md"
                        : "text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-black flex items-center justify-center text-[10px] sm:text-xs">
              LK
            </div>
          </div>

          {/* SUB-NAVIGATION SCHEMA (Hidden on Mobile) */}
          <div className="w-48 bg-slate-50/50 dark:bg-[#0b0f18] border-r border-slate-200 dark:border-slate-800 p-3 hidden md:flex flex-col justify-between shrink-0 select-none">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Execution Pipeline
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 mb-3 shadow-sm">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeTab === "office" && "Virtual Office Hub"}
                  {activeTab === "pdf" && "PDF Engine v2.4"}
                  {activeTab === "compressor" && "WebP Compression"}
                  {activeTab === "resume" && "ATS Parser Active"}
                  {activeTab === "qr" && "Vector Generator"}
                </div>
                <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 100% In-Browser
                </div>
              </div>

              <div className="space-y-1 text-xs font-medium">
                <div className={`p-1.5 rounded-lg transition ${step >= 1 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  1. Initialize Task
                </div>
                <div className={`p-1.5 rounded-lg transition ${step >= 2 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  2. Employee Dispatch
                </div>
                <div className={`p-1.5 rounded-lg transition ${step >= 4 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  3. Instant Output
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
              ⚡ WebAssembly Engine
            </div>
          </div>

          {/* MAIN DYNAMIC SIMULATION WORKSPACE */}
          <div className="flex-1 bg-white dark:bg-[#0d121d] p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* TOOL HEADER */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>
                      {activeTab === "office" && "🏢 Busy Office Dispatch Simulation"}
                      {activeTab === "pdf" && "📄 PDF Editor & Merger"}
                      {activeTab === "compressor" && "🖼️ Smart Image Compressor"}
                      {activeTab === "resume" && "📝 ATS Resume Builder"}
                      {activeTab === "qr" && "🔳 Vector QR Generator"}
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Live client-side execution simulation
                  </p>
                </div>

                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    step >= 4
                      ? "bg-emerald-600 text-white scale-105 shadow-md shadow-emerald-500/20"
                      : "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                  }`}
                >
                  {step >= 4 ? "✓ Completed" : "⚡ Run Live"}
                </button>
              </div>

              {/* ── TAB 1: MINI VIRTUAL OFFICE CLIP SIMULATION ──────────── */}
              {activeTab === "office" && (
                <div className="w-full bg-[#080c14] border border-slate-800 rounded-xl p-2 sm:p-3 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-sky-400 font-bold mb-2 pb-1 border-b border-slate-800">
                    <span>👑 HR Lakhan Cabin: Task Active</span>
                    <span className="text-emerald-400">● 8 Employees Online</span>
                  </div>

                  <svg viewBox="0 0 500 210" className="w-full h-auto rounded-lg bg-[#0c1117]">
                    <rect x="10" y="20" width="480" height="180" fill="#d5c9a8" />
                    
                    {/* HR Cabin */}
                    <rect x="15" y="25" width="110" height="90" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
                    <text x="22" y="38" fill="#f59e0b" fontSize="7" fontWeight="bold">👑 HR LAKHAN</text>
                    <rect x="35" y="60" width="60" height="30" rx="2" fill="#92400e" />
                    <circle cx="65" cy="55" r="7" fill="#fcd34d" />
                    <rect x="59" y="62" width="12" height="10" fill="#0f172a" rx="2"/>
                    <text x="61" y="50" fontSize="8">👑</text>

                    {/* Desks Grid */}
                    {[
                      { name: "NO18", x: 160, y: 40, col: "#2563eb" },
                      { name: "AURA", x: 270, y: 40, col: "#db2777" },
                      { name: "RELAX", x: 380, y: 40, col: "#059669" },
                      { name: "CHRIS", x: 160, y: 130, col: "#d97706" },
                      { name: "MELBY", x: 270, y: 130, col: "#7c3aed" },
                      { name: "TONY", x: 380, y: 130, col: "#4f46e5" },
                    ].map((d, di) => (
                      <g key={di} transform={`translate(${d.x},${d.y})`}>
                        <rect x="-30" y="0" width="60" height="28" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1"/>
                        <rect x="-14" y="-18" width="28" height="20" rx="2" fill="#052e16" stroke="#16a34a" strokeWidth="1"/>
                        <circle cx="0" cy="18" r="6" fill="#fcd34d"/>
                        <rect x="-5" y="24" width="10" height="8" rx="2" fill={d.col}/>
                        <rect x="-24" y="32" width="48" height="11" rx="2" fill="#0f172a"/>
                        <text x="0" y="40" fill={d.col} fontSize="6" fontWeight="bold" textAnchor="middle">{d.name}</text>
                      </g>
                    ))}

                    {/* Animated Walking Dispatch Employee */}
                    {step >= 2 && step <= 4 && (
                      <g transform={`translate(${step === 2 ? 380 : step === 3 ? 140 : 80}, ${step === 2 ? 80 : 75})`}>
                        <circle cx="0" cy="-6" r="6" fill="#fcd34d" />
                        <rect x="-5" y="0" width="10" height="8" rx="2" fill="#059669" />
                        <text x="0" y="-12" fontSize="7" textAnchor="middle">🏃💨</text>
                      </g>
                    )}
                  </svg>
                </div>
              )}

              {/* ── TAB 2: PDF SIMULATION ─────────────────────────────── */}
              {activeTab === "pdf" && (
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400">PDF Files Queue</div>
                  {[
                    { name: "Financial_Report_2026.pdf", pages: "18 Pgs", size: "3.4 MB", target: 1 },
                    { name: "Vendor_Agreement.pdf", pages: "4 Pgs", size: "1.2 MB", target: 2 },
                    { name: "Project_Proposal.pdf", pages: "12 Pgs", size: "4.8 MB", target: 3 },
                  ].map((file, idx) => {
                    const isLoaded = step >= file.target;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                          isLoaded
                            ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            : "opacity-40 border-dashed"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold truncate max-w-[140px] sm:max-w-none">
                          <span>📄</span>
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="font-bold text-slate-500">{file.size}</span>
                          <div className="w-14 sm:w-20 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full bg-emerald-500 transition-all duration-500 ${isLoaded ? "w-full" : "w-0"}`} />
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isLoaded ? "bg-emerald-500/15 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                            {isLoaded ? "Ready" : "Wait"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── TAB 3: IMAGE COMPRESSOR ───────────────────────────── */}
              {activeTab === "compressor" && (
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400">Optimization Stream</div>
                  {[
                    { name: "banner_4k_desktop.png", orig: "4.8 MB", comp: "960 KB", save: "-80%", target: 1 },
                    { name: "product_mockup.jpg", orig: "2.4 MB", comp: "420 KB", save: "-82%", target: 2 },
                    { name: "portfolio_raw.png", orig: "3.6 MB", comp: "710 KB", save: "-80%", target: 3 },
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 font-semibold truncate max-w-[140px] sm:max-w-none">
                        <span>🖼️</span>
                        <span className="truncate">{img.name}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-slate-400 line-through text-[10px]">{img.orig}</span>
                        <span className="font-black text-emerald-500">{img.comp}</span>
                        <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded">
                          {step >= img.target ? img.save : "..."}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 4: RESUME BUILDER ─────────────────────────────── */}
              {activeTab === "resume" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Editor Input</div>
                    <div>
                      <div className="text-[10px] text-slate-400">Name</div>
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded border text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{typedName || "Typing..."}</span>
                        <span className="w-1.5 h-3.5 bg-[#0071e3] animate-pulse inline-block" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Title</div>
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded border text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {typedTitle || "Typing..."}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white text-slate-900 p-3 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-sm font-black tracking-tight">{typedName || "Lakhan Kashyap"}</div>
                    <div className="text-[11px] font-bold text-[#0071e3] mb-2">{typedTitle || "Full Stack Engineer"}</div>
                    <div className="border-t pt-1.5 text-[9px] text-slate-600">
                      <div className="font-bold text-slate-900">SKILLS</div>
                      <div>React • Next.js • Tailwind • TypeScript</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 5: QR GENERATOR ──────────────────────────────── */}
              {activeTab === "qr" && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-3">
                  <div className="text-center sm:text-left">
                    <div className="text-[10px] font-bold text-slate-400">Target URL</div>
                    <div className="text-xs font-black text-slate-800 dark:text-white font-mono break-all">
                      https://toolify.app/lakhan-kashyap
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">✓ Vector HD 2048x2048 Ready</div>
                  </div>
                  <div className="w-20 h-20 bg-white p-1.5 rounded-xl shadow border flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center text-white text-xl">
                      🔳
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── HIGH VISIBILITY AUTHENTIC MAC OS CURSOR WITH TIP HOTSPOT ── */}
            <div
              className={`absolute pointer-events-none transition-all duration-600 ease-out z-40 ${cursor.clicking ? "scale-90" : "scale-100"}`}
              style={{
                top: `${cursor.y}%`,
                left: `${cursor.x}%`,
                transform: "translate(-2px, -2px)",
              }}
            >
              {/* Pulsing Ripple Circle on Click */}
              {cursor.clicking && (
                <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-2 border-sky-400 bg-sky-400/20 animate-ping pointer-events-none" />
              )}
              
              {/* Clean Classic Mouse Pointer SVG */}
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl filter">
                <path
                  d="M2 2L9.5 24L13.8 15.2L22.6 13.8L2 2Z"
                  fill="#0f172a"
                  stroke="#0f172a"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 4.2L9.6 20.8L13.2 13.6L20.4 12.4L3.5 4.2Z"
                  fill="#0071e3"
                />
                <path
                  d="M5 6L8.5 15L11 10.5L15.5 9.5L5 6Z"
                  fill="#60a5fa"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* ── BOTTOM SUCCESS NOTIFICATION TOAST ───────────────────── */}
            {step >= 4 && (
              <div className="mt-3 bg-[#1d1d1f] text-white rounded-xl p-2.5 border border-[#0071e3] shadow-xl flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-1.5 font-semibold text-[11px] truncate">
                  <span className="text-emerald-400">⚡</span>
                  <span className="truncate">
                    {activeTab === "office" && "Dispatched employee to HR Lakhan Cabin!"}
                    {activeTab === "pdf" && "Merged 3 PDF files into combined document!"}
                    {activeTab === "compressor" && "Optimized 3 images • Saved 81% space!"}
                    {activeTab === "resume" && "Generated ATS Resume: Lakhan_Kashyap.pdf"}
                    {activeTab === "qr" && "Exported HD Vector QR Code!"}
                  </span>
                </div>
                <span className="text-[9px] font-bold bg-[#0071e3] text-white px-2 py-0.5 rounded shrink-0 ml-2">
                  Success
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

/* ========================================================================== */
/*  EXACT SUPABASE-STYLE LIVE ANIMATED TOOL ENGINE SHOWCASE                    */
/* ========================================================================== */

const SHOWCASE_TABS = [
  { id: "pdf", label: "PDF Editor & Merger", icon: "📄" },
  { id: "compressor", label: "Image Compressor", icon: "🖼️" },
  { id: "resume", label: "ATS Resume Builder", icon: "📝" },
  { id: "qr", label: "QR Code Generator", icon: "🔳" },
];

export default function LaptopScene({ className = "" }) {
  const [activeTab, setActiveTab] = useState("pdf");
  
  // Simulation Ticker State (Step 0 to 5)
  const [step, setStep] = useState(0);
  const [typedName, setTypedName] = useState("");
  const [typedTitle, setTypedTitle] = useState("");

  // Auto Step Progression Engine (Runs active tool live simulation)
  useEffect(() => {
    setStep(0);
    setTypedName("");
    setTypedTitle("");

    const interval = setInterval(() => {
      setStep((prevStep) => {
        if (prevStep >= 5) {
          return 5; // Stay at finished state briefly before scene auto-rotates
        }
        return prevStep + 1;
      });
    }, 1200);

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
      }, 70);

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

  /* Helper cursor position calculation based on animation step */
  const getCursorPos = () => {
    switch (step) {
      case 0: return { x: 75, y: 25 }; // Hovering near top button
      case 1: return { x: 40, y: 45 }; // Selecting row 1
      case 2: return { x: 45, y: 65 }; // Selecting row 2
      case 3: return { x: 82, y: 22 }; // Moving to Action CTA button
      case 4: return { x: 82, y: 22, clicking: true }; // Clicking action button
      case 5: return { x: 50, y: 88 }; // Hovering success toast
      default: return { x: 50, y: 50 };
    }
  };

  const cursor = getCursorPos();

  return (
    <div className={`w-full flex flex-col items-center gap-5 ${className}`}>
      
      {/* ── TOP FEATURE PILL TABS ───────────────────────────────────────── */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
        {SHOWCASE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border ${
                isActive
                  ? "bg-[#0071e3] text-white border-transparent shadow-lg shadow-blue-500/25 scale-105"
                  : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── SUPABASE LIGHT-MODE APP WINDOW MOCKUP FRAME ───────────────────── */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0d121d] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all">
        
        {/* MAC TITLEBAR */}
        <div className="h-10 bg-slate-100/90 dark:bg-[#080c14] border-b border-slate-200/80 dark:border-slate-800 px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          <div className="text-[11px] font-semibold text-slate-500 font-mono tracking-tight flex items-center gap-1.5">
            <span className="text-emerald-500">●</span> Live Tool Engine Execution
          </div>

          <div className="text-[11px] font-bold text-[#0071e3] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            Step {step + 1} of 6
          </div>
        </div>

        {/* APP MAIN BODY */}
        <div className="flex min-h-[460px] sm:min-h-[500px] text-slate-800 dark:text-slate-100 overflow-hidden relative">
          
          {/* LEFT ICON SIDEBAR */}
          <div className="w-14 bg-slate-50 dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800 p-2.5 flex flex-col items-center justify-between shrink-0 select-none">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#0071e3] text-white font-bold flex items-center justify-center text-sm shadow-md">
                🛠️
              </div>
              <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800 mx-auto" />
              
              <div className="space-y-2">
                {[
                  { icon: "📄", id: "pdf" },
                  { icon: "🖼️", id: "compressor" },
                  { icon: "📝", id: "resume" },
                  { icon: "🔳", id: "qr" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition ${
                      activeTab === item.id
                        ? "bg-[#0071e3] text-white font-bold shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-bold flex items-center justify-center text-xs">
              LK
            </div>
          </div>

          {/* SUB-NAVIGATION SCHEMA PANEL */}
          <div className="w-48 sm:w-56 bg-slate-50/50 dark:bg-[#0b0f18] border-r border-slate-200 dark:border-slate-800 p-3.5 hidden sm:flex flex-col justify-between shrink-0 select-none">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tool Status
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 mb-4 shadow-sm">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                  {activeTab === "pdf" && "PDF Engine v2.4"}
                  {activeTab === "compressor" && "WebP Compression"}
                  {activeTab === "resume" && "ATS Parser Active"}
                  {activeTab === "qr" && "Vector Generator"}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Memory Mode: Active
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-medium">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Live Pipeline</div>
                <div className={`p-2 rounded-lg transition ${step >= 1 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  1. Load Document Files
                </div>
                <div className={`p-2 rounded-lg transition ${step >= 2 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  2. Process In Browser
                </div>
                <div className={`p-2 rounded-lg transition ${step >= 4 ? "bg-blue-50 dark:bg-blue-950/40 text-[#0071e3] font-bold" : "text-slate-400"}`}>
                  3. Export HD Output
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
              ⚡ WebAssembly Powered
            </div>
          </div>

          {/* MAIN DYNAMIC ANIMATED WORKSPACE */}
          <div className="flex-1 bg-white dark:bg-[#0d121d] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* TOOL HEADER & ACTION BUTTON */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>
                      {activeTab === "pdf" && "📄 PDF Editor & Merger"}
                      {activeTab === "compressor" && "🖼️ Smart Image Compressor"}
                      {activeTab === "resume" && "📝 ATS Resume Builder"}
                      {activeTab === "qr" && "🔳 Vector QR Code Generator"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live browser execution • Zero server logs
                  </p>
                </div>

                {/* Animated Primary Button */}
                <button
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    step >= 4
                      ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/25"
                      : "bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-blue-500/20"
                  }`}
                >
                  {step >= 4 ? "✓ Completed!" : "⚡ Start Execution"}
                </button>
              </div>

              {/* ── TOOL SPECIFIC LIVE STEP-BY-STEP SIMULATION ──────────── */}
              {activeTab === "pdf" && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400">PDF Files Queue</div>
                  
                  {[
                    { name: "Q4_Financial_Report_2026.pdf", pages: "18 Pages", size: "3.4 MB", targetStep: 1 },
                    { name: "Signed_Vendor_Agreement.pdf", pages: "4 Pages", size: "1.2 MB", targetStep: 2 },
                    { name: "Project_Proposal_Draft.pdf", pages: "12 Pages", size: "4.8 MB", targetStep: 3 },
                  ].map((file, idx) => {
                    const isLoaded = step >= file.targetStep;
                    const isProcessing = step === file.targetStep;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between text-xs ${
                          isLoaded
                            ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            : "bg-slate-50/40 opacity-40 border-dashed border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-100">
                          <span className="text-base">📄</span>
                          <span>{file.name}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-slate-400">{file.pages}</span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">{file.size}</span>
                          
                          {/* Live Progress Bar Indicator */}
                          <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${isLoaded ? "bg-emerald-500 w-full" : isProcessing ? "bg-[#0071e3] w-1/2" : "w-0"}`}
                            />
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLoaded ? "bg-emerald-500/15 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                            {isLoaded ? "Ready" : "Waiting"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "compressor" && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400">Compression Results</div>
                  
                  {[
                    { name: "hero_banner_4k_desktop.png", orig: "4.8 MB", comp: "960 KB", save: "-80%", targetStep: 1 },
                    { name: "product_mockup_highres.jpg", orig: "2.4 MB", comp: "420 KB", save: "-82.5%", targetStep: 2 },
                    { name: "portfolio_shot_raw.png", orig: "3.6 MB", comp: "710 KB", save: "-80.3%", targetStep: 3 },
                  ].map((img, idx) => {
                    const isDone = step >= img.targetStep;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 font-semibold">
                          <span className="text-base">🖼️</span>
                          <span className="text-slate-800 dark:text-white">{img.name}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 line-through">{img.orig}</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{img.comp}</span>
                          <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-600 px-2 py-0.5 rounded-md">
                            {isDone ? img.save : "Calculating..."}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "resume" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Live Typing Input Form */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Live Editor Input</div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Full Name</div>
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{typedName || "Typing..."}</span>
                        <span className="w-1.5 h-4 bg-[#0071e3] animate-pulse inline-block" />
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Job Title</div>
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {typedTitle || "Typing..."}
                      </div>
                    </div>
                  </div>

                  {/* Live Rendered Resume Sheet */}
                  <div className="bg-white text-slate-900 p-4 rounded-xl shadow-md border border-slate-200">
                    <div className="text-lg font-black tracking-tight">{typedName || "Lakhan Kashyap"}</div>
                    <div className="text-xs font-bold text-[#0071e3] mb-3">{typedTitle || "Full Stack Engineer"}</div>
                    <div className="border-t pt-2 text-[10px] text-slate-600">
                      <div className="font-bold text-slate-900">TECHNICAL SKILLS</div>
                      <div>React • Next.js • TypeScript • Tailwind CSS</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "qr" && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1">Target URL Input</div>
                    <div className="text-sm font-black text-slate-800 dark:text-white font-mono">
                      https://toolbox.app/lakhan-kashyap
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-2">✓ Vector HD 2048x2048 Ready</div>
                  </div>

                  <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-md flex items-center justify-center border">
                    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-2xl font-black">
                      🔳
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── ANIMATED CURSOR SIMULATION (SUPABASE STYLE) ───────────── */}
            <div
              className={`absolute pointer-events-none transition-all duration-700 ease-out z-30 ${cursor.clicking ? "scale-90" : "scale-100"}`}
              style={{
                top: `${cursor.y}%`,
                left: `${cursor.x}%`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.63604 3.46447L18.364 16.1924L11.9999 15.4853L8.46447 20.5355L6.34315 18.4142L9.87868 13.364L3.51462 12.6569L5.63604 3.46447Z"
                  fill="#0071e3"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* ── BOTTOM SUCCESS TOAST POPUP ───────────────────────────── */}
            {step >= 4 && (
              <div className="mt-4 bg-[#1d1d1f] text-white rounded-xl p-3 border border-[#0071e3] shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-emerald-400 text-sm">🎉</span>
                  <span>
                    {activeTab === "pdf" && "Merged 3 PDF files into ToolBox_Combined.pdf!"}
                    {activeTab === "compressor" && "Compressed 3 images • Saved 9.8 MB space!"}
                    {activeTab === "resume" && "Generated ATS Resume → Lakhan_Kashyap_Resume.pdf"}
                    {activeTab === "qr" && "Exported HD Vector QR Code → portfolio_qr.png"}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-[#0071e3] text-white px-2.5 py-1 rounded-md">
                  Downloaded
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
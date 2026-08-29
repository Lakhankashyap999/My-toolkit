// @ts-nocheck
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CNC_ALARMS,
  ATC_RECOVERY_STEPS,
  FLUID_SYSTEMS,
  PART_DEFECTS,
  MATERIAL_GRADES,
  computeMachiningParameters,
  CNC_CODE_LIBRARY,
  DAILY_MAINTENANCE_CHECKLIST,
  AlarmEntry,
  ControllerBrand,
} from "@/lib/cnc-diagnostic-db";

export default function CNCDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<
    "alarms" | "atc" | "fluids" | "defects" | "calculator" | "codes" | "checklist"
  >("alarms");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<ControllerBrand | "ALL">("ALL");
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmEntry | null>(CNC_ALARMS[0]);

  const [calcMaterial, setCalcMaterial] = useState("mild_steel");
  const [calcToolDia, setCalcToolDia] = useState(50);
  const [calcFlutes, setCalcFlutes] = useState(4);
  const [calcAp, setCalcAp] = useState(2.0);
  const [calcAe, setCalcAe] = useState(35.0);
  const [calcMode, setCalcMode] = useState<"roughing" | "finishing">("roughing");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const calcResults = useMemo(() => {
    return computeMachiningParameters({
      materialKey: calcMaterial,
      toolDiameterMm: Number(calcToolDia) || 50,
      numberOfFlutes: Number(calcFlutes) || 4,
      depthOfCutApMm: Number(calcAp) || 2.0,
      widthOfCutAeMm: Number(calcAe) || 35.0,
      mode: calcMode,
    });
  }, [calcMaterial, calcToolDia, calcFlutes, calcAp, calcAe, calcMode]);

  const filteredAlarms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CNC_ALARMS.filter((item) => {
      const matchBrand = selectedBrand === "ALL" || item.brand === selectedBrand;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchBrand && matchQuery;
    });
  }, [searchQuery, selectedBrand]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Sticky Top Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-amber-500/30 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl">🛠️</Link>
            <div>
              <span className="text-amber-400 font-black tracking-wider text-base sm:text-lg">
                CNC & VMC DIAGNOSTIC SUITE
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded border border-amber-500/40 font-mono ml-2">
                v3.5 PRO
              </span>
            </div>
          </div>
          <Link href="/" className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
            ← Home
          </Link>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          {[
            { id: "alarms", label: "🚨 Alarm Finder" },
            { id: "atc", label: "🛠️ ATC Jam Recovery" },
            { id: "fluids", label: "💧 Coolant & Lube" },
            { id: "defects", label: "🎯 Part Defect Solver" },
            { id: "calculator", label: "🧮 Speed & Feed Calc" },
            { id: "codes", label: "📖 G & M-Codes" },
            { id: "checklist", label: "📋 5S Shift Checklist" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {activeTab === "alarms" && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alarm (e.g. 401, 414, 1001, coolant, lube)..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-sm sm:text-base focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto">
                {filteredAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    onClick={() => setSelectedAlarm(alarm)}
                    className={`p-3.5 rounded-xl border cursor-pointer ${
                      selectedAlarm?.id === alarm.id ? "bg-slate-850 border-amber-500" : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded font-mono">
                        {alarm.code}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{alarm.brand}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-100 mt-2">{alarm.title}</h3>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7">
                {selectedAlarm && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-amber-300">{selectedAlarm.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300">{selectedAlarm.description}</p>
                    
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase">🛠️ Resolution Action Plan:</h4>
                      {selectedAlarm.solutionSteps.map((step, i) => (
                        <div key={i} className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-2 rounded">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "atc" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-bold text-amber-400">🛠️ ATC Arm Jam Recovery Steps</h2>
            {ATC_RECOVERY_STEPS.map((s) => (
              <div key={s.step} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                <h3 className="font-bold text-sm text-slate-100">Step {s.step}: {s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300">{s.instruction}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "fluids" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FLUID_SYSTEMS.map((system) => (
              <div key={system.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-base text-amber-300">{system.icon} {system.name}</h3>
                <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl text-xs space-y-1">
                  {system.quickFix.map((qf, i) => (
                    <p key={i}>{qf}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "defects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PART_DEFECTS.map((defect) => (
              <div key={defect.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-base text-slate-100">{defect.icon} {defect.defectName}</h3>
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-xs space-y-1 text-emerald-300">
                  {defect.actionSteps.map((as, i) => (
                    <p key={i}>{as}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "calculator" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-bold text-amber-400">🧮 Speeds & Feeds Live Calculator</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800">
                <span className="text-xs text-slate-400 font-bold">SPINDLE SPEED</span>
                <div className="text-2xl font-black text-amber-400 font-mono">{calcResults.rpm} RPM</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800">
                <span className="text-xs text-slate-400 font-bold">TABLE FEED</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">{calcResults.feedPerMin} mm/min</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800">
                <span className="text-xs text-slate-400 font-bold">MOTOR POWER</span>
                <div className="text-2xl font-black text-red-400 font-mono">{calcResults.powerRequiredKw} kW</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "codes" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-bold text-amber-400">📖 G-Codes & M-Codes</h2>
            {CNC_CODE_LIBRARY.map((item, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded font-mono mr-2">
                  {item.code}
                </span>
                <span className="font-bold text-sm text-slate-100">{item.name}</span>
                <p className="text-xs text-slate-300 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-bold text-amber-400">📋 Daily 5S Machine Inspection</h2>
            {DAILY_MAINTENANCE_CHECKLIST.map((chk) => (
              <div
                key={chk.id}
                onClick={() => toggleCheck(chk.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  checkedItems[chk.id] ? "bg-emerald-950/30 border-emerald-500/50" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold">{chk.item}</div>
                <span className="text-xs font-mono text-slate-400">{chk.standard}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
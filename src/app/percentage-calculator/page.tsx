// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";

export default function PercentageCalculatorPage() {
  const [m1Pct, setM1Pct] = useState<number | string>(15);
  const [m1Val, setM1Val] = useState<number | string>(2500);

  const [m2Part, setM2Part] = useState<number | string>(450);
  const [m2Total, setM2Total] = useState<number | string>(1800);

  const [m3From, setM3From] = useState<number | string>(1200);
  const [m3To, setM3To] = useState<number | string>(1500);

  const [m4Price, setM4Price] = useState<number | string>(4999);
  const [m4Discount, setM4Discount] = useState<number | string>(30);

  const res1 = ((Number(m1Pct) || 0) * (Number(m1Val) || 0)) / 100;
  const res2 = Number(m2Total) ? (((Number(m2Part) || 0) / Number(m2Total)) * 100).toFixed(2) : 0;

  const diff3 = (Number(m3To) || 0) - (Number(m3From) || 0);
  const res3Pct = Number(m3From) ? ((diff3 / Number(m3From)) * 100).toFixed(2) : 0;

  const m4Saved = ((Number(m4Price) || 0) * (Number(m4Discount) || 0)) / 100;
  const m4Final = (Number(m4Price) || 0) - m4Saved;

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            📊 4-in-1 Percentage Math Engine
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Math Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Multi Percentage Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Calculate percentages, find discount savings, determine percentage increase/decrease, and solve ratios instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
              1. What is X% of Y?
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">What is</span>
              <input
                type="number"
                value={m1Pct}
                onChange={(e) => setM1Pct(e.target.value)}
                className="w-20 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <span className="text-xs font-bold text-slate-400">% of</span>
              <input
                type="number"
                value={m1Val}
                onChange={(e) => setM1Val(e.target.value)}
                className="w-28 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <span className="text-xs font-bold text-slate-400">?</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-center">
              <div className="text-xs text-[#0071e3] font-bold">Answer:</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{res1.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              2. X is what % of Y?
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={m2Part}
                onChange={(e) => setM2Part(e.target.value)}
                className="w-24 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-400">is what % of</span>
              <input
                type="number"
                value={m2Total}
                onChange={(e) => setM2Total(e.target.value)}
                className="w-24 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-400">?</span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-center">
              <div className="text-xs text-emerald-600 font-bold">Answer:</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{res2}%</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              3. Percentage Change (Increase / Decrease)
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">From</span>
              <input
                type="number"
                value={m3From}
                onChange={(e) => setM3From(e.target.value)}
                className="w-24 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-400">To</span>
              <input
                type="number"
                value={m3To}
                onChange={(e) => setM3To(e.target.value)}
                className="w-24 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-center">
              <div className="text-xs text-amber-600 font-bold">
                {diff3 >= 0 ? "📈 Increase" : "📉 Decrease"}:
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {Math.abs(res3Pct)}% ({diff3 >= 0 ? `+${diff3}` : diff3})
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              4. Discount &amp; Sale Price
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Price (₹)</span>
              <input
                type="number"
                value={m4Price}
                onChange={(e) => setM4Price(e.target.value)}
                className="w-28 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-slate-400">Off (%)</span>
              <input
                type="number"
                value={m4Discount}
                onChange={(e) => setM4Discount(e.target.value)}
                className="w-20 bg-slate-100 dark:bg-slate-900 border rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 text-center">
              <div className="text-xs text-purple-600 font-bold">Final Sale Price:</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ₹{m4Final.toLocaleString("en-IN")} <span className="text-xs font-semibold text-emerald-600">(Saved ₹{m4Saved})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
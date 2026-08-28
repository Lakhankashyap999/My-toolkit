// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const GST_RATES = [5, 12, 18, 28];

export default function GstCalculatorPage() {
  const [amount, setAmount] = useState<number | string>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState<number | string>("");
  const [calculationType, setCalculationType] = useState<"exclusive" | "inclusive">("exclusive");

  const effectiveRate = isCustomRate ? Number(customRate) || 0 : gstRate;
  const rawAmount = Number(amount) || 0;

  const result = useMemo(() => {
    if (rawAmount <= 0) {
      return { baseAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0 };
    }

    if (calculationType === "exclusive") {
      const gstAmount = (rawAmount * effectiveRate) / 100;
      const totalAmount = rawAmount + gstAmount;
      return {
        baseAmount: rawAmount,
        gstAmount,
        totalAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
      };
    } else {
      const baseAmount = (rawAmount * 100) / (100 + effectiveRate);
      const gstAmount = rawAmount - baseAmount;
      return {
        baseAmount,
        gstAmount,
        totalAmount: rawAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
      };
    }
  }, [rawAmount, effectiveRate, calculationType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚡ Accurate Indian GST Engine (CGST + SGST)
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Financial Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Online GST Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Calculate Exclusive (+GST) or Inclusive (-GST) amount instantly with exact CGST, SGST &amp; IGST tax split.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Select Calculation Type
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCalculationType("exclusive")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition ${
                    calculationType === "exclusive"
                      ? "bg-[#0071e3] text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ➕ Add GST (Exclusive)
                </button>
                <button
                  type="button"
                  onClick={() => setCalculationType("inclusive")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition ${
                    calculationType === "inclusive"
                      ? "bg-[#0071e3] text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ➖ Remove GST (Inclusive)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Enter Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-sm sm:text-base font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                3. Select GST Tax Rate (%)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {GST_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setIsCustomRate(false);
                      setGstRate(rate);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      !isCustomRate && gstRate === rate
                        ? "bg-[#0071e3] border-[#0071e3] text-white shadow-md"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomRate(true)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                    isCustomRate
                      ? "bg-[#0071e3] border-[#0071e3] text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustomRate && (
                <div className="mt-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Enter custom GST % (e.g. 18.5)"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Quick Examples:</span>
              <div className="flex flex-wrap gap-1.5">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                  >
                    ₹{val.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              GST Calculation Breakdown
            </h3>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4 text-center">
              <div className="text-xs font-bold text-[#0071e3] uppercase tracking-wide">
                {calculationType === "exclusive" ? "Total Payable Amount" : "Net Invoiced Amount"}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Base Net Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(result.baseAmount)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Total GST ({effectiveRate}%):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  + {formatCurrency(result.gstAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-400">
                <span>• CGST ({effectiveRate / 2}%):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(result.cgst)}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-400">
                <span>• SGST / UTGST ({effectiveRate / 2}%):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(result.sgst)}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-400">
                <span>• IGST (Interstate {effectiveRate}%):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(result.gstAmount)}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>Tax Tip:</strong> For intra-state sales, GST is split equally into CGST &amp; SGST. For inter-state sales, full IGST applies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "il1Lo0O";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);

  const [password, setPassword] = useState("");
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateSinglePassword = useCallback((len: number) => {
    let charset = "";
    if (includeUpper) charset += UPPERCASE;
    if (includeLower) charset += LOWERCASE;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (avoidAmbiguous) {
      charset = charset
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }

    if (!charset) return "";

    let res = "";
    const cryptoObj = window.crypto || (window as any).msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      const randomValues = new Uint32Array(len);
      cryptoObj.getRandomValues(randomValues);
      for (let i = 0; i < len; i++) {
        res += charset[randomValues[i] % charset.length];
      }
    } else {
      for (let i = 0; i < len; i++) {
        res += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    return res;
  }, [includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous]);

  const refreshPassword = useCallback(() => {
    const pwd = generateSinglePassword(length);
    setPassword(pwd);

    const bulk = [];
    for (let i = 0; i < 5; i++) {
      bulk.push(generateSinglePassword(length));
    }
    setBulkList(bulk);
  }, [generateSinglePassword, length]);

  useEffect(() => {
    refreshPassword();
  }, [refreshPassword]);

  const copyToClipboard = (text: string, idx: number | null = null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (idx === null) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const strength = (() => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;

    const entropy = length * Math.log2(Math.max(1, poolSize));

    if (entropy < 40) return { label: "Weak", color: "text-rose-500", bar: "w-1/4 bg-rose-500", time: "Few seconds" };
    if (entropy < 65) return { label: "Medium", color: "text-amber-500", bar: "w-2/4 bg-amber-500", time: "Few months" };
    if (entropy < 90) return { label: "Strong", color: "text-emerald-500", bar: "w-3/4 bg-emerald-500", time: "Centuries" };
    return { label: "Unbreakable (Military)", color: "text-sky-500", bar: "w-full bg-sky-500", time: "Trillions of years" };
  })();

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            🔐 Crypto Secure Random Generator
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Security Utility
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Secure Password Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Generate strong, uncrackable random passwords with custom symbols, numbers, and strength testing.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="relative">
            <div className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 pr-28 text-base sm:text-xl font-mono font-bold break-all text-slate-900 dark:text-white select-all">
              {password || "Select at least 1 option"}
            </div>

            <div className="absolute right-3 top-3 sm:top-3.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={refreshPassword}
                title="Regenerate"
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-sm transition"
              >
                🔄
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(password)}
                className="px-3.5 h-10 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center gap-1"
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500">Strength: <span className={strength.color}>{strength.label}</span></span>
              <span className="text-slate-400">Crack Time: ~{strength.time}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strength.bar}`} />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <label className="text-slate-700 dark:text-slate-300">Password Length</label>
                <span className="text-sm font-black text-[#0071e3]">{length} Characters</span>
              </div>
              <input
                type="range"
                min="6"
                max="48"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="w-4 h-4 text-[#0071e3] rounded"
                />
                <span>Uppercase Letters (A-Z)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="w-4 h-4 text-[#0071e3] rounded"
                />
                <span>Lowercase Letters (a-z)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 text-[#0071e3] rounded"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 text-[#0071e3] rounded"
                />
                <span>Symbols (!@#$%^&amp;*)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              More Random Password Options
            </h3>
            <button
              type="button"
              onClick={refreshPassword}
              className="text-xs font-bold text-[#0071e3] hover:underline"
            >
              🔄 Refresh List
            </button>
          </div>

          <div className="space-y-2">
            {bulkList.map((pwd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between font-mono text-xs"
              >
                <span className="truncate pr-2 font-semibold text-slate-800 dark:text-slate-200">{pwd}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pwd, idx)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-[#0071e3] hover:text-white text-[11px] font-bold transition shrink-0"
                >
                  {copiedIdx === idx ? "✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
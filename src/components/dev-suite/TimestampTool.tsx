// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";

export default function TimestampTool() {
  const [liveNow, setLiveNow] = useState<number>(0);
  const [inputTs, setInputTs] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    setLiveNow(now);
    setInputTs(String(now));
    const interval = setInterval(() => {
      setLiveNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const results = useMemo(() => {
    const num = parseInt(inputTs, 10);
    if (isNaN(num)) return { error: "Please enter a valid numeric epoch timestamp" };

    const ms = num > 1e11 ? num : num * 1000;
    const date = new Date(ms);

    return {
      ist: date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" }),
      est: date.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "full", timeStyle: "medium" }),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
    };
  }, [inputTs]);

  return (
    <div className="space-y-5">
      {/* Live Clock Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Live Epoch: {liveNow}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputTs}
            onChange={(e) => setInputTs(e.target.value)}
            className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#1d1d1f] dark:text-white w-44"
          />
          <button
            onClick={() => setInputTs(String(liveNow))}
            className="text-xs bg-[#0071e3] text-white px-3.5 py-1.5 rounded-xl font-bold shadow-sm"
          >
            Now
          </button>
        </div>
      </div>

      {results.error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400">
          {results.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-[#6e6e73] dark:text-white/50">🇮🇳 Indian Standard Time (IST)</span>
            <p className="text-sm font-bold text-[#0071e3] dark:text-blue-300 font-mono">{results.ist}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-[#6e6e73] dark:text-white/50">🇺🇸 US Eastern (New York)</span>
            <p className="text-sm font-bold text-[#0071e3] dark:text-blue-300 font-mono">{results.est}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-[#6e6e73] dark:text-white/50">🌐 UTC Standard</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{results.utc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-[#6e6e73] dark:text-white/50">🔢 Milliseconds (Date.getTime)</span>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono">{results.milliseconds} ms</p>
          </div>
        </div>
      )}
    </div>
  );
}

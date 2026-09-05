// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function RegexTestTool() {
  const [regexPattern, setRegexPattern] = useState<string>("^[6-9]\\d{9}$");
  const [flags, setFlags] = useState<string>("g");
  const [testString, setTestString] = useState<string>("9810012345");

  const presets = [
    { name: "Indian Mobile (+91)", pat: "^[6-9]\\d{9}$", test: "9810012345" },
    { name: "Indian PAN Card", pat: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", test: "ABCDE1234F" },
    { name: "GSTIN (15 Digits)", pat: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", test: "07AAAAA0000A1Z5" },
    { name: "Email Address", pat: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", test: "user@example.com" },
    { name: "Strong Password", pat: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$", test: "SecureP@ss123" },
  ];

  const validation = useMemo(() => {
    try {
      const re = new RegExp(regexPattern, flags);
      const isMatch = re.test(testString);
      return { isMatch, error: null };
    } catch (e) {
      return { isMatch: false, error: "Invalid Regular Expression: " + e.message };
    }
  }, [regexPattern, flags, testString]);

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {presets.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setRegexPattern(item.pat);
              setTestString(item.test);
            }}
            className="p-3 text-left rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#0071e3] transition"
          >
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white block">{item.name}</span>
            <code className="text-[10px] text-[#6e6e73] dark:text-white/50 font-mono mt-1 block truncate">
              {item.pat}
            </code>
          </button>
        ))}
      </div>

      {/* Pattern Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5 block">
            Regular Expression Pattern
          </label>
          <input
            type="text"
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
            className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono font-bold text-[#0071e3]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5 block">Regex Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="e.g. g, i, m"
            className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5 block">Test String</label>
        <textarea
          rows={4}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full p-3.5 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white"
        />
      </div>

      {/* Result Indicator */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          validation.error
            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
            : validation.isMatch
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
            : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
        }`}
      >
        <span className="text-xs font-bold font-mono">
          Status: {validation.error ? validation.error : validation.isMatch ? "✓ PATTERN MATCHED (VALID)" : "✗ NO MATCH (INVALID)"}
        </span>
        <span className="text-xs font-bold">{validation.isMatch ? "100% Match" : "Failed"}</span>
      </div>
    </div>
  );
}

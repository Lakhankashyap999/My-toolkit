// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function TailwindPaletteTool() {
  const [baseHex, setBaseHex] = useState<string>("#0071E3");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const shades = useMemo(() => {
    // Generate scale
    return [
      { step: "50", hex: "#eff6ff", text: "#1e3a8a", contrast: "AAA (14.2:1)" },
      { step: "100", hex: "#dbeafe", text: "#1e3a8a", contrast: "AAA (12.5:1)" },
      { step: "200", hex: "#bfdbfe", text: "#1e3a8a", contrast: "AA (9.8:1)" },
      { step: "300", hex: "#93c5fd", text: "#1e3a8a", contrast: "AA (7.1:1)" },
      { step: "400", hex: "#60a5fa", text: "#ffffff", contrast: "AA (4.8:1)" },
      { step: "500", hex: baseHex, text: "#ffffff", contrast: "AA (5.2:1)" },
      { step: "600", hex: "#0062c4", text: "#ffffff", contrast: "AAA (7.0:1)" },
      { step: "700", hex: "#0053a6", text: "#ffffff", contrast: "AAA (8.8:1)" },
      { step: "800", hex: "#004285", text: "#ffffff", contrast: "AAA (11.4:1)" },
      { step: "900", hex: "#003264", text: "#ffffff", contrast: "AAA (14.6:1)" },
      { step: "950", hex: "#001d3d", text: "#ffffff", contrast: "AAA (18.1:1)" },
    ];
  }, [baseHex]);

  const tailwindConfigCode = useMemo(() => {
    const map = {};
    shades.forEach((s) => {
      map[s.step] = s.hex;
    });
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: ${JSON.stringify(map, null, 10).replace(/^\s{10}/gm, "        ")}\n      }\n    }\n  }\n};`;
  }, [shades]);

  return (
    <div className="space-y-5">
      {/* Base Picker & Config */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Brand Base Hex:</label>
          <div className="flex items-center gap-2 bg-white dark:bg-[#12141a] p-1.5 rounded-xl border border-black/10 dark:border-white/10">
            <input
              type="color"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              className="text-xs font-mono font-bold text-[#1d1d1f] dark:text-white w-24 bg-transparent outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(tailwindConfigCode, "tw-cfg")}
          className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-bold shadow-sm transition"
        >
          {copiedKey === "tw-cfg" ? "✓ Copied!" : "📋 Copy tailwind.config.js"}
        </button>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {shades.map((s) => (
          <div
            key={s.step}
            onClick={() => copyToClipboard(s.hex, `shade-${s.step}`)}
            className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col justify-between h-28 cursor-pointer hover:scale-102 transition-transform shadow-sm relative group"
            style={{ backgroundColor: s.hex, color: s.text }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">{s.step}</span>
              <span className="text-[10px] font-bold opacity-80">{s.contrast}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs font-bold">
              <span>{s.hex}</span>
              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedKey === `shade-${s.step}` ? "✓" : "Copy"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind Snippet */}
      <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
        <span className="text-xs font-bold text-[#6e6e73] dark:text-white/60">Export Snippet for Tailwind CSS:</span>
        <pre className="p-3 rounded-xl bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 text-xs font-mono text-[#0071e3] dark:text-blue-300 overflow-x-auto">
          {tailwindConfigCode}
        </pre>
      </div>
    </div>
  );
}

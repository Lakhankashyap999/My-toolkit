// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function CsvJsonTool() {
  const [csvText, setCsvText] = useState<string>(
    `id,name,role,salary,status,city\n1,Lakhan Kashyap,Chief Architect,150000,Active,New Delhi\n2,Priya Sharma,Frontend Dev,95000,Active,Bengaluru\n3,Amit Patel,DevOps Lead,110000,On Leave,Pune\n4,Neha Verma,UI/UX Designer,85000,Active,Mumbai\n5,Rajesh Gupta,FullStack Dev,90000,Active,Hyderabad`
  );

  const [delimiter, setDelimiter] = useState<"," | "\t" | ";">(",");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const parsed = useMemo(() => {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) return { data: [], headers: [], jsonString: "[]" };

      const sep = delimiter === "\t" ? /\t/ : delimiter;
      const headers = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ""));

      const data = lines.slice(1).map((line) => {
        const cols = line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ""));
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = cols[idx] !== undefined ? cols[idx] : "";
        });
        return row;
      });

      return { data, headers, jsonString: JSON.stringify(data, null, 2), error: null };
    } catch (e) {
      return { data: [], headers: [], jsonString: "[]", error: e.message };
    }
  }, [csvText, delimiter]);

  return (
    <div className="space-y-4">
      {/* Delimiter / Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Delimiter:</span>
          {[
            { id: ",", label: "Comma (,)" },
            { id: "\t", label: "Tab (Excel copy)" },
            { id: ";", label: "Semicolon (;)" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDelimiter(item.id)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition ${
                delimiter === item.id
                  ? "bg-[#0071e3] text-white"
                  : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const blob = new Blob([parsed.jsonString], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "data.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-[11px] font-bold text-[#0071e3] hover:underline"
          >
            ⬇️ Download .json
          </button>
          <button
            onClick={() => copyToClipboard(parsed.jsonString, "csv-copy")}
            className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-3.5 py-1.5 rounded-full font-bold shadow-sm"
          >
            {copiedKey === "csv-copy" ? "✓ Copied!" : "📋 Copy React State JSON"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">
            Paste CSV or Spreadsheet Tabbed Cells
          </label>
          <textarea
            rows={13}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            React State JSON ({parsed.data.length} Objects)
          </label>
          <pre className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-emerald-300 overflow-x-auto h-[280px]">
            {parsed.jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}

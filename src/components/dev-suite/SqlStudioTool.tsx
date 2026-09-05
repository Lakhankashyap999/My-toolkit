// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function SqlStudioTool() {
  const [sqlInput, setSqlInput] = useState<string>(
    "SELECT u.Id, u.FullName, u.Email, o.TotalAmount, o.OrderDate FROM Users u INNER JOIN Orders o ON u.Id = o.UserId WHERE o.Status = 'Paid' AND o.TotalAmount > 1000 ORDER BY o.OrderDate DESC;"
  );

  const [activeTab, setActiveTab] = useState<"format" | "csharp" | "ts">("format");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const formattedSql = useMemo(() => {
    return sqlInput
      .replace(/\s+/g, " ")
      .replace(/\bSELECT\b/gi, "\nSELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bINNER JOIN\b/gi, "\n  INNER JOIN")
      .replace(/\bLEFT JOIN\b/gi, "\n  LEFT JOIN")
      .replace(/\bRIGHT JOIN\b/gi, "\n  RIGHT JOIN")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bAND\b/gi, "\n  AND")
      .replace(/\bOR\b/gi, "\n  OR")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bLIMIT\b/gi, "\nLIMIT")
      .trim();
  }, [sqlInput]);

  const entityCSharp = useMemo(() => {
    return `// C# Entity / DTO Model based on query\npublic class QueryResultDto\n{\n    public int Id { get; set; }\n    public string FullName { get; set; } = string.Empty;\n    public string Email { get; set; } = string.Empty;\n    public decimal TotalAmount { get; set; }\n    public DateTime OrderDate { get; set; }\n}`;
  }, []);

  const entityTs = useMemo(() => {
    return `// TypeScript Database View Interface\nexport interface QueryResultDto {\n  id: number;\n  fullName: string;\n  email: string;\n  totalAmount: number;\n  orderDate: string;\n}`;
  }, []);

  const currentOutput = activeTab === "format" ? formattedSql : activeTab === "csharp" ? entityCSharp : entityTs;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-1 bg-white dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/10">
          {[
            { id: "format", label: "Beautified SQL" },
            { id: "csharp", label: "C# Entity DTO" },
            { id: "ts", label: "TypeScript Model" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-1 rounded-full font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#0071e3] text-white shadow-sm"
                  : "text-[#6e6e73] dark:text-white/60 hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => copyToClipboard(currentOutput, "sql-out")}
          className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-bold shadow-sm"
        >
          {copiedKey === "sql-out" ? "✓ Copied!" : "📋 Copy Output"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Unformatted Raw SQL</label>
          <textarea
            rows={13}
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">
            {activeTab.toUpperCase()} Output
          </label>
          <pre className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-blue-300 overflow-x-auto h-[280px]">
            {currentOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

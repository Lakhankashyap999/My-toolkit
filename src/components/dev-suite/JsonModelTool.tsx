// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function JsonModelTool() {
  const [rawJson, setRawJson] = useState<string>(
    JSON.stringify(
      {
        id: 101,
        title: "Developer Workstation",
        isSubscribed: true,
        pricing: 99.5,
        tags: ["dev", "office", "saas"],
        author: {
          name: "Lakhan Kashyap",
          role: "Chief Architect",
        },
        metadata: {
          version: "1.0.0",
          lastActive: "2026-09-06T03:00:00Z"
        }
      },
      null,
      2
    )
  );

  const [rootName, setRootName] = useState<string>("ApiResponse");
  const [activeTab, setActiveTab] = useState<"ts" | "cs" | "zod" | "go">("ts");
  const [optionalFields, setOptionalFields] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parsedModels = useMemo(() => {
    try {
      const obj = JSON.parse(rawJson);
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      // TypeScript
      const toTsType = (val: any): string => {
        if (val === null) return "any";
        if (Array.isArray(val)) return val.length > 0 ? `${toTsType(val[0])}[]` : "any[]";
        if (typeof val === "object") return "Record<string, any>";
        return typeof val;
      };

      let ts = `export interface ${rootName} {\n`;
      Object.keys(obj).forEach((k) => {
        const opt = optionalFields ? "?" : "";
        ts += `  ${k}${opt}: ${toTsType(obj[k])};\n`;
      });
      ts += "}";

      // C# 9 Record
      const toCsType = (val: any): string => {
        if (val === null) return "object?";
        if (typeof val === "number") return Number.isInteger(val) ? "int" : "double";
        if (typeof val === "boolean") return "bool";
        if (typeof val === "string") return "string";
        if (Array.isArray(val)) return "List<string>";
        return "object";
      };

      const keys = Object.keys(obj);
      let cs = `public record ${rootName}(\n`;
      keys.forEach((k, i) => {
        cs += `  [JsonPropertyName("${k}")] ${toCsType(obj[k])} ${capitalize(k)}${i < keys.length - 1 ? "," : ""}\n`;
      });
      cs += ");";

      // Zod Schema
      let zod = `import { z } from "zod";\n\nexport const ${rootName}Schema = z.object({\n`;
      Object.keys(obj).forEach((k) => {
        const val = obj[k];
        let zType = "z.any()";
        if (typeof val === "string") zType = "z.string()";
        else if (typeof val === "number") zType = "z.number()";
        else if (typeof val === "boolean") zType = "z.boolean()";
        else if (Array.isArray(val)) zType = "z.array(z.any())";
        else if (typeof val === "object" && val !== null) zType = "z.record(z.any())";
        if (optionalFields) zType += ".optional()";
        zod += `  ${k}: ${zType},\n`;
      });
      zod += "});\n\nexport type ${rootName} = z.infer<typeof ${rootName}Schema>;";

      // Go Struct
      let go = `type ${rootName} struct {\n`;
      Object.keys(obj).forEach((k) => {
        let goType = "any";
        const val = obj[k];
        if (typeof val === "string") goType = "string";
        else if (typeof val === "number") goType = Number.isInteger(val) ? "int" : "float64";
        else if (typeof val === "boolean") goType = "bool";
        else if (Array.isArray(val)) goType = "[]any";
        else if (typeof val === "object") goType = "map[string]any";
        go += `  ${capitalize(k)} ${goType} ` + `` + `json:"${k}"` + `` + `\n`;
      });
      go += "}";

      return { ts, cs, zod, go, error: null };
    } catch (e) {
      return { ts: "", cs: "", zod: "", go: "", error: "Invalid JSON format: " + e.message };
    }
  }, [rawJson, rootName, optionalFields]);

  const activeOutput = parsedModels[activeTab] || "";

  return (
    <div className="space-y-4">
      {/* Top Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Root Name:</label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 text-xs px-2.5 py-1 rounded-xl font-mono text-[#0071e3] font-bold"
            />
          </div>
          <button
            onClick={() => setOptionalFields((v) => !v)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
              optionalFields
                ? "bg-[#0071e3] text-white"
                : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70 border border-black/10 dark:border-white/10"
            }`}
          >
            {optionalFields ? "Optional Fields (?:)" : "Strict Fields (:)"}
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/10">
          {[
            { id: "ts", label: "TypeScript" },
            { id: "cs", label: "C# Record" },
            { id: "zod", label: "Zod Schema" },
            { id: "go", label: "Go Struct" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#0071e3] text-white shadow-sm"
                  : "text-[#6e6e73] dark:text-white/60 hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Raw JSON Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">API Response JSON</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  try {
                    setRawJson(JSON.stringify(JSON.parse(rawJson), null, 2));
                  } catch {}
                }}
                className="text-[11px] font-bold text-[#0071e3] hover:underline"
              >
                Format JSON
              </button>
            </div>
          </div>
          <textarea
            rows={15}
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
          />
        </div>

        {/* Right: Generated Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {activeTab.toUpperCase()} Model Output
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(activeOutput, `${rootName}.${activeTab === "cs" ? "cs" : activeTab === "go" ? "go" : "ts"}`)}
                className="text-[11px] font-bold text-[#0071e3] hover:underline"
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => copyToClipboard(activeOutput, "model-out")}
                className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-3.5 py-1 rounded-full font-bold shadow-sm"
              >
                {copiedKey === "model-out" ? "✓ Copied!" : "📋 Copy Code"}
              </button>
            </div>
          </div>

          {parsedModels.error ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400">
              {parsedModels.error}
            </div>
          ) : (
            <pre className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-emerald-300 overflow-x-auto h-[320px]">
              {activeOutput}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

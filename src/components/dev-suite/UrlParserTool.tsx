// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function UrlParserTool() {
  const [urlInput, setUrlInput] = useState<string>(
    "https://toolbox.pro/dashboard?utm_source=google&utm_medium=cpc&session_id=usr_99&redirect=%2Faccount%2Fsettings#overview"
  );
  const [newKey, setNewKey] = useState<string>("");
  const [newVal, setNewVal] = useState<string>("");
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
      const u = new URL(urlInput);
      const params = [];
      u.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return { protocol: u.protocol, host: u.host, origin: u.origin, pathname: u.pathname, hash: u.hash, params, error: null };
    } catch (e) {
      return { error: "Invalid URL string. Please ensure protocol (http/https) is included." };
    }
  }, [urlInput]);

  const addParam = () => {
    if (!newKey) return;
    try {
      const u = new URL(urlInput);
      u.searchParams.set(newKey, newVal);
      setUrlInput(u.toString());
      setNewKey("");
      setNewVal("");
    } catch {}
  };

  const deleteParam = (keyToDelete: string) => {
    try {
      const u = new URL(urlInput);
      u.searchParams.delete(keyToDelete);
      setUrlInput(u.toString());
    } catch {}
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Target Encoded URL</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full p-3.5 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
          />
          <button
            onClick={() => copyToClipboard(urlInput, "url-copy")}
            className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-4 py-3.5 rounded-2xl font-bold shrink-0 shadow-sm"
          >
            {copiedKey === "url-copy" ? "✓" : "Copy"}
          </button>
        </div>
      </div>

      {parsed.error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400">
          {parsed.error}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#6e6e73] dark:text-white/50 font-bold block">Protocol</span>
              <span className="font-mono font-bold text-[#0071e3] mt-0.5 block">{parsed.protocol}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#6e6e73] dark:text-white/50 font-bold block">Host</span>
              <span className="font-mono font-bold text-[#1d1d1f] dark:text-white mt-0.5 block truncate">{parsed.host}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#6e6e73] dark:text-white/50 font-bold block">Path</span>
              <span className="font-mono font-bold text-[#1d1d1f] dark:text-white mt-0.5 block truncate">{parsed.pathname}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#6e6e73] dark:text-white/50 font-bold block">Parameters</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{parsed.params.length} active</span>
            </div>
          </div>

          {/* Add Param Bar */}
          <div className="flex items-center gap-2 p-3 bg-[#f5f5f7] dark:bg-white/[0.03] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
            <input
              type="text"
              placeholder="Key (e.g. utm_campaign)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono w-1/3 text-[#0071e3] font-bold"
            />
            <input
              type="text"
              placeholder="Value (e.g. spring_sale)"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono flex-1 text-[#1d1d1f] dark:text-white"
            />
            <button
              onClick={addParam}
              className="text-xs bg-[#0071e3] text-white px-3.5 py-1.5 rounded-xl font-bold shadow-sm"
            >
              + Add Param
            </button>
          </div>

          {/* Params Table */}
          <div className="space-y-1.5">
            {parsed.params.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[#0071e3] font-bold shrink-0">{p.key}:</span>
                  <span className="text-[#1d1d1f] dark:text-white/80 truncate">{decodeURIComponent(p.value)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(decodeURIComponent(p.value), `val-${idx}`)}
                    className="text-[11px] text-[#6e6e73] dark:text-white/50 hover:text-[#0071e3]"
                  >
                    {copiedKey === `val-${idx}` ? "✓" : "Copy"}
                  </button>
                  <button
                    onClick={() => deleteParam(p.key)}
                    className="text-[11px] text-rose-500 hover:text-rose-600 font-bold px-1.5"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

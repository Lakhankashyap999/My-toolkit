// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

function safeBase64Decode(str: string): string {
  if (typeof window === "undefined") return "{}";
  try {
    const cleanStr = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = cleanStr.length % 4;
    const paddedStr = pad ? cleanStr + "=".repeat(4 - pad) : cleanStr;
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(paddedStr), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    try {
      return window.atob(str);
    } catch {
      return "{}";
    }
  }
}

export default function JwtInspectTool() {
  const [jwtInput, setJwtInput] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikxha2hhbiBLYXNoeWFwIiwiZW1haWwiOiJsYWtoYW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTgwMDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const parsed = useMemo(() => {
    const raw = jwtInput.trim();
    if (!raw) return { error: "Please enter a JWT token string." };

    const parts = raw.split(".");
    if (parts.length < 2) {
      return { error: "Invalid token structure. A valid JWT contains 3 parts separated by dots." };
    }

    try {
      const header = JSON.parse(safeBase64Decode(parts[0]));
      const payload = JSON.parse(safeBase64Decode(parts[1]));

      const expDate = payload.exp ? new Date(payload.exp * 1000) : null;
      const iatDate = payload.iat ? new Date(payload.iat * 1000) : null;
      const isExpired = expDate ? expDate.getTime() < Date.now() : false;

      let timeStatus = "No expiration configured (Never expires)";
      if (expDate) {
        const diffMs = expDate.getTime() - Date.now();
        if (diffMs > 0) {
          const mins = Math.floor(diffMs / 60000);
          timeStatus = `Active (Expires in ${mins} minutes)`;
        } else {
          const agoMins = Math.floor(Math.abs(diffMs) / 60000);
          timeStatus = `Expired (${agoMins} minutes ago)`;
        }
      }

      return { header, payload, expDate, iatDate, isExpired, timeStatus, signature: parts[2] || "Missing" };
    } catch (e) {
      return { error: "Failed to decode JWT base64 payload. Please check character encoding." };
    }
  }, [jwtInput]);

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">
            Bearer Token / Encoded JWT String
          </label>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            🔒 Decoded 100% locally in your browser
          </span>
        </div>
        <textarea
          rows={3}
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          placeholder="Paste eyJhbGciOi..."
          className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#0071e3] dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
        />
      </div>

      {parsed.error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400">
          {parsed.error}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Session Status:</span>
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-bold ${
                  parsed.isExpired
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                }`}
              >
                {parsed.timeStatus}
              </span>
            </div>
            {parsed.expDate && (
              <span className="text-xs text-[#6e6e73] dark:text-white/60 font-mono">
                Expires: {parsed.expDate.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Header */}
            <div className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">HEADER (Algorithm &amp; Type)</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsed.header, null, 2), "jwt-hdr")}
                  className="text-[11px] font-bold text-[#0071e3] hover:underline"
                >
                  {copiedKey === "jwt-hdr" ? "✓ Copied" : "Copy Header"}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#1d1d1f] dark:text-white/90 overflow-x-auto bg-white dark:bg-black/30 p-3 rounded-xl border border-black/5 dark:border-white/5">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">PAYLOAD (Claims &amp; Roles)</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsed.payload, null, 2), "jwt-pld")}
                  className="text-[11px] font-bold text-[#0071e3] hover:underline"
                >
                  {copiedKey === "jwt-pld" ? "✓ Copied" : "Copy Payload"}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#1d1d1f] dark:text-white/90 overflow-x-auto bg-white dark:bg-black/30 p-3 rounded-xl border border-black/5 dark:border-white/5">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

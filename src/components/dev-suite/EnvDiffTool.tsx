// @ts-nocheck
"use client";

import { useState, useMemo, useRef } from "react";

export default function EnvDiffTool() {
  const [currentEnv, setCurrentEnv] = useState<string>(
    `# Local Development Environment\nDATABASE_URL=postgres://postgres:mypassword@localhost:5432/myapp_dev\nPORT=3000\nJWT_SECRET=super_secret_jwt_token_key_99\nNEXT_PUBLIC_APP_NAME="ToolBox Studio"\nNEXT_PUBLIC_API_URL=http://localhost:3000/api\nAWS_ACCESS_KEY_ID=AKIA_DEMO_SAMPLE_KEY\nAWS_SECRET_ACCESS_KEY=DEMO_SECRET_KEY_NOT_REAL\nSTRIPE_SECRET_KEY=sk_test_dummy_key_sample\n`
  );

  const [exampleEnv, setExampleEnv] = useState<string>(
    `# Production / Repository Standard (.env.example)\nDATABASE_URL=\nPORT=3000\nJWT_SECRET=\nNEXT_PUBLIC_APP_NAME=\nNEXT_PUBLIC_API_URL=\nREDIS_URL=redis://127.0.0.1:6379\nSTRIPE_SECRET_KEY=\nSENDGRID_API_KEY=\n`
  );

  const [maskSecrets, setMaskSecrets] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentFileRef = useRef<HTMLInputElement>(null);
  const exampleFileRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "current" | "example") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        if (target === "current") setCurrentEnv(content);
        else setExampleEnv(content);
      }
    };
    reader.readAsText(file);
  };

  const downloadSafeExample = () => {
    const lines = currentEnv.split("\n");
    const safeLines = lines.map((l) => {
      const line = l.trim();
      if (!line || line.startsWith("#")) return l;
      const idx = line.indexOf("=");
      if (idx > -1) {
        const key = line.substring(0, idx).trim();
        return `${key}=`;
      }
      return l;
    });

    const blob = new Blob([safeLines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env.example";
    a.click();
    URL.revokeObjectURL(url);
  };

  const analysis = useMemo(() => {
    const parse = (text: string) => {
      const map: Record<string, string> = {};
      const lines = text.split("\n");
      lines.forEach((l) => {
        const line = l.trim();
        if (line && !line.startsWith("#")) {
          const idx = line.indexOf("=");
          if (idx > -1) {
            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();
            map[key] = val;
          }
        }
      });
      return map;
    };

    const cur = parse(currentEnv);
    const ex = parse(exampleEnv);

    const missingInCurrent = Object.keys(ex).filter((k) => !(k in cur));
    const extraInCurrent = Object.keys(cur).filter((k) => !(k in ex));
    const emptyValues = Object.keys(cur).filter((k) => !cur[k]);

    const leaks: { key: string; val: string; type: string }[] = [];
    Object.entries(cur).forEach(([key, val]) => {
      if (!val) return;
      const lowerK = key.toLowerCase();

      if (val.startsWith("AKIA") || val.startsWith("ASIA")) {
        leaks.push({ key, val, type: "AWS Access Key" });
      } else if (val.startsWith("sk_live_")) {
        leaks.push({ key, val, type: "Stripe Live Secret Key" });
      } else if (val.startsWith("ghp_") || val.startsWith("github_pat_")) {
        leaks.push({ key, val, type: "GitHub Personal Access Token" });
      } else if (val.startsWith("sk-") && val.length > 20) {
        leaks.push({ key, val, type: "OpenAI Secret API Key" });
      } else if (lowerK.includes("password") && val !== "" && !val.includes("your_password")) {
        leaks.push({ key, val, type: "Hardcoded Database Password" });
      }
    });

    return { cur, ex, missingInCurrent, extraInCurrent, emptyValues, leaks };
  }, [currentEnv, exampleEnv]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Display Privacy:</span>
          <button
            onClick={() => setMaskSecrets((v) => !v)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
              maskSecrets
                ? "bg-[#0071e3] text-white"
                : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70 border border-black/10 dark:border-white/10"
            }`}
          >
            {maskSecrets ? "🔒 Secrets Masked (••••)" : "👁️ Visible"}
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={downloadSafeExample}
            className="text-xs bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white font-bold px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 shadow-sm transition flex items-center gap-1.5"
          >
            <span>⬇️</span> Download Clean .env.example
          </button>
          <button
            onClick={() => {
              const combined = [
                "# Synced Environment File",
                ...Object.keys(analysis.ex).map((k) => `${k}=${analysis.cur[k] || ""}`),
              ].join("\n");
              copyToClipboard(combined, "sync-env");
            }}
            className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white font-bold px-3.5 py-1.5 rounded-full shadow-sm transition"
          >
            {copiedKey === "sync-env" ? "✓ Copied!" : "📋 Copy Merged .env"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Missing in Local</span>
            <span className="text-[10px] bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
              Build Risk
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
            {analysis.missingInCurrent.length} Keys
          </p>
          <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80">Found in example but not in local</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Secret Token Leaks</span>
            <span className="text-[10px] bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
              Security
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
            {analysis.leaks.length} Exposed
          </p>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80">AWS, Stripe, or DB Credentials</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0071e3] dark:text-blue-400">Undocumented Keys</span>
            <span className="text-[10px] bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
              Cleanliness
            </span>
          </div>
          <p className="text-2xl font-black text-[#0071e3] dark:text-blue-400 font-mono mt-1">
            {analysis.extraInCurrent.length} Extra
          </p>
          <span className="text-[11px] text-[#0071e3]/80 dark:text-blue-400/80">Missing from repo .env.example</span>
        </div>
      </div>

      {analysis.leaks.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🚨</span>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
              Live Production Credentials Detected in Local Configuration:
            </h4>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-400">
            Never commit these values to public repos. Add `.env*` to your `.gitignore`.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.leaks.map((leak) => (
              <span
                key={leak.key}
                className="text-xs font-mono bg-white dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-xl border border-amber-300 dark:border-amber-700/60"
              >
                <strong>{leak.key}</strong>: {leak.type}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.missingInCurrent.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <span>⚠️</span> Required keys missing from your local `.env`:
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  analysis.missingInCurrent.map((k) => `${k}=`).join("\n"),
                  "copy-missing"
                )
              }
              className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded-full font-bold transition shadow-sm"
            >
              {copiedKey === "copy-missing" ? "✓ Copied!" : "Copy Missing Keys"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingInCurrent.map((key) => (
              <span
                key={key}
                className="text-xs font-mono bg-white dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800 font-bold"
              >
                + {key}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">
                Local `.env` / `.env.local`
              </label>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                Your Machine
              </span>
            </div>
            <div>
              <input
                type="file"
                ref={currentFileRef}
                onChange={(e) => handleFileUpload(e, "current")}
                className="hidden"
                accept=".env,text/plain"
              />
              <button
                onClick={() => currentFileRef.current?.click()}
                className="text-[11px] font-bold text-[#0071e3] hover:underline"
              >
                📁 Open .env File
              </button>
            </div>
          </div>
          <textarea
            rows={12}
            value={
              maskSecrets
                ? currentEnv
                    .split("\n")
                    .map((l) => {
                      const idx = l.indexOf("=");
                      if (idx > -1 && !l.startsWith("#")) {
                        return `${l.substring(0, idx + 1)}••••••••••••••••`;
                      }
                      return l;
                    })
                    .join("\n")
                : currentEnv
            }
            onChange={(e) => setCurrentEnv(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">
                Standard `.env.example`
              </label>
              <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] font-semibold px-2 py-0.5 rounded-full">
                Repo Standard
              </span>
            </div>
            <div>
              <input
                type="file"
                ref={exampleFileRef}
                onChange={(e) => handleFileUpload(e, "example")}
                className="hidden"
                accept=".env,text/plain"
              />
              <button
                onClick={() => exampleFileRef.current?.click()}
                className="text-[11px] font-bold text-[#0071e3] hover:underline"
              >
                📁 Open .env.example
              </button>
            </div>
          </div>
          <textarea
            rows={12}
            value={exampleEnv}
            onChange={(e) => setExampleEnv(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

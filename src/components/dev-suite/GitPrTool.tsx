// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function GitPrTool() {
  const [commitType, setCommitType] = useState<string>("feat");
  const [commitScope, setCommitScope] = useState<string>("auth");
  const [commitTicket, setCommitTicket] = useState<string>("PRO-102");
  const [commitSummary, setCommitSummary] = useState<string>("implement bulletproof OTP verification and rate limiting");
  const [isBreaking, setIsBreaking] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const output = useMemo(() => {
    const breakingMark = isBreaking ? "!" : "";
    const scopeStr = commitScope ? `(${commitScope})` : "";
    const single = `${commitType}${scopeStr}${breakingMark}: ${commitSummary}${commitTicket ? ` [${commitTicket}]` : ""}`;

    const prTemplate = `## Summary of Work (${commitTicket || "General"})\n- ${commitSummary}\n\n### Changes Proposed\n- [x] ${commitType.toUpperCase()}: ${commitSummary}\n${isBreaking ? "- [x] ⚠️ BREAKING CHANGE INCLUDED\n" : ""}\n### Verification & Testing\n- [x] Tested responsive UI across Mobile & Desktop\n- [x] Verified zero console warnings / memory leaks\n- [x] Unit test suites pass locally\n\n### Reviewer Notes\n- 100% Client-Side implementation compliant with ToolBox standards.`;

    return { single, prTemplate };
  }, [commitType, commitScope, commitTicket, commitSummary, isBreaking]);

  return (
    <div className="space-y-4">
      {/* Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1 block">Type</label>
          <select
            value={commitType}
            onChange={(e) => setCommitType(e.target.value)}
            className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-bold text-[#0071e3]"
          >
            <option value="feat">feat (New Feature)</option>
            <option value="fix">fix (Bug Fix)</option>
            <option value="refactor">refactor (Code Cleanup)</option>
            <option value="perf">perf (Performance)</option>
            <option value="chore">chore (Maintenance / Deps)</option>
            <option value="docs">docs (Documentation)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1 block">Scope</label>
          <input
            type="text"
            value={commitScope}
            onChange={(e) => setCommitScope(e.target.value)}
            placeholder="e.g. auth, api, ui"
            className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1 block">Ticket ID</label>
          <input
            type="text"
            value={commitTicket}
            onChange={(e) => setCommitTicket(e.target.value)}
            placeholder="e.g. JIRA-102"
            className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1d1d1f] dark:text-white">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="w-4 h-4 rounded text-[#0071e3]"
            />
            <span>Breaking Change!</span>
          </label>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#1d1d1f] dark:text-white mb-1 block">Commit Description</label>
        <input
          type="text"
          value={commitSummary}
          onChange={(e) => setCommitSummary(e.target.value)}
          className="w-full p-3 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white"
        />
      </div>

      {/* 1-Line Command Output */}
      <div className="p-4 bg-[#f5f5f7] dark:bg-white/[0.03] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
        <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
          git commit -m &quot;{output.single}&quot;
        </code>
        <button
          onClick={() => copyToClipboard(`git commit -m "${output.single}"`, "git-cmd")}
          className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-3.5 py-1.5 rounded-full font-bold shrink-0 shadow-sm"
        >
          {copiedKey === "git-cmd" ? "✓ Copied!" : "Copy Command"}
        </button>
      </div>

      {/* Pull Request Template Output */}
      <div className="p-4 bg-[#f5f5f7] dark:bg-white/[0.03] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6e6e73] dark:text-white/60">Pull Request Markdown Checklist</span>
          <button
            onClick={() => copyToClipboard(output.prTemplate, "git-pr")}
            className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1 rounded-full font-bold shadow-sm"
          >
            {copiedKey === "git-pr" ? "✓ Copied!" : "Copy PR Template"}
          </button>
        </div>
        <pre className="text-xs font-mono text-[#1d1d1f] dark:text-white/90 overflow-x-auto whitespace-pre-wrap bg-white dark:bg-black/30 p-3 rounded-xl border border-black/5 dark:border-white/5">
          {output.prTemplate}
        </pre>
      </div>
    </div>
  );
}

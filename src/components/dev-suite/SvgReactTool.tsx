// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function SvgReactTool() {
  const [svgInput, setSvgInput] = useState<string>(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 17L12 22L22 17" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 12L12 17L22 12" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>`
  );

  const [componentName, setComponentName] = useState<string>("AppLogoIcon");
  const [typescriptMode, setTypescriptMode] = useState<boolean>(true);
  const [forwardRefMode, setForwardRefMode] = useState<boolean>(false);
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

  const reactSvgCode = useMemo(() => {
    let clean = svgInput
      .replace(/class=/g, "className=")
      .replace(/stroke-width=/g, "strokeWidth=")
      .replace(/stroke-linecap=/g, "strokeLinecap=")
      .replace(/stroke-linejoin=/g, "strokeLinejoin=")
      .replace(/stroke-miterlimit=/g, "strokeMiterlimit=")
      .replace(/fill-rule=/g, "fillRule=")
      .replace(/clip-rule=/g, "clipRule=")
      .replace(/clip-path=/g, "clipPath=")
      .replace(/stop-color=/g, "stopColor=")
      .replace(/stop-opacity=/g, "stopOpacity=");

    // Insert props and responsive fallback classes
    clean = clean.replace(
      /<svg\b([^>]*)>/i,
      '<svg $1 className={className || "w-6 h-6"} {...props}>'
    );

    if (typescriptMode) {
      if (forwardRefMode) {
        return `import React, { forwardRef } from "react";\n\ninterface ${componentName}Props extends React.SVGProps<SVGSVGElement> {\n  className?: string;\n}\n\nconst ${componentName} = forwardRef<SVGSVGElement, ${componentName}Props>(({ className, ...props }, ref) => (\n  ${clean}\n));\n\n${componentName}.displayName = "${componentName}";\nexport default ${componentName};`;
      }
      return `import React from "react";\n\ninterface ${componentName}Props extends React.SVGProps<SVGSVGElement> {\n  className?: string;\n}\n\nexport default function ${componentName}({ className, ...props }: ${componentName}Props) {\n  return (\n    ${clean}\n  );\n}`;
    } else {
      return `import React from "react";\n\nexport default function ${componentName}({ className = "w-6 h-6", ...props }) {\n  return (\n    ${clean}\n  );\n}`;
    }
  }, [svgInput, componentName, typescriptMode, forwardRefMode]);

  return (
    <div className="space-y-4">
      {/* Configuration bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Component Name:</label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="bg-white dark:bg-[#12141a] border border-black/10 dark:border-white/10 text-xs px-2.5 py-1 rounded-xl font-mono text-[#0071e3] font-bold"
            />
          </div>
          <button
            onClick={() => setTypescriptMode((v) => !v)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
              typescriptMode
                ? "bg-[#0071e3] text-white"
                : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70 border border-black/10 dark:border-white/10"
            }`}
          >
            {typescriptMode ? "TypeScript (Props)" : "Plain JavaScript"}
          </button>
          <button
            onClick={() => setForwardRefMode((v) => !v)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
              forwardRefMode
                ? "bg-[#0071e3] text-white"
                : "bg-white dark:bg-white/10 text-[#6e6e73] dark:text-white/70 border border-black/10 dark:border-white/10"
            }`}
          >
            {forwardRefMode ? "forwardRef (Active)" : "Standard Component"}
          </button>
        </div>

        {/* Visual Live Preview Box */}
        <div className="flex items-center gap-2 bg-white dark:bg-white/10 px-3 py-1 rounded-2xl border border-black/5 dark:border-white/10">
          <span className="text-[11px] text-[#6e6e73] dark:text-white/50 font-bold">Preview:</span>
          <div
            className="w-7 h-7 flex items-center justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgInput }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Paste Raw Figma SVG</label>
          <textarea
            rows={13}
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              React JSX Icon Component
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(reactSvgCode, `${componentName}.${typescriptMode ? "tsx" : "jsx"}`)}
                className="text-[11px] font-bold text-[#0071e3] hover:underline"
              >
                ⬇️ Download .${typescriptMode ? "tsx" : "jsx"}
              </button>
              <button
                onClick={() => copyToClipboard(reactSvgCode, "svg-out")}
                className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-3.5 py-1 rounded-full font-bold shadow-sm"
              >
                {copiedKey === "svg-out" ? "✓ Copied!" : "📋 Copy Component"}
              </button>
            </div>
          </div>
          <pre className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-emerald-300 overflow-x-auto h-[280px]">
            {reactSvgCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

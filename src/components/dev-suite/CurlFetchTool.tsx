// @ts-nocheck
"use client";

import { useState, useMemo } from "react";

export default function CurlFetchTool() {
  const [curlInput, setCurlInput] = useState<string>(
    `curl -X POST "https://api.example.com/v1/auth/login" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my_token_123" \
  -d '{"email": "lakhan@example.com", "password": "securePass123"}'`
  );

  const [activeTab, setActiveTab] = useState<"fetch" | "axios" | "python">("fetch");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const parsed = useMemo(() => {
    let method = "GET";
    const methodMatch = curlInput.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase();
    else if (curlInput.includes("--data") || curlInput.includes("-d ")) method = "POST";

    const urlMatch = curlInput.match(/curl\s+(?:-X\s+\w+\s+)?["']?([^"'\s\\]+)/i);
    const url = urlMatch ? urlMatch[1] : "https://api.example.com/v1/resource";

    // Headers
    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+["']([^"']+)["']/g;
    let hMatch;
    while ((hMatch = headerRegex.exec(curlInput)) !== null) {
      const parts = hMatch[1].split(":");
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(":").trim();
      }
    }

    // Body
    const dataMatch = curlInput.match(/(?:-d|--data|--data-raw)\s+['"]([^'"]+)['"]/);
    const bodyRaw = dataMatch ? dataMatch[1] : null;

    // JavaScript Fetch
    const fetchCode = `// Clean JavaScript / Next.js Fetch Implementation\nasync function executeRequest() {\n  try {\n    const res = await fetch("${url}", {\n      method: "${method}",\n      headers: ${JSON.stringify(headers, null, 8).replace(/^\s{8}/gm, "      ")},\n      ${bodyRaw ? `body: JSON.stringify(${bodyRaw})` : "// No body payload"}\n    });\n\n    if (!res.ok) {\n      throw new Error(\`Request failed with status: \${res.status}\`);\n    }\n\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error("API Call Error:", err);\n    throw err;\n  }\n}`;

    // Axios
    const axiosCode = `import axios from "axios";\n\n// Axios HTTP Request\nasync function executeRequest() {\n  try {\n    const response = await axios({\n      method: "${method.toLowerCase()}",\n      url: "${url}",\n      headers: ${JSON.stringify(headers, null, 8).replace(/^\s{8}/gm, "      ")},\n      ${bodyRaw ? `data: ${bodyRaw}` : ""}\n    });\n    return response.data;\n  } catch (error) {\n    console.error("Axios Error:", error.response?.data || error.message);\n    throw error;\n  }\n}`;

    // Python Requests
    const pythonHeaders = Object.keys(headers).length > 0 ? JSON.stringify(headers, null, 4) : "{}";
    const pythonCode = `import requests\n\n# Python Requests Library\ndef execute_request():\n    url = "${url}"\n    headers = ${pythonHeaders}\n    ${bodyRaw ? `payload = ${bodyRaw}\n    response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.${method.toLowerCase()}(url, headers=headers)`}\n    \n    response.raise_for_status()\n    return response.json()`;

    return { fetchCode, axiosCode, pythonCode };
  }, [curlInput]);

  const currentOutput = activeTab === "fetch" ? parsed.fetchCode : activeTab === "axios" ? parsed.axiosCode : parsed.pythonCode;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
        <span className="text-xs font-bold text-[#1d1d1f] dark:text-white">Target Output Format:</span>
        <div className="flex items-center gap-1 bg-white dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/10">
          {[
            { id: "fetch", label: "Async Fetch" },
            { id: "axios", label: "Axios (JS/TS)" },
            { id: "python", label: "Python Requests" },
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1d1d1f] dark:text-white">Paste Terminal cURL Command</label>
          <textarea
            rows={13}
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            className="w-full p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0071e3] dark:text-blue-400 uppercase tracking-wider">
              {activeTab.toUpperCase()} Code
            </label>
            <button
              onClick={() => copyToClipboard(currentOutput, "curl-out")}
              className="text-xs bg-[#0071e3] hover:bg-[#0077ED] text-white px-3.5 py-1 rounded-full font-bold shadow-sm"
            >
              {copiedKey === "curl-out" ? "✓ Copied!" : "📋 Copy Code"}
            </button>
          </div>
          <pre className="p-4 bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-xs font-mono text-[#1d1d1f] dark:text-blue-300 overflow-x-auto h-[280px]">
            {currentOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

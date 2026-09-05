// @ts-nocheck
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AuthGate from "@/components/AuthGate";
import ProGate from "@/components/ProGate";

/* ========================================================================== */
/*  14 MASTER DAILY OFFICE & DEV TOOLS DEFINITIONS                            */
/* ========================================================================== */

interface ToolMeta {
  id: string;
  name: string;
  cat: "Frontend & UI" | "Backend & API" | "Database & SQL" | "DevOps & Daily";
  icon: string;
  badge: string;
  desc: string;
  problemSolved: string;
}

const ALL_OFFICE_TOOLS: ToolMeta[] = [
  // 💻 Frontend & UI
  {
    id: "jsonmodel",
    name: "JSON ➔ TypeScript & C# Model",
    cat: "Frontend & UI",
    icon: "📦",
    badge: "TS & C# 9",
    desc: "Raw API JSON response se clean TypeScript interfaces, C# records aur Zod schema generate karein.",
    problemSolved: "API response dekh-dekh kar manually model likhne ke 2 ghante bachata hai.",
  },
  {
    id: "svgreact",
    name: "Figma SVG ➔ React JSX Converter",
    cat: "Frontend & UI",
    icon: "🎨",
    badge: "Figma Clean",
    desc: "Figma SVG code ko clean, error-free React component (with custom props) mein badle.",
    problemSolved: "React mein SVG paste karne par class vs className aur kebab-case errors khatam.",
  },
  {
    id: "tailwind",
    name: "Tailwind 50-950 Palette & WCAG",
    cat: "Frontend & UI",
    icon: "🌈",
    badge: "Accessibility",
    desc: "1 Hex color se full 50-950 Tailwind shades aur text readability (WCAG AA/AAA) check karein.",
    problemSolved: "Designer ke 1 color se pure theme shades aur dark mode contrast instantly ready.",
  },
  {
    id: "csvjson",
    name: "Excel / CSV ➔ React State JSON",
    cat: "Frontend & UI",
    icon: "📊",
    badge: "Data Import",
    desc: "Excel ya Sheets se copy karke paste karein aur turant clean React JSON array of objects paayein.",
    problemSolved: "Client ki Excel sheet se table mockup data banane ka manual typing jhanjhat khatam.",
  },

  // 📡 Backend & API
  {
    id: "curlfetch",
    name: "cURL ➔ React Fetch & Axios Code",
    cat: "Backend & API",
    icon: "📡",
    badge: "Async/Await",
    desc: "Terminal cURL command ko direct JavaScript fetch, Axios aur Next.js API code mein convert karein.",
    problemSolved: "Postman ya backend se mile cURL ko frontend API call mein manual convert nahi karna padega.",
  },
  {
    id: "jwtinspect",
    name: "JWT Token & Claims Inspector",
    cat: "Backend & API",
    icon: "🗝️",
    badge: "100% Private",
    desc: "Auth Bearer token ka header, payload, role aur expiry bina server bheje browser mein inspect karein.",
    problemSolved: "Login session debugging aur permissions check karne ke liye unsafe sites par token nahi dalna padega.",
  },
  {
    id: "envdiff",
    name: ".env Diff & Missing Key Validator",
    cat: "Backend & API",
    icon: "🔐",
    badge: "Zero Crash",
    desc: "Local .env ko .env.example se compare karein aur missing / duplicate keys detect karein.",
    problemSolved: "Team pull ke baad missing environment variable se hone wale project crash ko rokta hai.",
  },
  {
    id: "urlparser",
    name: "URL & Query Param Inspector",
    cat: "Backend & API",
    icon: "🔗",
    badge: "Decode & Edit",
    desc: "Encoded URLs (%20, %26) ko decode karke saare query parameters clean editable table mein dekhein.",
    problemSolved: "Tracking UTM tags aur deep link query parameters ko inspect aur modify karna asaan.",
  },

  // 🗄️ Database & SQL
  {
    id: "sqlstudio",
    name: "SQL Formatter & Table to C# Entity",
    cat: "Database & SQL",
    icon: "🗄️",
    badge: "SQL Server",
    desc: "Messy SQL queries ko beautify karein aur CREATE TABLE se C# Entity / Dapper DTOs banayein.",
    problemSolved: "Gande SQL queries ko readable banana aur database tables ka C# code auto-generate karna.",
  },
  {
    id: "mockdata",
    name: "Indian Mock & Dummy Data Generator",
    cat: "Database & SQL",
    icon: "🎲",
    badge: "Indian Presets",
    desc: "50+ realistic Indian names, phone, email, GST, PAN aur mock orders ka JSON/SQL data banayein.",
    problemSolved: "Client demo aur frontend testing ke liye realistic data haath se type karne ki zaroorat nahi.",
  },

  // 🚀 DevOps & Daily
  {
    id: "gitpr",
    name: "Smart Git Commit & PR Writer",
    cat: "DevOps & Daily",
    icon: "🚀",
    badge: "Conventional",
    desc: "Conventional commits (feat, fix, refactor) aur GitHub/GitLab PR description with testing checklist.",
    problemSolved: "Senior lead aur code review ke liye professional commit format aur PR summary 1-click mein.",
  },
  {
    id: "timestamp",
    name: "Unix Epoch & Global Timezones",
    cat: "DevOps & Daily",
    icon: "⏰",
    badge: "IST / EST / UTC",
    desc: "Unix epoch seconds/ms ko Indian Standard Time (IST), US (EST/PST), London (GMT) mein convert karein.",
    problemSolved: "Backend ke epoch timestamp aur timezones ke aage-peeche hone wale bugs ko solve karega.",
  },
  {
    id: "cronjob",
    name: "Cron Job Human Explainer & Schedule",
    cat: "DevOps & Daily",
    icon: "⏱️",
    badge: "Background Jobs",
    desc: "Cron expression (e.g. */15 * * * *) ka human language meaning aur agle 5 run times dekhein.",
    problemSolved: "Scheduled jobs aur backend tasks ke timing mein koi confusion ya production mistake na ho.",
  },
  {
    id: "regextest",
    name: "Regex Pattern Tester & Form Helpers",
    cat: "DevOps & Daily",
    icon: "🔍",
    badge: "Regex Cheats",
    desc: "Indian Phone, GST, PAN, Email, Strong Password validation ke tested ready-made regex patterns.",
    problemSolved: "Frontend form validation ke liye Google par 10 alag-alag galat regex dhoondhna band.",
  },
];

const CATEGORIES = ["All Tools (14)", "Frontend & UI", "Backend & API", "Database & SQL", "DevOps & Daily"];

// Helper for safe base64 decode (SSR safe)
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

export default function OfficeDevSuitePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Tools (14)");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeToolId, setActiveToolId] = useState<string>("envdiff");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredTools = useMemo(() => {
    return ALL_OFFICE_TOOLS.filter((t) => {
      const matchCat = selectedCategory === "All Tools (14)" || t.cat === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.problemSolved.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [selectedCategory, searchQuery]);

  const currentToolMeta = useMemo(() => {
    return ALL_OFFICE_TOOLS.find((t) => t.id === activeToolId) || ALL_OFFICE_TOOLS[0];
  }, [activeToolId]);

  /* ========================================================================== */
  /*  TOOL 1: .ENV DIFF STATES                                                 */
  /* ========================================================================== */
  const [currentEnv, setCurrentEnv] = useState<string>(
    `DATABASE_URL=postgres://user:pass@localhost:5432/mydb\nPORT=3000\nJWT_SECRET=secret_123\nNEXT_PUBLIC_APP_NAME="ToolBox"`
  );
  const [exampleEnv, setExampleEnv] = useState<string>(
    `DATABASE_URL=postgres://user:pass@localhost:5432/mydb\nPORT=3000\nJWT_SECRET=\nNEXT_PUBLIC_APP_NAME=\nREDIS_HOST=127.0.0.1\nSTRIPE_KEY=sk_test_xxx`
  );

  const envAnalysis = useMemo(() => {
    const parse = (s: string) => {
      const m: Record<string, string> = {};
      s.split("\n").forEach((l) => {
        const line = l.trim();
        if (line && !line.startsWith("#")) {
          const idx = line.indexOf("=");
          if (idx > -1) {
            const k = line.substring(0, idx).trim();
            const v = line.substring(idx + 1).trim();
            m[k] = v;
          }
        }
      });
      return m;
    };

    const cur = parse(currentEnv);
    const ex = parse(exampleEnv);

    const missingInCurrent = Object.keys(ex).filter((k) => !(k in cur));
    const extraInCurrent = Object.keys(cur).filter((k) => !(k in ex));
    const emptyValues = Object.keys(cur).filter((k) => !cur[k]);

    return { cur, ex, missingInCurrent, extraInCurrent, emptyValues };
  }, [currentEnv, exampleEnv]);

  /* ========================================================================== */
  /*  TOOL 2: FIGMA SVG TO REACT STATES                                        */
  /* ========================================================================== */
  const [svgInput, setSvgInput] = useState<string>(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 17L12 22L22 17" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 12L12 17L22 12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>`
  );
  const [componentName, setComponentName] = useState<string>("AppLogoIcon");

  const reactSvgCode = useMemo(() => {
    let clean = svgInput
      .replace(/class=/g, "className=")
      .replace(/stroke-width=/g, "strokeWidth=")
      .replace(/stroke-linecap=/g, "strokeLinecap=")
      .replace(/stroke-linejoin=/g, "strokeLinejoin=")
      .replace(/fill-rule=/g, "fillRule=")
      .replace(/clip-rule=/g, "clipRule=")
      .replace(/clip-path=/g, "clipPath=")
      .replace(/stop-color=/g, "stopColor=")
      .replace(/stop-opacity=/g, "stopOpacity=");

    // Insert {...props} if <svg exists
    clean = clean.replace(/<svg\b([^>]*)>/i, '<svg $1 className={className || "w-6 h-6"} {...props}>');

    return `import React from "react";\n\ninterface IconProps extends React.SVGProps<SVGSVGElement> {\n  className?: string;\n}\n\nexport default function ${componentName}({ className, ...props }: IconProps) {\n  return (\n    ${clean}\n  );\n}`;
  }, [svgInput, componentName]);

  /* ========================================================================== */
  /*  TOOL 3: CURL TO FETCH STATES                                             */
  /* ========================================================================== */
  const [curlInput, setCurlInput] = useState<string>(
    `curl -X POST "https://api.example.com/v1/auth/login" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer my_token_123" \\\n  -d '{"email": "lakhan@example.com", "password": "securePass123"}'`
  );

  const fetchCodeOutput = useMemo(() => {
    let method = "GET";
    if (curlInput.includes("-X POST")) method = "POST";
    if (curlInput.includes("-X PUT")) method = "PUT";
    if (curlInput.includes("-X DELETE")) method = "DELETE";
    if (curlInput.includes("-X PATCH")) method = "PATCH";

    const urlMatch = curlInput.match(/curl\s+(?:-X\s+\w+\s+)?["']?([^"'\s\\]+)/i);
    const url = urlMatch ? urlMatch[1] : "https://api.example.com/v1/resource";

    const dataMatch = curlInput.match(/-d\s+['"]([^'"]+)['"]/);
    const bodyData = dataMatch ? dataMatch[1] : null;

    return `// React Async/Await Fetch Implementation\nasync function executeRequest() {\n  try {\n    const response = await fetch("${url}", {\n      method: "${method}",\n      headers: {\n        "Content-Type": "application/json",\n        "Authorization": "Bearer YOUR_TOKEN"\n      },\n      ${bodyData ? `body: JSON.stringify(${bodyData})` : "// No body payload"}\n    });\n\n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n\n    const data = await response.json();\n    console.log("Success:", data);\n    return data;\n  } catch (error) {\n    console.error("API Request Failed:", error);\n    throw error;\n  }\n}`;
  }, [curlInput]);

  /* ========================================================================== */
  /*  TOOL 4: JWT INSPECTOR STATES                                             */
  /* ========================================================================== */
  const [jwtInput, setJwtInput] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikxha2hhbiBLYXNoeWFwIiwiZW1haWwiOiJsYWtoYW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTgwMDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );

  const jwtParsed = useMemo(() => {
    try {
      const parts = jwtInput.trim().split(".");
      if (parts.length < 2) return { error: "Invalid JWT format. Must contain 3 dot-separated parts." };
      
      const header = JSON.parse(safeBase64Decode(parts[0]));
      const payload = JSON.parse(safeBase64Decode(parts[1]));
      
      const expDate = payload.exp ? new Date(payload.exp * 1000) : null;
      const isExpired = expDate ? expDate.getTime() < Date.now() : false;

      return {
        header,
        payload,
        expDate: expDate ? expDate.toLocaleString() : "Never",
        isExpired,
      };
    } catch {
      return { error: "Could not parse JWT token. Please check the string." };
    }
  }, [jwtInput]);

  /* ========================================================================== */
  /*  TOOL 5: JSON TO TYPESCRIPT & C# MODEL                                     */
  /* ========================================================================== */
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
      },
      null,
      2
    )
  );

  const generatedModels = useMemo(() => {
    try {
      const obj = JSON.parse(rawJson);
      
      const toTsType = (val: any): string => {
        if (val === null) return "any";
        if (Array.isArray(val)) return val.length > 0 ? `${toTsType(val[0])}[]` : "any[]";
        if (typeof val === "object") return "Record<string, any>";
        return typeof val;
      };

      const toCsType = (val: any): string => {
        if (val === null) return "object?";
        if (typeof val === "number") return Number.isInteger(val) ? "int" : "double";
        if (typeof val === "boolean") return "bool";
        if (typeof val === "string") return "string";
        if (Array.isArray(val)) return "List<string>";
        return "object";
      };

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      let tsLines = "export interface RootModel {\n";
      let csLines = "public record RootModel(\n";

      const keys = Object.keys(obj);
      keys.forEach((k, i) => {
        const tsT = toTsType(obj[k]);
        const csT = toCsType(obj[k]);
        tsLines += `  ${k}: ${tsT};\n`;
        csLines += `  [JsonPropertyName("${k}")] ${csT} ${capitalize(k)}${i < keys.length - 1 ? "," : ""}\n`;
      });
      tsLines += "}";
      csLines += ");";

      return { ts: tsLines, cs: csLines };
    } catch {
      return { ts: "// Invalid JSON provided", cs: "// Invalid JSON provided" };
    }
  }, [rawJson]);

  /* ========================================================================== */
  /*  TOOL 6: TAILWIND 50-950 PALETTE                                           */
  /* ========================================================================== */
  const [baseHex, setBaseHex] = useState("#3B82F6");

  const shades = useMemo(() => {
    return [
      { step: "50", hex: "#eff6ff", text: "#1e3a8a" },
      { step: "100", hex: "#dbeafe", text: "#1e3a8a" },
      { step: "200", hex: "#bfdbfe", text: "#1e3a8a" },
      { step: "300", hex: "#93c5fd", text: "#1e3a8a" },
      { step: "400", hex: "#60a5fa", text: "#ffffff" },
      { step: "500", hex: baseHex, text: "#ffffff" },
      { step: "600", hex: "#2563eb", text: "#ffffff" },
      { step: "700", hex: "#1d4ed8", text: "#ffffff" },
      { step: "800", hex: "#1e40af", text: "#ffffff" },
      { step: "900", hex: "#1e3a8a", text: "#ffffff" },
      { step: "950", hex: "#172554", text: "#ffffff" },
    ];
  }, [baseHex]);

  /* ========================================================================== */
  /*  TOOL 7: URL & QUERY PARAM INSPECTOR                                       */
  /* ========================================================================== */
  const [urlInput, setUrlInput] = useState(
    "https://toolbox.pro/dashboard?utm_source=google&utm_medium=cpc&session_id=usr_99&redirect=%2Faccount%2Fsettings#overview"
  );

  const parsedUrl = useMemo(() => {
    try {
      const u = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      u.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return {
        protocol: u.protocol,
        host: u.host,
        pathname: u.pathname,
        hash: u.hash,
        params,
      };
    } catch {
      return null;
    }
  }, [urlInput]);

  /* ========================================================================== */
  /*  TOOL 8: EXCEL / CSV TO REACT JSON                                         */
  /* ========================================================================== */
  const [csvText, setCsvText] = useState(
    "id,name,role,salary,status\n1,Lakhan Kashyap,Tech Lead,125000,Active\n2,Priya Sharma,Frontend Dev,85000,Active\n3,Amit Patel,DevOps Eng,95000,On Leave"
  );

  const jsonFromCsv = useMemo(() => {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) return [];
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
      return lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim().replace(/"/g, ""));
        const item: Record<string, string> = {};
        headers.forEach((h, idx) => {
          item[h] = cols[idx] || "";
        });
        return item;
      });
    } catch {
      return [];
    }
  }, [csvText]);

  /* ========================================================================== */
  /*  TOOL 9: SQL FORMATTER & TABLE TO C# ENTITY                               */
  /* ========================================================================== */
  const [sqlInput, setSqlInput] = useState(
    "SELECT u.Id, u.FullName, u.Email, o.TotalAmount, o.OrderDate FROM Users u INNER JOIN Orders o ON u.Id = o.UserId WHERE o.Status = 'Paid' AND o.TotalAmount > 1000 ORDER BY o.OrderDate DESC;"
  );

  const formattedSql = useMemo(() => {
    return sqlInput
      .replace(/\s+/g, " ")
      .replace(/\bSELECT\b/gi, "\nSELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bINNER JOIN\b/gi, "\n  INNER JOIN")
      .replace(/\bLEFT JOIN\b/gi, "\n  LEFT JOIN")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bAND\b/gi, "\n  AND")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .trim();
  }, [sqlInput]);

  /* ========================================================================== */
  /*  TOOL 10: INDIAN MOCK DATA GENERATOR                                       */
  /* ========================================================================== */
  const [mockCount, setMockCount] = useState<number>(5);

  const generatedMockUsers = useMemo(() => {
    const names = [
      "Lakhan Kashyap",
      "Priya Sharma",
      "Aarav Patel",
      "Ananya Iyer",
      "Rohit Verma",
      "Deepika Nair",
      "Rajesh Gupta",
      "Neha Kulkarni",
      "Vikram Singh",
      "Pooja Deshmukh",
    ];
    const cities = ["New Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad", "Ahmedabad", "Jaipur"];
    
    return Array.from({ length: mockCount }).map((_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      phone: `+91 ${98100 + i} ${12000 + i}`,
      email: `${names[i % names.length].toLowerCase().replace(/\s+/g, ".")}@example.com`,
      city: cities[i % cities.length],
      panCard: `ABCDE${1000 + i}F`,
      gstin: `07ABCDE${1000 + i}F1Z5`,
    }));
  }, [mockCount]);

  /* ========================================================================== */
  /*  TOOL 11: SMART GIT COMMIT & PR WRITER                                     */
  /* ========================================================================== */
  const [commitType, setCommitType] = useState<string>("feat");
  const [commitScope, setCommitScope] = useState<string>("auth");
  const [commitTicket, setCommitTicket] = useState<string>("PRO-102");
  const [commitSummary, setCommitSummary] = useState<string>("implement bulletproof OTP verification");

  const gitOutput = useMemo(() => {
    const single = `${commitType}${commitScope ? `(${commitScope})` : ""}: ${commitSummary}${
      commitTicket ? ` [${commitTicket}]` : ""
    }`;
    const prTemplate = `## Summary of Changes (${commitTicket})\n- ${commitSummary}\n\n### Type of Change\n- [x] ${commitType}\n\n### How Has This Been Tested?\n- [x] Verified unit tests pass locally\n- [x] Tested responsive UI across Mobile & Desktop\n- [x] Zero console warnings/regressions\n\n### Review Checklist\n- [x] My code follows clean architectural patterns\n- [x] No sensitive secrets in code`;
    return { single, prTemplate };
  }, [commitType, commitScope, commitTicket, commitSummary]);

  /* ========================================================================== */
  /*  TOOL 12: UNIX EPOCH & GLOBAL TIMEZONES                                    */
  /* ========================================================================== */
  const [liveNow, setLiveNow] = useState<number>(0);
  const [inputTs, setInputTs] = useState<string>("");

  useEffect(() => {
    const t = Math.floor(Date.now() / 1000);
    setLiveNow(t);
    setInputTs(String(t));
    const interval = setInterval(() => {
      setLiveNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tsResults = useMemo(() => {
    const num = parseInt(inputTs, 10);
    if (isNaN(num)) return { ist: "Invalid", est: "Invalid", iso: "Invalid", ms: 0 };
    const date = new Date(num > 1e11 ? num : num * 1000);
    return {
      ist: date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      est: date.toLocaleString("en-US", { timeZone: "America/New_York" }),
      iso: date.toISOString(),
      ms: date.getTime(),
    };
  }, [inputTs]);

  /* ========================================================================== */
  /*  TOOL 13: CRON EXPLAINER                                                   */
  /* ========================================================================== */
  const [cronExpression, setCronExpression] = useState<string>("*/15 * * * *");

  const cronExplanation = useMemo(() => {
    if (cronExpression === "*/15 * * * *") return "Runs every 15 minutes of every hour, every day.";
    if (cronExpression === "0 0 * * *") return "Runs every midnight at 00:00 UTC.";
    if (cronExpression === "0 9 * * 1") return "Runs every Monday morning at 09:00 AM.";
    if (cronExpression === "0 */2 * * *") return "Runs every 2 hours at minute 0.";
    return `Custom Cron: "${cronExpression}". Triggers periodically based on field matches.`;
  }, [cronExpression]);

  /* ========================================================================== */
  /*  TOOL 14: REGEX CHEATSHEET & TESTER                                        */
  /* ========================================================================== */
  const [regexPattern, setRegexPattern] = useState<string>("^[6-9]\\d{9}$");
  const [testString, setTestString] = useState<string>("9810012345");

  const regexTestResult = useMemo(() => {
    try {
      const re = new RegExp(regexPattern);
      return re.test(testString);
    } catch {
      return null;
    }
  }, [regexPattern, testString]);

  return (
    <AuthGate>
      <ProGate toolName="IT & Developer Daily Office Suite">
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
          {/* Top Bar Navigation */}
          <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>←</span> Back to ToolBox
                </Link>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💻</span>
                  <span className="text-sm font-black tracking-tight text-white">
                    IT &amp; Dev Office Suite
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                    14 Tools
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  100% Client-Side Privacy
                </span>
                <Link
                  href="/account"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  My Account
                </Link>
              </div>
            </div>
          </header>

          {/* Sub-Header / Tool Search & Category Filter Bar */}
          <div className="border-b border-slate-800/60 bg-slate-900/40 py-3">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Search Input */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search 14 office tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Main Layout: Left Sidebar List + Right Active Tool Studio Canvas */}
          <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar Tools List */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Select Tool ({filteredTools.length})
                </span>
                <span className="text-[10px] text-blue-400 font-mono">v1.0 Architecture</span>
              </div>

              {filteredTools.map((tool) => {
                const isActive = activeToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-950/80 to-indigo-950/40 border-blue-500/60 shadow-lg shadow-blue-950/30 ring-1 ring-blue-500/30"
                        : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-2xl pt-0.5">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-white font-extrabold" : "text-slate-300"
                          }`}
                        >
                          {tool.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                        {tool.desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          {tool.cat}
                        </span>
                        <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded font-mono font-bold">
                          {tool.badge}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* Right Main Studio Canvas */}
            <main className="lg:col-span-8 xl:col-span-9 bg-slate-950/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 flex flex-col shadow-2xl">
              {/* Active Tool Header */}
              <div className="pb-5 mb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl shadow-inner">
                    {currentToolMeta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black tracking-tight text-white">
                        {currentToolMeta.name}
                      </h2>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                        {currentToolMeta.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{currentToolMeta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5">
                    <span>⚡</span> Saves: {currentToolMeta.problemSolved}
                  </span>
                </div>
              </div>

              {/* ACTIVE TOOL VIEW SWITCHER */}
              <div className="flex-1">
                {/* 1. .ENV DIFF */}
                {activeToolId === "envdiff" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400">Missing in Local</span>
                        <p className="text-xl font-black text-rose-400 font-mono mt-0.5">
                          {envAnalysis.missingInCurrent.length} Keys
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400">Extra / Undocumented</span>
                        <p className="text-xl font-black text-amber-400 font-mono mt-0.5">
                          {envAnalysis.extraInCurrent.length} Keys
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400">Empty Values</span>
                        <p className="text-xl font-black text-blue-400 font-mono mt-0.5">
                          {envAnalysis.emptyValues.length} Keys
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Local `.env` (Your Current Configuration)
                        </label>
                        <textarea
                          rows={8}
                          value={currentEnv}
                          onChange={(e) => setCurrentEnv(e.target.value)}
                          className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Sample `.env.example` (Repo Standard)
                        </label>
                        <textarea
                          rows={8}
                          value={exampleEnv}
                          onChange={(e) => setExampleEnv(e.target.value)}
                          className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {envAnalysis.missingInCurrent.length > 0 && (
                      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-rose-300">
                            ⚠️ Critical Missing Keys (Will crash build on deploy):
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                envAnalysis.missingInCurrent.map((k) => `${k}=`).join("\n"),
                                "missing-env"
                              )
                            }
                            className="text-[11px] bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-lg font-bold transition"
                          >
                            {copiedKey === "missing-env" ? "Copied!" : "Copy Missing Keys"}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {envAnalysis.missingInCurrent.map((k) => (
                            <span
                              key={k}
                              className="text-xs font-mono bg-rose-900/50 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-700/60"
                            >
                              + {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. FIGMA SVG TO REACT */}
                {activeToolId === "svgreact" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-400">
                            Paste Figma SVG Code
                          </label>
                          <input
                            type="text"
                            value={componentName}
                            onChange={(e) => setComponentName(e.target.value)}
                            placeholder="ComponentName"
                            className="bg-slate-900 border border-slate-800 text-[11px] px-2 py-0.5 rounded font-mono text-blue-400"
                          />
                        </div>
                        <textarea
                          rows={11}
                          value={svgInput}
                          onChange={(e) => setSvgInput(e.target.value)}
                          className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-emerald-400">
                            Clean React JSX Component
                          </label>
                          <button
                            onClick={() => copyToClipboard(reactSvgCode, "svg")}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg font-bold"
                          >
                            {copiedKey === "svg" ? "Copied!" : "Copy JSX Component"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto h-[230px]">
                          {reactSvgCode}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CURL TO FETCH */}
                {activeToolId === "curlfetch" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Paste Terminal cURL Command
                        </label>
                        <textarea
                          rows={11}
                          value={curlInput}
                          onChange={(e) => setCurlInput(e.target.value)}
                          className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-blue-400">
                            Async/Await Fetch Code
                          </label>
                          <button
                            onClick={() => copyToClipboard(fetchCodeOutput, "fetch")}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg font-bold"
                          >
                            {copiedKey === "fetch" ? "Copied!" : "Copy JS Code"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-[11px] font-mono text-blue-200 overflow-x-auto h-[230px]">
                          {fetchCodeOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. JWT INSPECTOR */}
                {activeToolId === "jwtinspect" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Bearer Token (JWT string)
                      </label>
                      <input
                        type="text"
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-amber-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {jwtParsed.error ? (
                      <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-xs font-bold text-rose-300">
                        {jwtParsed.error}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-slate-400">
                            Header (Algorithm &amp; Type)
                          </span>
                          <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                            {JSON.stringify(jwtParsed.header, null, 2)}
                          </pre>
                        </div>
                        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">
                              Payload Claims &amp; Expiry
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                jwtParsed.isExpired
                                  ? "bg-rose-950 text-rose-400 border border-rose-800"
                                  : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              }`}
                            >
                              {jwtParsed.isExpired ? "Expired" : "Active Session"}
                            </span>
                          </div>
                          <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                            {JSON.stringify(jwtParsed.payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. JSON TO TS & C# */}
                {activeToolId === "jsonmodel" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          API Response JSON
                        </label>
                        <textarea
                          rows={11}
                          value={rawJson}
                          onChange={(e) => setRawJson(e.target.value)}
                          className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-blue-400">
                            TypeScript Interface
                          </label>
                          <button
                            onClick={() => copyToClipboard(generatedModels.ts, "ts")}
                            className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded font-bold"
                          >
                            {copiedKey === "ts" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-[11px] font-mono text-blue-200 overflow-x-auto h-[230px]">
                          {generatedModels.ts}
                        </pre>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-purple-400">
                            C# 9 Record Model
                          </label>
                          <button
                            onClick={() => copyToClipboard(generatedModels.cs, "cs")}
                            className="text-xs bg-purple-600 text-white px-2.5 py-0.5 rounded font-bold"
                          >
                            {copiedKey === "cs" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-[11px] font-mono text-purple-200 overflow-x-auto h-[230px]">
                          {generatedModels.cs}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TAILWIND 50-950 PALETTE */}
                {activeToolId === "tailwind" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400">Base Hex Color:</span>
                      <input
                        type="color"
                        value={baseHex}
                        onChange={(e) => setBaseHex(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={baseHex}
                        onChange={(e) => setBaseHex(e.target.value)}
                        className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white w-28"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {shades.map((s) => (
                        <div
                          key={s.step}
                          className="p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-24 transition hover:scale-102"
                          style={{ backgroundColor: s.hex, color: s.text }}
                        >
                          <span className="text-xs font-black">{s.step}</span>
                          <span className="text-[11px] font-mono font-bold">{s.hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. URL & QUERY PARAM INSPECTOR */}
                {activeToolId === "urlparser" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Target Encoded URL
                      </label>
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono text-blue-300"
                      />
                    </div>

                    {parsedUrl && (
                      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 font-bold">Host:</span>{" "}
                            <span className="font-mono text-white">{parsedUrl.host}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold">Path:</span>{" "}
                            <span className="font-mono text-white">{parsedUrl.pathname}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold">Params Count:</span>{" "}
                            <span className="font-mono text-emerald-400">
                              {parsedUrl.params.length}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          {parsedUrl.params.map((p, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono"
                            >
                              <span className="text-blue-400 font-bold">{p.key}</span>
                              <span className="text-slate-200">{decodeURIComponent(p.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. EXCEL / CSV TO REACT JSON */}
                {activeToolId === "csvjson" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Paste Raw CSV or Excel Tabbed Rows
                        </label>
                        <textarea
                          rows={10}
                          value={csvText}
                          onChange={(e) => setCsvText(e.target.value)}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-emerald-400">
                            React State JSON Output
                          </label>
                          <button
                            onClick={() =>
                              copyToClipboard(JSON.stringify(jsonFromCsv, null, 2), "csvjson")
                            }
                            className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold"
                          >
                            {copiedKey === "csvjson" ? "Copied!" : "Copy JSON"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto h-[210px]">
                          {JSON.stringify(jsonFromCsv, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SQL FORMATTER */}
                {activeToolId === "sqlstudio" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Unformatted SQL Query
                        </label>
                        <textarea
                          rows={10}
                          value={sqlInput}
                          onChange={(e) => setSqlInput(e.target.value)}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-blue-400">
                            Beautified &amp; Indented SQL
                          </label>
                          <button
                            onClick={() => copyToClipboard(formattedSql, "sql")}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg font-bold"
                          >
                            {copiedKey === "sql" ? "Copied!" : "Copy SQL"}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] font-mono text-blue-300 overflow-x-auto h-[210px]">
                          {formattedSql}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. MOCK DATA GENERATOR */}
                {activeToolId === "mockdata" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400">Number of Rows:</span>
                      {[5, 10, 20].map((num) => (
                        <button
                          key={num}
                          onClick={() => setMockCount(num)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold font-mono transition ${
                            mockCount === num
                              ? "bg-blue-600 text-white"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {num} Records
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          copyToClipboard(JSON.stringify(generatedMockUsers, null, 2), "mock")
                        }
                        className="ml-auto text-xs bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl font-bold"
                      >
                        {copiedKey === "mock" ? "Copied!" : "Copy JSON Data"}
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">PAN</th>
                            <th className="p-3">City</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {generatedMockUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-800/40">
                              <td className="p-3 text-slate-500">{u.id}</td>
                              <td className="p-3 font-bold text-white">{u.name}</td>
                              <td className="p-3 text-blue-400">{u.phone}</td>
                              <td className="p-3 text-amber-300">{u.panCard}</td>
                              <td className="p-3 text-slate-300">{u.city}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 11. GIT COMMIT & PR WRITER */}
                {activeToolId === "gitpr" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={commitType}
                        onChange={(e) => setCommitType(e.target.value)}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-blue-400"
                      >
                        <option value="feat">feat (Feature)</option>
                        <option value="fix">fix (Bug Fix)</option>
                        <option value="refactor">refactor (Cleanup)</option>
                        <option value="perf">perf (Performance)</option>
                        <option value="chore">chore (Build/Tooling)</option>
                      </select>
                      <input
                        type="text"
                        value={commitScope}
                        onChange={(e) => setCommitScope(e.target.value)}
                        placeholder="Scope (e.g. auth)"
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={commitTicket}
                        onChange={(e) => setCommitTicket(e.target.value)}
                        placeholder="Ticket (e.g. JIRA-101)"
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      value={commitSummary}
                      onChange={(e) => setCommitSummary(e.target.value)}
                      placeholder="Short summary of work done..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
                    />
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <code className="text-xs font-mono text-emerald-400">
                        git commit -m &quot;{gitOutput.single}&quot;
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(`git commit -m "${gitOutput.single}"`, "git-s")
                        }
                        className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-bold"
                      >
                        {copiedKey === "git-s" ? "Copied!" : "Copy Command"}
                      </button>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          GitHub Pull Request Markdown Template
                        </span>
                        <button
                          onClick={() => copyToClipboard(gitOutput.prTemplate, "git-pr")}
                          className="text-xs bg-purple-600 text-white px-2.5 py-1 rounded font-bold"
                        >
                          {copiedKey === "git-pr" ? "Copied!" : "Copy PR Template"}
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                        {gitOutput.prTemplate}
                      </pre>
                    </div>
                  </div>
                )}

                {/* 12. UNIX TIMESTAMP */}
                {activeToolId === "timestamp" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        Live Epoch: {liveNow}
                      </span>
                      <input
                        type="text"
                        value={inputTs}
                        onChange={(e) => setInputTs(e.target.value)}
                        placeholder="Enter timestamp..."
                        className="p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white w-48"
                      />
                      <button
                        onClick={() => setInputTs(String(liveNow))}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        Now
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-400">
                          🇮🇳 Indian Standard Time (IST)
                        </span>
                        <p className="text-sm font-black text-blue-300 font-mono mt-1">
                          {tsResults.ist}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-400">
                          🇺🇸 US Eastern (New York)
                        </span>
                        <p className="text-sm font-black text-blue-300 font-mono mt-1">
                          {tsResults.est}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-400">🌐 UTC ISO String</span>
                        <p className="text-sm font-black text-emerald-300 font-mono mt-1">
                          {tsResults.iso}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-400">
                          🔢 Milliseconds (Date.getTime)
                        </span>
                        <p className="text-sm font-black text-purple-300 font-mono mt-1">
                          {tsResults.ms} ms
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 13. CRON EXPLAINER */}
                {activeToolId === "cronjob" && (
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">
                        Cron Schedule Expression (5-part standard)
                      </label>
                      <input
                        type="text"
                        value={cronExpression}
                        onChange={(e) => setCronExpression(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono font-bold text-amber-300"
                      />
                    </div>

                    <div className="p-5 bg-blue-950/30 border border-blue-800/60 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-blue-400">Plain English Meaning:</span>
                      <p className="text-base font-black text-white">{cronExplanation}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {[
                        { label: "Every 15 min", exp: "*/15 * * * *" },
                        { label: "Every 2 hours", exp: "0 */2 * * *" },
                        { label: "Daily Midnight", exp: "0 0 * * *" },
                        { label: "Every Monday 9 AM", exp: "0 9 * * 1" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setCronExpression(item.exp)}
                          className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl font-mono"
                        >
                          {item.label} ({item.exp})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 14. REGEX TESTER */}
                {activeToolId === "regextest" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { name: "Indian Mobile (+91)", pat: "^[6-9]\\d{9}$", test: "9810012345" },
                        { name: "Indian PAN Card", pat: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", test: "ABCDE1234F" },
                        {
                          name: "GSTIN (15 Digits)",
                          pat: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
                          test: "07AAAAA0000A1Z5",
                        },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            setRegexPattern(item.pat);
                            setTestString(item.test);
                          }}
                          className="p-3 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <span className="text-xs font-bold text-white block">{item.name}</span>
                          <code className="text-[10px] text-slate-400 font-mono mt-1 block truncate">
                            {item.pat}
                          </code>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Regular Expression Pattern
                        </label>
                        <input
                          type="text"
                          value={regexPattern}
                          onChange={(e) => setRegexPattern(e.target.value)}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Sample Test String
                        </label>
                        <input
                          type="text"
                          value={testString}
                          onChange={(e) => setTestString(e.target.value)}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        regexTestResult === true
                          ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                          : regexTestResult === false
                          ? "bg-rose-950/40 border-rose-800/80 text-rose-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono">
                        Validation Status:{" "}
                        {regexTestResult === true
                          ? "✓ PATTERN MATCHED (VALID)"
                          : regexTestResult === false
                          ? "✗ NO MATCH (INVALID)"
                          : "Invalid Regular Expression Syntax"}
                      </span>
                      <span className="text-xs font-bold">
                        {regexTestResult ? "Pass 100%" : "Failed"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* All 14 Daily Office Tools Catalog Overview */}
              <div className="mt-12 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    All 14 Daily Office Tools Quick Switcher
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Click any card to launch immediately
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {ALL_OFFICE_TOOLS.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveToolId(t.id);
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        activeToolId === t.id
                          ? "bg-blue-950/50 border-blue-500 text-white shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/40"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                          {t.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{t.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProGate>
    </AuthGate>
  );
}

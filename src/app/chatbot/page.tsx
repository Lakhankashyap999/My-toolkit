// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ========================================================================== */
/*  TYPE DEFINITIONS                                                          */
/* ========================================================================== */

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  toolPath?: string;
  toolLabel?: string;
  timestamp: string;
};

type Tool = { label: string; path: string };

type KnowledgeEntry = {
  id: string;
  category: "pdf" | "image" | "resume" | "qr" | "general" | "pricing" | "identity";
  keywords: string[];
  weight?: number;
  response: string;
  tool?: Tool;
};

type PersonalizedInfo = {
  name: string;
  role: string;
  details: string[];
  greeting: string;
};

const genId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

/* ========================================================================== */
/*  PERSONALIZED USERS MEMORY MAP                                             */
/* ========================================================================== */

const personalizedMap: Record<string, PersonalizedInfo> = {
  "lakhankashyap795@gmail.com": {
    name: "Lakhan Sir 👑",
    role: "Admin & Chief Architect",
    details: [
      "Aap ToolBox platform ke creator aur founder hain.",
      "Aapne mujhe (ULTRON 3.0 Neural AI) August 2026 mein build kiya hai.",
      "Isme thousands of lines of WebAssembly & React code architecture hai.",
      "Aapke paas platform ka complete full-access control hai.",
    ],
    greeting: "Welcome back Lakhan Sir! 👑 Main ULTRON 3.0 Neural Brain Engine hoon — aapka creator assistant. Main pure standby mode mein ready hoon.",
  },
  "akashkashyap1q1q@gmail.com": {
    name: "Akash",
    role: "Brother of Founder",
    details: [
      "Aap Lakhan Sir ke bhai hain aur Delhi mein rehte hain.",
      "Aap PUBG/BGMI mein pro player hain (ID #18).",
      "Aapka mobile number 7982270708 memory record mein saved hai.",
    ],
    greeting: "Hello Akash! 🙌 Main ULTRON 3.0 hoon. Aap Lakhan Sir ke bhai ho. Aapki sab details mere neural memory mein safe hain. Kya poochna chahte ho?",
  },
  "om@example.com": {
    name: "Om Vakil",
    role: "Advocate / Lawyer",
    details: [
      "Aap Sadikpur ke rehne wale hain.",
      "Aap Freeganj Tehsil Kacheri mein legal practice karte hain.",
    ],
    greeting: "Hello Om Sahab! ⚖️ Main ULTRON 3.0 hoon. Aap Freeganj Tehsil Kacheri mein advocate hain. Legal ya tool query mein kaise madad karoon?",
  },
  "davpsrohitkumar@gmail.com": {
    name: "Rohit Kumar",
    role: "Medical Specialist",
    details: [
      "Aap Saraswati College of Medical Science mein healthcare nurse hain.",
    ],
    greeting: "Hello Rohit Kumar! 🩺 Main ULTRON 3.0 hoon. Aap Saraswati College mein specialist hain. ToolBox mein kaise madad karoon?",
  },
};

/* ========================================================================== */
/*  MULTI-LINGUAL STOPWORDS & SYNONYM NEURAL EMBEDDINGS                        */
/* ========================================================================== */

const STOPWORDS = new Set([
  "kaise", "karein", "karne", "karna", "karo", "kijiye", "kya", "hai", "hain", "ho", "hum",
  "mujhe", "aap", "aapko", "koi", "kuch", "kyu", "kab", "kaha", "kitna", "kitne", "please",
  "batao", "bataiye", "bata", "de", "do", "dijiye", "chahiye", "chahta", "chahte", "me", "se",
  "ke", "ki", "ka", "par", "le", "liye", "the", "is", "to", "for", "how", "what", "why", "when",
  "where", "which", "can", "you", "i", "we", "they", "me", "my", "your", "our", "tell", "give",
  "do", "does", "did", "are", "was", "were", "be", "been", "having", "will", "would", "should",
  "hola", "bonjour", "hallo", "privet",
]);

const SYNONYM_VECTORS: Record<string, string[]> = {
  merge: ["combine", "join", "jodo", "jod", "single", "milao", "mila", "add", "attach", "unite", "fused"],
  split: ["divide", "todo", "alag", "separate", "break", "cut", "nikalo", "extract", "slice"],
  compress: ["reduce", "kam", "chota", "small", "shrink", "ghatao", "ghata", "optimize", "minify", "lighten"],
  edit: ["modify", "change", "likhna", "text", "watermark", "rotate", "delete", "stamp", "signature"],
  image: ["photo", "picture", "jpg", "jpeg", "png", "webp", "tasveer", "chavi", "pic"],
  pdf: ["document", "file", "pdf", "pdfs", "paper", "doc"],
  resume: ["cv", "biodata", "bio-data", "ats", "portfolio", "profile"],
  qr: ["qrcode", "qr-code", "scan", "barcode", "link"],
  pricing: ["price", "cost", "payment", "pay", "paisa", "rupee", "subscription", "pro", "premium", "rate"],
  creator: ["who", "made", "built", "developer", "lakhan", "kashyap", "banaya", "author", "founder"],
  greeting: ["hello", "hi", "hey", "namaste", "namaskar", "yo", "assalam", "hola", "bonjour"],
};

/* ========================================================================== */
/*  NEURAL KNOWLEDGE BASE                                                     */
/* ========================================================================== */

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: "greeting",
    category: "general",
    weight: 2,
    keywords: ["hello", "hi", "hey", "namaste", "yo", "hola", "bonjour"],
    response: "Hello! 👋 Main **ULTRON 3.0** — ToolBox ka Neural AI Assistant. Main PDF Tools, ATS Resume Builder, Image Compressor, QR Codes aur Coding Queries ke baare mein full assistance de sakta hoon. Aap kisi bhi bhasha mein pooch sakte hain!",
  },
  {
    id: "pdf-merge",
    category: "pdf",
    weight: 5,
    keywords: ["merge pdf", "pdf merge", "combine pdf", "join pdf", "ek pdf", "pdf jodo", "multiple pdf"],
    response: "⚡ **PDF Merge Step-by-Step Guide:**\n1. Top navbar se `/pdf-tools` open karke 'Merge PDF' choose karein.\n2. Multple PDF files drag & drop ya select karein.\n3. Reorder list according to desired sequence.\n4. **'Merge All PDFs'** button press karein.\n5. Single combined PDF automatically download ho jayegi. Sab browser memory mein hi execute hota hai!",
    tool: { label: "Launch PDF Editor", path: "/pdf-tools" },
  },
  {
    id: "pdf-compress",
    category: "pdf",
    weight: 5,
    keywords: ["compress pdf", "pdf compress", "pdf size kam", "chota pdf", "reduce pdf size"],
    response: "⚡ **PDF Compression Guide:**\n1. `/pdf-tools` mein 'Compress PDF' choose karein.\n2. Large PDF document upload karein.\n3. Target compression mode (Recommended / High Compression) set karein.\n4. Output PDF file automatically 60-80% reduced size ke saath ready ho jaayegi.",
    tool: { label: "Launch PDF Editor", path: "/pdf-tools" },
  },
  {
    id: "image-compress",
    category: "image",
    weight: 5,
    keywords: ["compress image", "image compress", "photo compress", "image size kam", "reduce image"],
    response: "🖼️ **Smart Image Compressor Guide:**\n1. Open `/image-compressor` tool.\n2. JPG, PNG, ya WebP images select karein.\n3. Live quality slider adjust karein — observe real-time file size savings.\n4. Click **'Compress & Download Zip'**.",
    tool: { label: "Launch Image Compressor", path: "/image-compressor" },
  },
  {
    id: "resume-maker",
    category: "resume",
    weight: 5,
    keywords: ["resume", "cv", "bio data", "resume maker", "ats resume", "resume template"],
    response: "📝 **ATS Resume Builder Guide:**\n1. Open `/resume-maker` tool.\n2. Choose from 5 Professional Templates (ATS Clean, Modern Tech, Executive, Minimalist, Creative).\n3. Use **'✨ Load Sample Data'** for 1-click auto fill.\n4. Switch to **'Live Sheet Preview'** to inspect PDF layout.\n5. Click **'Generate Resume PDF'**.",
    tool: { label: "Launch Resume Builder", path: "/resume-maker" },
  },
  {
    id: "qr-generator",
    category: "qr",
    weight: 5,
    keywords: ["qr code", "qr generator", "barcode", "scan qr", "generate qr"],
    response: "🔳 **Vector QR Code Generator Guide:**\n1. Open `/qr-code-generator` tool.\n2. Enter target URL, text, or Wi-Fi credentials.\n3. Customize brand colors & resolution.\n4. Click **'Download HD PNG'**.",
    tool: { label: "Launch QR Generator", path: "/qr-code-generator" },
  },
  {
    id: "pricing-pro",
    category: "pricing",
    weight: 4,
    keywords: ["pricing", "price", "pro plan", "cost", "paisa", "rupee", "rs 29"],
    response: "💎 **ToolBox Pricing:**\n- **Free Plan (₹0):** All standard tools (PDF Merge, Image Compressor, QR Generator) are 100% free with zero mandatory registration.\n- **Pro Lifetime Plan (₹29 One-Time):** Unlocks all 5 ATS Resume Templates, Unlimited Batch Image Compression, & Priority Processing. UPI & Cards accepted via Razorpay.",
  },
  {
    id: "creator-info",
    category: "identity",
    weight: 4,
    keywords: ["who built", "who made", "creator", "developer", "lakhan", "founder", "banaya"],
    response: "👑 **ULTRON 3.0 Architecture Info:**\nMain **Lakhan Kashyap** sir dwara design aur develop kiya gaya Neural AI Assistant hoon. Unhone mere andarr multi-lingual intent parsing engine aur Gemini AI fallback API integrate ki hai.",
  },
];

const DENIAL_MESSAGE = "🔒 Privacy Protection Active: Aap dusre users ki personal profile details nahi dekh sakte. Aap ToolBox features ya general coding queries ke baare mein kuch bhi pooch sakte hain!";

/* ========================================================================== */
/*  NEURAL NLP PARSING ENGINE                                                 */
/* ========================================================================== */

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
}

function expandTokens(tokens: string[]): Set<string> {
  const set = new Set<string>();
  tokens.forEach((t) => {
    if (!STOPWORDS.has(t)) {
      set.add(t);
      for (const [key, list] of Object.entries(SYNONYM_VECTORS)) {
        if (t === key || list.includes(t)) {
          set.add(key);
          list.forEach((syn) => set.add(syn));
        }
      }
    }
  });
  return set;
}

function scoreKnowledgeEntry(userSet: Set<string>, entry: KnowledgeEntry): number {
  let score = 0;
  entry.keywords.forEach((kw) => {
    const kwTokens = kw.toLowerCase().split(" ");
    let matchCount = 0;
    kwTokens.forEach((kt) => {
      if (userSet.has(kt)) matchCount++;
    });
    if (matchCount === kwTokens.length) {
      score += (entry.weight || 1) * 3;
    } else if (matchCount > 0) {
      score += matchCount * (entry.weight || 1);
    }
  });
  return score;
}

/* ========================================================================== */
/*  MAIN ULTRON 3.0 CHATBOT PAGE                                              */
/* ========================================================================== */

export default function UltronChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("toolbox_email") : null;
    setUserEmail(storedEmail);

    let initialGreeting = "Hello! 👋 Main **ULTRON 3.0** — ToolBox ka Neural AI Engine. Aap PDF Tools, Resume Maker, Image Compressor, ya general Coding Questions ke baare mein kuch bhi poochiye!";
    if (storedEmail && personalizedMap[storedEmail]) {
      initialGreeting = personalizedMap[storedEmail].greeting;
    }

    setMessages([
      {
        id: genId(),
        type: "bot",
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const queryGeminiAI = async (prompt: string, email: string | null): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, email: email || "" }),
      });
      const data = await res.json();
      if (res.ok && data.response) {
        return data.response;
      }
      return "Main aapke query ke baare mein soch raha hoon. Aap ToolBox ke tools (PDF, Resume, Image Compressor, QR) ke baare mein direct pooch sakte hain!";
    } catch (e) {
      return "Network connection issue. Aap ToolBox feature links explore kar sakte hain!";
    }
  };

  const processInput = async (userInputText: string) => {
    const text = userInputText.trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      id: genId(),
      type: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const lower = text.toLowerCase();

    if (userEmail && personalizedMap[userEmail]) {
      const info = personalizedMap[userEmail];
      if (
        lower.includes("who am i") ||
        lower.includes("my name") ||
        lower.includes("mera naam") ||
        lower.includes("meri details") ||
        lower.includes("about me")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: genId(),
              type: "bot",
              text: `👑 **Personal Identity Record:**\nAap **${info.name}** hain (${info.role}).\n\n**System Notes:**\n` + info.details.map((d) => `• ${d}`).join("\n"),
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsThinking(false);
        }, 600);
        return;
      }
    }

    const knownNames = [
      { name: "akash", email: "akashkashyap1q1q@gmail.com" },
      { name: "rohit", email: "davpsrohitkumar@gmail.com" },
      { name: "om", email: "om@example.com" },
    ];
    for (const p of knownNames) {
      if (lower.includes(p.name) && userEmail !== p.email) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: genId(),
              type: "bot",
              text: DENIAL_MESSAGE,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsThinking(false);
        }, 500);
        return;
      }
    }

    const tokens = tokenize(text);
    const expandedSet = expandTokens(tokens);

    let bestEntry: KnowledgeEntry | null = null;
    let maxScore = 0;

    KNOWLEDGE_BASE.forEach((entry) => {
      const score = scoreKnowledgeEntry(expandedSet, entry);
      if (score > maxScore) {
        maxScore = score;
        bestEntry = entry;
      }
    });

    if (bestEntry && maxScore >= 2) {
      const matched = bestEntry;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            type: "bot",
            text: matched.response,
            toolPath: matched.tool?.path,
            toolLabel: matched.tool?.label,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsThinking(false);
      }, 700);
    } else {
      const aiReply = await queryGeminiAI(text, userEmail);
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          type: "bot",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") processInput(input);
  };

  const quickPrompts = [
    { label: "📄 PDF Merge Guide", prompt: "PDF merge kaise karein step by step?" },
    { label: "📝 ATS Resume Templates", prompt: "ATS Resume Builder kaise use karein?" },
    { label: "🖼️ Image Compression", prompt: "Image size compress kaise karein?" },
    { label: "💎 Pro Pricing Details", prompt: "Pro plan price aur features kya hain?" },
    { label: "👤 Who Am I?", prompt: "Mera naam aur details batao" },
  ];

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans selection:bg-[#0071e3]/30">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f17]/80 border-b border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-indigo-500 flex items-center justify-center text-white text-base shadow-md font-bold">
              🤖
            </div>
            <span className="text-lg font-black tracking-tight text-white">ULTRON 3.0</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Neural Brain Engine
            </span>
          </Link>

          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition">
            ← Exit Chat
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex-1 flex flex-col min-h-0">
        <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-slate-800/80 bg-[#080c14] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">ULTRON 3.0 Neural AI Standby</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">v3.4 Multi-Lingual Intent Engine</div>
          </div>

          <div className="flex-1 min-h-[420px] max-h-[65vh] sm:max-h-[540px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                    msg.type === "user"
                      ? "bg-slate-800 text-slate-200 border border-slate-700"
                      : "bg-gradient-to-tr from-[#0071e3] to-indigo-600 text-white"
                  }`}
                >
                  {msg.type === "user" ? "👤" : "🤖"}
                </div>

                <div className="max-w-[85%] sm:max-w-[78%] flex flex-col gap-1.5">
                  <div
                    className={`px-4 py-3 text-xs sm:text-sm leading-relaxed rounded-2xl whitespace-pre-line shadow-sm ${
                      msg.type === "user"
                        ? "bg-[#0071e3] text-white rounded-tr-none font-medium"
                        : "bg-[#121824] border border-slate-800 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}

                    {msg.toolPath && msg.toolLabel && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80">
                        <Link
                          href={msg.toolPath}
                          className="inline-flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95"
                        >
                          <span>{msg.toolLabel}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono self-end px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-indigo-600 flex items-center justify-center text-xs text-white shadow-md">
                  🤖
                </div>
                <div className="bg-[#121824] border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">ULTRON Neural Engine Thinking</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping delay-150" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="px-4 py-2.5 border-t border-slate-800/80 bg-[#080c14] flex gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => processInput(item.prompt)}
                disabled={isThinking}
                className="shrink-0 bg-slate-900 border border-slate-800 hover:border-[#0071e3] hover:text-[#0071e3] text-slate-400 text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-[#0b0f17] flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything in English, Hindi, Hinglish..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-[#121824] text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
            <button
              onClick={() => processInput(input)}
              disabled={isThinking || !input.trim()}
              className="bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-slate-800 text-white px-5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition shrink-0 flex items-center gap-1"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          ULTRON 3.0 AI Engine • Architected by Lakhan Kashyap
        </div>
      </div>
    </div>
  );
}
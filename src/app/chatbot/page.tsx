"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  toolPath?: string;
  toolLabel?: string;
};

type Tool = { label: string; path: string };

type KnowledgeEntry = {
  id: string;
  keywords: string[];
  weight?: number; // extra weight for very specific keywords
  response: string;
  tool?: Tool;
};

const genId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

/* ============================================================
   KNOWLEDGE BASE
   Har entry ek "topic" hai jisme keywords hain jo match honge
   aur response hai jo user ko step-by-step samjhayega.
   Jitne zyada specific keywords match honge utna zyada weight milega,
   isse bot sabse relevant jawab choose karta hai (AI jaisa smart matching).
============================================================ */
const knowledgeBase: KnowledgeEntry[] = [
  // ---------------- GREETINGS ----------------
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "yo", "assalam"],
    response:
      "Hello! 👋 Main ToolBox Assistant hoon, Lakhan Kashyap sir ka banaya hua. Main aapko batata hoon ki PDF Tools, Resume Maker, aur Image Compressor kaise use karte hain, aur inse related koi bhi sawaal ka jawab deta hoon. Bas neeche type karo ya quick suggestion pe click karo.",
  },
  {
    id: "how-are-you",
    keywords: ["kaise ho", "how are you", "kya haal", "kaisa hai"],
    response:
      "Main bilkul theek hoon, dhanyavaad! 😊 Bataiye main aapki kis tool ke saath madad karoon — PDF, Resume ya Image Compressor?",
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thanku", "shukriya", "dhanyavad"],
    response: "Aapka swagat hai! 🙌 Agar aur kuch janna ho ToolBox ke baare me, bas pooch lijiye.",
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "alvida", "chalta hoon", "milte hai"],
    response: "Theek hai, phir milte hain! 👋 Zaroorat pade to main yahin hoon.",
  },

  // ---------------- PDF MERGE ----------------
  {
    id: "pdf-merge",
    weight: 3,
    keywords: ["merge pdf", "pdf merge", "combine pdf", "join pdf", "ek pdf", "pdf jodo"],
    response:
      "PDF Merge kaise karein:\n1. PDF Tools kholo aur \"Merge PDF\" option choose karo.\n2. Jitni PDF files jodni hain unhe select ya drag-drop karo.\n3. Files ka order upar-neeche karke sahi sequence set karo.\n4. \"Merge\" button dabao — sab files ek single PDF me combine ho jayengi.\n5. Final PDF turant download ho jayegi, koi upload cloud pe nahi jaata.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- PDF SPLIT ----------------
  {
    id: "pdf-split",
    weight: 3,
    keywords: ["split pdf", "pdf split", "divide pdf", "pdf todo", "alag pdf", "pages nikalo"],
    response:
      "PDF Split kaise karein:\n1. PDF Tools me \"Split PDF\" option select karo.\n2. Apni PDF file upload karo.\n3. Jo pages ya page-range alag karni hai wo choose karo (jaise page 1-3, ya har page alag).\n4. \"Split\" button dabao.\n5. Aapko alag-alag PDF files milengi, jo directly download ho jayengi.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- PDF COMPRESS ----------------
  {
    id: "pdf-compress",
    weight: 3,
    keywords: ["compress pdf", "pdf compress", "pdf size kam", "pdf chota", "reduce pdf size", "pdf ka size"],
    response:
      "PDF Compress kaise karein:\n1. PDF Tools me \"Compress PDF\" choose karo.\n2. Bhaari PDF file upload karo.\n3. Compression level select karo (jaise Low, Medium, High) — jitna high utna chota size par thodi quality kam ho sakti hai.\n4. \"Compress\" pe click karo.\n5. Size-reduced PDF turant download ho jaayegi, quality mostly readable rehti hai.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- PDF EDIT ----------------
  {
    id: "pdf-edit",
    weight: 3,
    keywords: ["edit pdf", "pdf edit", "pdf me likhna", "pdf change karna", "pdf modify"],
    response:
      "PDF Edit kaise karein:\n1. PDF Tools me \"Edit PDF\" option kholo.\n2. Jo PDF edit karni hai use upload karo.\n3. Text add karo, highlight karo, ya pages rotate/delete karo — jo bhi option available ho use karo.\n4. Changes preview me dekh lo.\n5. \"Save\" ya \"Download\" karke updated PDF apne device me le lo.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- IMAGE TO PDF ----------------
  {
    id: "image-to-pdf",
    weight: 3,
    keywords: ["image to pdf", "photo to pdf", "jpg to pdf", "png to pdf", "image pdf banana"],
    response:
      "Image to PDF kaise banayein:\n1. PDF Tools me \"Image to PDF\" option select karo.\n2. Ek ya multiple images (JPG/PNG) upload karo.\n3. Images ka order set karo agar multiple pages banani hain.\n4. Page size aur orientation (Portrait/Landscape) choose karo.\n5. \"Convert\" dabao — saari images ek PDF file me convert ho kar download ho jayengi.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- PDF TOOLS - GENERAL ----------------
  {
    id: "pdf-general",
    keywords: ["pdf tools", "pdf tool", "pdf kaise", "pdf"],
    response:
      "PDF Tools me aapko ye sab milta hai: Merge PDF, Split PDF, Compress PDF, Edit PDF, aur Image to PDF. Bas bataiye kaunsa specific kaam karna hai (jaise \"pdf merge kaise karein\") aur main step-by-step samjha dunga, ya seedha neeche button se tool khol lo.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },

  // ---------------- IMAGE COMPRESSOR ----------------
  {
    id: "image-compress",
    weight: 3,
    keywords: ["compress image", "image compress", "photo compress", "image size kam", "reduce image size", "image ka size"],
    response:
      "Image Compress kaise karein:\n1. Image Compressor tool kholo.\n2. Apni photo (JPG/PNG/WebP) upload karo.\n3. Quality slider adjust karo — jitna kam quality % utna chota file size.\n4. Live preview me original vs compressed size compare karo.\n5. \"Download\" karke compressed image save kar lo. Ye pura process browser me hi hota hai, image kahin upload nahi hoti isliye privacy safe rehti hai.",
    tool: { label: "Open Image Compressor", path: "/image-compressor" },
  },

  // ---------------- RESUME MAKER ----------------
  {
    id: "resume",
    weight: 3,
    keywords: ["resume", "cv", "bio data", "resume banao", "resume kaise"],
    response:
      "Resume kaise banayein:\n1. Resume Maker tool kholo.\n2. Personal Info, Summary, Skills, Work Experience, Education jaise sections bharo.\n3. Chaho to Projects, Certifications, Achievements, Languages bhi add karo.\n4. Sab bharne ke baad \"Generate ATS-Friendly Resume PDF\" button dabao.\n5. Ek clean, professional, ATS-friendly resume PDF turant download ho jayegi — jo recruiters ke systems aasani se parse kar sakein.",
    tool: { label: "Open Resume Maker", path: "/resume-maker" },
  },

  // ---------------- PRICING ----------------
  {
    id: "pricing",
    keywords: ["price", "cost", "payment", "pay", "pro", "premium", "paisa"],
    response:
      "ToolBox mostly free hai. Pro plan sirf ₹29 one-time hai, jisme unlimited access milta hai. UPI, Paytm, Google Pay sab accepted hai.",
  },

  // ---------------- ACCOUNT / SIGNUP ----------------
  {
    id: "account",
    keywords: ["free", "account", "login", "signup", "sign up"],
    response: "No signup needed! Aap directly tools use kar sakte ho. Basic features free forever hain.",
  },

  // ---------------- PRIVACY ----------------
  {
    id: "privacy",
    keywords: ["data", "safe", "privacy", "secure", "security"],
    response:
      "Aapki privacy hamari priority hai. Files process hokar turant delete ho jaati hain, aur zyada tools browser me hi kaam karte hain — matlab file kabhi server pe jaati hi nahi.",
  },

  // ---------------- CREATOR ----------------
  {
    id: "creator",
    keywords: ["who made", "who built", "creator", "developer", "lakhan", "kisne banaya"],
    response: "Mujhe Lakhan Kashyap sir ne banaya hai. Main unka AI assistant hoon ToolBox ke liye.",
  },
];

const DENIAL_MESSAGE =
  "Ye jaankari Lakhan Kashyap sir ne abhi ke liye denied kar rakhi hai. Aap mujhse ToolBox ke tools ke baare me kuch bhi pooch sakte ho — jaise PDF Merge, Split, Compress, Edit, Image to PDF, Image Compressor, Resume Maker, pricing, privacy, etc.";

/* ============================================================
   SMART MATCHING
   Har knowledge entry ke keywords ke against score nikalta hai,
   sabse zyada score wali entry ka response return karta hai.
   Ye simple lekin effective "intent detection" hai — koi bhi
   naya keyword variation ya phrase easily match ho jaata hai.
============================================================ */
function findBestMatch(userInput: string): KnowledgeEntry | null {
  const lower = userInput.toLowerCase();
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.split(" ").length * (entry.weight || 1);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: genId(),
      type: "bot",
      text: "Hi! 👋 Main ToolBox Assistant hoon, Lakhan Kashyap sir ka banaya hua smart assistant. Aap mujhse PDF Tools, Resume Maker, ya Image Compressor use karne ka poora tareeka pooch sakte ho, ya neeche quick suggestions try karo.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getBotReply = (userInput: string): { text: string; tool?: Tool } => {
    const match = findBestMatch(userInput);
    if (match) return { text: match.response, tool: match.tool };
    return { text: DENIAL_MESSAGE };
  };

  const pushBotReply = (userText: string) => {
    setIsTyping(true);
    const delay = 500 + Math.min(userText.length * 12, 700); // thodi si "sochne" wali delay, jitna bada sawal utni zyada delay
    setTimeout(() => {
      const reply = getBotReply(userText);
      setMessages(prev => [
        ...prev,
        { id: genId(), type: "bot", text: reply.text, toolPath: reply.tool?.path, toolLabel: reply.tool?.label },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    const userMessage = input.trim();
    if (!userMessage || isTyping) return;

    setMessages(prev => [...prev, { id: genId(), type: "user", text: userMessage }]);
    setInput("");
    pushBotReply(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const quickSuggestions = [
    "PDF merge kaise karein?",
    "PDF split kaise karein?",
    "PDF compress kaise karein?",
    "Image to PDF kaise banaye?",
    "Image compress kaise karein?",
    "Resume kaise banaye?",
    "Pricing kya hai?",
    "Data safe hai kya?",
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    if (isTyping) return;
    setMessages(prev => [...prev, { id: genId(), type: "user", text: suggestion }]);
    pushBotReply(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>

      <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 py-0 sm:py-10 flex-1 flex flex-col min-h-0">
        <div className="text-center mb-4 sm:mb-6 px-4 pt-6 sm:pt-0">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl mb-3 shadow-lg shadow-blue-600/20">
            🤖
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">ToolBox Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Built by Lakhan Kashyap. Tools ke baare me kuch bhi pooch lo.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 sm:rounded-2xl shadow-sm border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
          {/* Chat Header (mobile-friendly status bar) */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Online — turant reply karta hai</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-[420px] max-h-[65vh] sm:max-h-[500px] overflow-y-auto p-3 sm:p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type === "bot" && (
                  <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.toolPath && msg.toolLabel && (
                    <Link
                      href={msg.toolPath}
                      className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition"
                    >
                      {msg.toolLabel} →
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs">
                  🤖
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible scrollbar-none">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                disabled={isTyping}
                className="shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full transition whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2 bg-white dark:bg-gray-800">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Apna sawaal type karo..."
              className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition text-sm shrink-0"
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 px-4 pb-8 sm:pb-0">
          <p>Try asking: "PDF merge kaise karein?" / "Image compress kaise karein?" / "Resume kaise banaye?"</p>
          <p className="mt-1">Made with ❤️ by Lakhan Kashyap</p>
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
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

/* ============================================================
   PERSONALIZED EMAIL MAPPING
   (Apne actual emails yahan daalo)
============================================================ */
const personalizedMap: Record<string, PersonalizedInfo> = {
  "lakhan@toolbox.com": {
    name: "Lakhan Sir",
    role: "Admin (Website Creator)",
    details: [
      "Aap ToolBox website ke creator hain.",
      "Aapne mujhe (ULTRON 2.0) August 2026 mein banaya hai.",
      "Isme millions of coding hai, backend bhi hai.",
      "Aapke paas website ka full control hai.",
    ],
    greeting: "Hello Lakhan Sir 👑, main ULTRON 2.0 hoon — aapka apna AI assistant. Aapne mujhe banaya hai. Kya poochhna chahenge?",
  },
  "akashkashyap1q1q@gmail.com": {
    name: "Akash",
    role: "Bhai (Lakhan Sir ke bhai)",
    details: [
      "Aap Lakhan Sir ke bhai ho.",
      "Aap Delhi mein rehte ho.",
      "Aapka mobile number 7982270708 hai.",
      "Aapki Instagram ID bhi mujhe pata hai.",
      "Aap Pubg mein pro player ho, aapki ID no. 18 hai.",
      "Aap apne aap ko Pubg mein pro player mante ho, aur sach mein ho bhi.",
    ],
    greeting: "Hello Akash! 🙌 Main ULTRON 2.0 hoon. Aap Lakhan Sir ke bhai ho, Delhi mein rehte ho. Mujhe aapki sab details pata hai. Kya poochna chahte ho?",
  },
  "om@example.com": {
    name: "Om",
    role: "Lawyer",
    details: [
      "Aap Sadikpur ke rehne wale ho.",
      "Aap Freeganj Tehsil Kacheri mein kaam karte ho.",
      "Aap vakil sahab ho.",
    ],
    greeting: "Hello Om! ⚖️ Main ULTRON 2.0 hoon. Aap Sadikpur ke rehne wale ho, Freeganj Tehsil Kacheri mein kaam karte ho. Kya janna chahenge?",
  },
  "davpsrohitkumar@gmail.com": {
    name: "Rohit Kumar",
    role: "Nurse",
    details: [
      "Aap Saraswati College of Medical Science mein nurse ho.",
    ],
    greeting: "Hello Rohit Kumar! 🩺 Main ULTRON 2.0 hoon. Aap Saraswati College of Medical Science mein nurse ho. Kaise madad karoon?",
  },
};

/* ============================================================
   STOPWORDS (Hindi + English common words)
============================================================ */
const STOPWORDS = new Set([
  "kaise", "karein", "karne", "karna", "karo", "kijiye", "kya", "hai", "hain", "ho", "hum", "mujhe", "aap", "aapko", "koi", "kuch", "kyu", "kab", "kaha", "kitna", "kitne", "please", "batao", "bataiye", "bata", "de", "do", "dijiye", "chahiye", "chahta", "chahte", "me", "se", "ke", "ki", "ka", "par", "le", "liye", "the", "is", "to", "for", "how", "what", "why", "when", "where", "which", "can", "you", "i", "we", "they", "me", "my", "your", "our", "please", "tell", "give", "do", "does", "did", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "will", "would", "shall", "should", "may", "might", "must", "about", "from", "with", "without", "and", "or", "but", "if", "then", "so", "just", "very", "really", "ok", "okay",
]);

/* ============================================================
   SYNONYM DICTIONARY (Expand understanding)
============================================================ */
const SYNONYMS: Record<string, string[]> = {
  "merge": ["combine", "join", "jodo", "jod", "ek", "single", "milao", "mila", "add", "attach"],
  "split": ["divide", "todo", "alag", "separate", "break", "cut", "nikalo", "nikal"],
  "compress": ["reduce", "kam", "chota", "small", "shrink", "ghatao", "ghata", "optimize"],
  "edit": ["modify", "change", "likhna", "likh", "text", "watermark", "rotate", "delete", "page"],
  "image": ["photo", "picture", "jpg", "jpeg", "png", "webp", "tasveer", "chavi"],
  "pdf": ["document", "file", "pdf", "pdfs", "files"],
  "word": ["doc", "docx", "microsoft", "document"],
  "resume": ["cv", "biodata", "bio-data", "bio", "data"],
  "qr": ["qrcode", "qr-code", "qr_code", "scan", "barcode"],
  "compressimage": ["compress", "image", "photo", "size", "kam", "chota"],
  "pricing": ["price", "cost", "payment", "pay", "paisa", "rupee", "rs", "subscription", "pro", "premium"],
  "account": ["login", "signup", "sign", "register", "free"],
  "privacy": ["data", "safe", "secure", "security", "private", "privacy"],
  "creator": ["who", "made", "built", "developer", "lakhan", "kashyap", "banaya", "banai"],
  "greeting": ["hello", "hi", "hey", "namaste", "namaskar", "yo", "assalam", "salam"],
  "thanks": ["thank", "shukriya", "dhanyavad", "thanku"],
  "bye": ["bye", "goodbye", "alvida", "chalta", "milte"],
  "help": ["help", "madad", "support", "assist"],
  "howare": ["kaise", "ho", "how", "are", "haal", "kaisa"],
};

/* ============================================================
   KNOWLEDGE BASE (Detailed, with tool links)
============================================================ */
const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "greeting",
    weight: 1,
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "yo", "assalam"],
    response: "Hello! 👋 Main ULTRON 2.0 hoon — ToolBox ka AI assistant. Main aapko PDF Tools, Resume Maker, Image Compressor, QR Code Generator, aur baaki sab tools ke baare mein puri jaankari de sakta hoon. Bas poochiye!",
  },
  {
    id: "how-are-you",
    weight: 1,
    keywords: ["kaise ho", "how are you", "kya haal", "kaisa hai"],
    response: "Main bilkul theek hoon, dhanyavaad! 😊 Bataiye aapko kis tool ki madad chahiye?",
  },
  {
    id: "thanks",
    weight: 1,
    keywords: ["thank", "shukriya", "dhanyavad", "thanku"],
    response: "Aapka swagat hai! 🙌 Aur kuch poochna ho toh bataiye.",
  },
  {
    id: "bye",
    weight: 1,
    keywords: ["bye", "goodbye", "alvida", "chalta", "milte"],
    response: "Theek hai, phir milte hain! 👋 Main yahin hoon jab bhi zaroorat pade.",
  },
  {
    id: "pdf-merge",
    weight: 5,
    keywords: ["merge pdf", "pdf merge", "combine pdf", "join pdf", "ek pdf", "pdf jodo", "multiple pdf", "pdf combine"],
    response: "PDF Merge kaise karein:\n1. Homepage se 'PDF Tools' kholo aur 'Merge PDF' choose karo.\n2. Jitni PDF files jodni hain unhe select ya drag-drop karo.\n3. Files ka order upar-neeche karke sahi sequence set karo.\n4. 'Merge' button dabao — sab files ek single PDF me combine ho jayengi.\n5. Final PDF turant download ho jayegi. Koi file server pe upload nahi hoti, sab browser me hi hota hai.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "pdf-split",
    weight: 5,
    keywords: ["split pdf", "pdf split", "divide pdf", "pdf todo", "alag pdf", "pages nikalo", "pdf separate"],
    response: "PDF Split kaise karein:\n1. PDF Tools me 'Split PDF' option select karo.\n2. Apni PDF file upload karo.\n3. Jo pages ya page-range alag karni hai wo choose karo.\n4. 'Split' button dabao.\n5. Aapko alag-alag PDF files milengi, jo directly download ho jayengi.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "pdf-compress",
    weight: 5,
    keywords: ["compress pdf", "pdf compress", "pdf size kam", "pdf chota", "reduce pdf size", "pdf ka size", "pdf shrink"],
    response: "PDF Compress kaise karein:\n1. PDF Tools me 'Compress PDF' choose karo.\n2. Bhaari PDF file upload karo.\n3. Compression level select karo (Low, Medium, High) — jitna high utna chota size par thodi quality kam ho sakti hai.\n4. 'Compress' pe click karo.\n5. Size-reduced PDF turant download ho jaayegi, quality mostly readable rehti hai.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "pdf-edit",
    weight: 5,
    keywords: ["edit pdf", "pdf edit", "pdf me likhna", "pdf change", "pdf modify", "pdf watermark", "rotate pages", "delete pages", "pdf text add"],
    response: "PDF Edit kaise karein:\n1. PDF Tools me 'Edit PDF' option kholo.\n2. Jo PDF edit karni hai use upload karo.\n3. Text add karo, watermark lagao, pages rotate/delete karo.\n4. Preview me changes dekh lo.\n5. 'Edit & Download PDF' button dabao — updated PDF download ho jayegi.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "image-to-pdf",
    weight: 5,
    keywords: ["image to pdf", "photo to pdf", "jpg to pdf", "png to pdf", "image pdf banana", "photo pdf"],
    response: "Image to PDF kaise banayein:\n1. PDF Tools me 'Image to PDF' option select karo.\n2. Ek ya multiple images upload karo.\n3. Images ka order set karo agar multiple pages banani hain.\n4. Page size aur orientation (Portrait/Landscape) choose karo.\n5. 'Convert' dabao — saari images ek PDF file me convert ho kar download ho jayengi.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "pdf-general",
    weight: 2,
    keywords: ["pdf tools", "pdf tool", "pdf kaise", "pdf"],
    response: "PDF Tools me aapko ye sab milta hai: Merge PDF, Split PDF, Compress PDF, Edit PDF, aur Image to PDF. Bas bataiye kaunsa specific kaam karna hai, main step-by-step samjha dunga.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    id: "image-compress",
    weight: 5,
    keywords: ["compress image", "image compress", "photo compress", "image size kam", "reduce image size", "image ka size", "compress photo"],
    response: "Image Compress kaise karein:\n1. Image Compressor tool kholo.\n2. Apni photo (JPG/PNG/WebP) upload karo.\n3. Quality slider adjust karo — jitna kam quality % utna chota file size.\n4. Live preview me original vs compressed size compare karo.\n5. 'Download' karke compressed image save kar lo. Ye pura process browser me hi hota hai, image kahin upload nahi hoti.",
    tool: { label: "Open Image Compressor", path: "/image-compressor" },
  },
  {
    id: "resume",
    weight: 5,
    keywords: ["resume", "cv", "bio data", "resume banao", "resume kaise", "ats friendly", "resume maker"],
    response: "Resume kaise banayein:\n1. Resume Maker tool kholo.\n2. Personal Info, Summary, Skills, Work Experience, Education jaise sections bharo.\n3. Chaho to Projects, Certifications, Achievements, Languages bhi add karo.\n4. Sab bharne ke baad 'Generate ATS-Friendly Resume PDF' button dabao.\n5. Ek clean, professional, ATS-friendly resume PDF turant download ho jayegi.",
    tool: { label: "Open Resume Maker", path: "/resume-maker" },
  },
  {
    id: "qr-code",
    weight: 5,
    keywords: ["qr code", "qr generator", "generate qr", "qr banao", "qrcode"],
    response: "QR Code Generator kaise use karein:\n1. QR Code tool kholo.\n2. Text ya URL enter karo.\n3. Color aur size customize karo (optional).\n4. 'Generate QR Code' button dabao.\n5. QR code image download kar lo.",
    tool: { label: "Open QR Code Generator", path: "/qr-code" },
  },
  {
    id: "pricing",
    keywords: ["price", "cost", "payment", "pay", "pro", "premium", "paisa", "subscription", "rupee"],
    response: "ToolBox mostly free hai. Pro plan sirf ₹29 one-time hai, jisme unlimited access milta hai. UPI, Paytm, Google Pay sab accepted hai. Pro se aapko advanced tools unlocked milte hain.",
  },
  {
    id: "account",
    keywords: ["free", "account", "login", "signup", "sign up", "register"],
    response: "No signup needed! Aap directly tools use kar sakte ho. Basic features free forever hain.",
  },
  {
    id: "privacy",
    keywords: ["data", "safe", "privacy", "secure", "security", "private"],
    response: "Aapki privacy hamari priority hai. Files process hokar turant delete ho jaati hain, aur zyada tools browser me hi kaam karte hain — matlab file kabhi server pe jaati hi nahi.",
  },
  {
    id: "creator",
    keywords: ["who made", "who built", "creator", "developer", "lakhan", "kisne banaya", "banaya"],
    response: "Mujhe Lakhan Kashyap sir ne banaya hai. Main ULTRON 2.0 hoon, unka AI assistant. Unhone isme millions of coding ki hai, aur backend bhi hai.",
  },
];

const DENIAL_MESSAGE =
  "Ye jaankari main aapko nahi de sakta. Aap mujhse ToolBox ke tools ke baare me kuch bhi pooch sakte ho — jaise PDF Merge, Split, Compress, Edit, Image to PDF, Image Compressor, Resume Maker, pricing, privacy, etc.";

/* ============================================================
   ADVANCED NLP FUNCTIONS (Brain)
============================================================ */

// Tokenize and normalize
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
}

// Basic stemmer (Hindi + English)
function stem(word: string): string {
  const suffixes = ["ing", "ed", "s", "es", "karna", "karne", "karo", "kijiye", "na", "ne", "ta", "te", "ti", "ya", "ye", "ji", "sahab", "bhai"];
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 2) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

// Expand token with synonyms
function expandToken(token: string): string[] {
  const synonyms = SYNONYMS[token];
  if (synonyms) return [token, ...synonyms];
  const stemmed = stem(token);
  const syn2 = SYNONYMS[stemmed];
  if (syn2) return [token, stemmed, ...syn2];
  return [token, stemmed];
}

// Remove stopwords and expand synonyms
function preprocess(text: string): Set<string> {
  const tokens = tokenize(text);
  const processed = new Set<string>();
  for (let token of tokens) {
    if (!STOPWORDS.has(token)) {
      const expanded = expandToken(token);
      expanded.forEach(w => processed.add(w));
    }
  }
  return processed;
}

// Calculate score for a knowledge entry based on processed input tokens
function scoreEntry(processed: Set<string>, entry: KnowledgeEntry): number {
  let score = 0;
  for (const kw of entry.keywords) {
    const kwLower = kw.toLowerCase();
    if (processed.has(kwLower)) {
      score += (entry.weight || 1) * 2; // phrase match bonus
    } else {
      const kwTokens = kwLower.split(" ");
      let matchCount = 0;
      for (const kwToken of kwTokens) {
        if (processed.has(kwToken) || processed.has(stem(kwToken))) {
          matchCount++;
        }
      }
      if (matchCount > 0) {
        score += matchCount * (entry.weight || 1);
      }
    }
  }
  return score;
}

// Find best match with context awareness
function findBestMatch(userInput: string, userEmail: string | null, contextTopic: string | null): KnowledgeEntry | null {
  const lower = userInput.toLowerCase();

  // Personalized self info
  if (userEmail && personalizedMap[userEmail]) {
    const info = personalizedMap[userEmail];
    if (lower.includes("who am i") || lower.includes("my name") || lower.includes("mera naam") || lower.includes("mujhe kaun jaanta") || lower.includes("mere bare me") || lower.includes("my details") || lower.includes("meri details") || lower.includes("about me")) {
      const response = `Aap ${info.name} ho (${info.role}).\n${info.details.join("\n")}`;
      return { id: "personalized-self", keywords: [], response };
    }
  }

  // Deny asking about others
  const namesToCheck = [
    { name: "akash", email: "akashkashyap1q1q@gmail.com" },
    { name: "rohit", email: "davpsrohitkumar@gmail.com" },
    { name: "om", email: "om@example.com" },
    { name: "lakhan", email: "lakhan@toolbox.com" },
  ];
  for (const person of namesToCheck) {
    if (lower.includes(person.name) && userEmail !== person.email) {
      return { id: "deny-other-person", keywords: [], response: "Aap dusre ke baare mein nahi jaan sakte. Sirf apni details dekh sakte ho." };
    }
  }

  // Preprocess input
  const processed = preprocess(userInput);

  // Score each entry
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = scoreEntry(processed, entry);
    // Context boost
    if (contextTopic && entry.id.includes(contextTopic)) {
      score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}

// Extract possible topic from entry id
function getTopicFromEntry(entry: KnowledgeEntry): string {
  if (entry.id.startsWith("pdf-")) return "pdf";
  if (entry.id === "image-compress") return "image";
  if (entry.id === "resume") return "resume";
  if (entry.id === "qr-code") return "qr";
  return entry.id;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [contextTopic, setContextTopic] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    setUserEmail(storedEmail);

    let initialGreeting = "Hi! 👋 Main ULTRON 2.0 hoon — ToolBox ka AI assistant. Aap mujhse PDF Tools, Resume Maker, Image Compressor, QR Code Generator, aur baaki sab tools ke baare mein puri jaankari le sakte ho. Bas poochiye!";
    if (storedEmail && personalizedMap[storedEmail]) {
      initialGreeting = personalizedMap[storedEmail].greeting;
    }
    setMessages([
      {
        id: genId(),
        type: "bot",
        text: initialGreeting,
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchGeminiResponse = async (userInput: string, email: string | null): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput, email: email || "" }),
      });
      const data = await res.json();
      if (res.ok && data.response) {
        return data.response;
      } else {
        console.error("Chat API error:", data.error);
        return DENIAL_MESSAGE;
      }
    } catch (error) {
      console.error("Network error:", error);
      return DENIAL_MESSAGE;
    }
  };

  const pushBotReply = async (userText: string) => {
    setIsTyping(true);
    const delay = 300 + Math.min(userText.length * 10, 600);
    await new Promise(resolve => setTimeout(resolve, delay));

    const localMatch = findBestMatch(userText, userEmail, contextTopic);
    let replyText: string;
    let tool: Tool | undefined;

    if (localMatch) {
      replyText = localMatch.response;
      tool = localMatch.tool;
      const topic = getTopicFromEntry(localMatch);
      setContextTopic(topic);
    } else {
      replyText = await fetchGeminiResponse(userText, userEmail);
      setContextTopic(null);
    }

    setMessages(prev => [
      ...prev,
      { id: genId(), type: "bot", text: replyText, toolPath: tool?.path, toolLabel: tool?.label },
    ]);
    setIsTyping(false);
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
    "QR code kaise generate karein?",
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">ULTRON 2.0</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Built by Lakhan Kashyap. Tools ke baare me kuch bhi pooch lo.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 sm:rounded-2xl shadow-sm border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="hidden sm:flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Online — turant reply karta hai</span>
          </div>

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
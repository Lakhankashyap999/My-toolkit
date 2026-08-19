"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  type: "user" | "bot";
  text: string;
  toolPath?: string;
  toolLabel?: string;
};

const toolLinks: { keywords: string[]; label: string; path: string; description: string }[] = [
  {
    keywords: ["pdf", "merge", "split", "compress", "edit pdf", "image to pdf"],
    label: "Open PDF Tools",
    path: "/pdf-tools",
    description: "Yahan aap PDF merge, split, compress, edit, aur image to PDF sab kar sakte ho.",
  },
  {
    keywords: ["resume", "cv", "bio data"],
    label: "Open Resume Maker",
    path: "/resume-maker",
    description: "Yahan aap ATS-friendly resume bana kar PDF download kar sakte ho.",
  },
  {
    keywords: ["image", "photo", "compress image", "compress photo"],
    label: "Open Image Compressor",
    path: "/image-compressor",
    description: "Yahan aap image compress kar sakte ho without quality loss.",
  },
];

const botResponses: { keywords: string[]; response: string; tool?: { label: string; path: string } }[] = [
  {
    keywords: ["pdf", "merge", "split", "compress", "edit"],
    response: "PDF tools ke liye aap neeche diye gaye button pe click karo. Wahan saare PDF features available hain.",
    tool: { label: "Open PDF Tools", path: "/pdf-tools" },
  },
  {
    keywords: ["resume", "cv"],
    response: "Resume Maker yahan hai. Aap apni details bhar ke ATS-friendly PDF download kar sakte ho.",
    tool: { label: "Open Resume Maker", path: "/resume-maker" },
  },
  {
    keywords: ["image", "photo", "compress image"],
    response: "Image Compressor yahan hai. Ye browser me hi kaam karta hai, aapki image privacy safe rehti hai.",
    tool: { label: "Open Image Compressor", path: "/image-compressor" },
  },
  {
    keywords: ["price", "cost", "payment", "pay", "pro", "premium"],
    response: "ToolBox mostly free hai. Pro plan sirf ₹29 one-time hai, jisme unlimited access milta hai. UPI, Paytm, Google Pay sab accepted hai.",
  },
  {
    keywords: ["free", "account", "login", "signup"],
    response: "No signup needed! Aap directly tools use kar sakte ho. Basic features free forever hain.",
  },
  {
    keywords: ["data", "safe", "privacy", "secure"],
    response: "Aapki privacy hamari priority hai. Files process hokar turant delete ho jaati hain. Most tools browser me hi kaam karte hain.",
  },
  {
    keywords: ["who made", "who built", "creator", "developer", "lakhan"],
    response: "Mujhe Lakhan Kashyap sir ne banaya hai. Main unka AI assistant hoon ToolBox ke liye.",
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "help"],
    response: "Hello! Main ToolBox Assistant hoon, Lakhan Kashyap sir ka banaya hua. Aap mujhse PDF tools, Resume Maker, Image Compressor, pricing ya website ke baare me pooch sakte ho.",
  },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "Hi! 👋 Main ToolBox Assistant hoon, Lakhan Kashyap sir ka banaya hua. Aap mujhse kisi bhi tool ke baare me pooch sakte ho ya directly tool pe jaane ke liye neeche buttons use karo.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotReply = (userInput: string): { text: string; tool?: { label: string; path: string } } => {
    const lower = userInput.toLowerCase();

    // First check tool links
    for (const item of botResponses) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return { text: item.response, tool: item.tool };
      }
    }

    // Denial message for out of scope queries
    return {
      text: "Lakhan Kashyap sir ne ye batein abhi ke liye denied kr rkhi hai. Aap mujhe ToolBox ke baare me kuch bhi pooch sakte ho — jaise PDF tools, resume maker, image compressor, pricing, etc.",
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    const botReply = getBotReply(userMessage);

    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: botReply.text, toolPath: botReply.tool?.path, toolLabel: botReply.tool?.label }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const quickSuggestions = [
    "PDF tools kaise use karein?",
    "Resume kaise banaye?",
    "Image compress kaise karein?",
    "Pricing kya hai?",
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
    // Auto send
    setMessages(prev => [...prev, { type: "user", text: suggestion }]);
    const botReply = getBotReply(suggestion);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: botReply.text, toolPath: botReply.tool?.path, toolLabel: botReply.tool?.label }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">💬 ToolBox Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Built by Lakhan Kashyap. Ask me about any tool or click a quick suggestion below.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${msg.type === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"}`}>
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
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Try asking: "PDF merge kaise karein?" / "Resume banao" / "What is pricing?"</p>
          <p className="mt-1">Made with ❤️ by Lakhan Kashyap</p>
        </div>
      </div>
    </div>
  );
}
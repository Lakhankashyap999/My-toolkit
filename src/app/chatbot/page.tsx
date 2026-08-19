"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  type: "user" | "bot";
  text: string;
};

const botResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ["pdf", "merge", "split", "compress", "edit"],
    response: "Our PDF tools let you merge, split, compress, and edit PDFs. Go to PDF Tools from the homepage and choose the tool you need. All are free!",
  },
  {
    keywords: ["resume", "cv"],
    response: "The Resume Maker helps you create a professional resume. Fill in your details and download as PDF — free and private.",
  },
  {
    keywords: ["image", "compress", "photo"],
    response: "The Image Compressor reduces image size without losing quality. It works entirely in your browser, so your images stay private.",
  },
  {
    keywords: ["price", "cost", "payment", "pay"],
    response: "Our tools are mostly free! Pro plan is just ₹29 one-time for unlimited access. Payment via UPI, Paytm, Google Pay, and more.",
  },
  {
    keywords: ["free", "account", "login", "signup"],
    response: "No signup needed! Use tools directly without creating an account. Basic features are free forever.",
  },
  {
    keywords: ["data", "safe", "privacy", "secure"],
    response: "Your privacy is our priority. Files are processed securely and never stored. Most tools work in your browser.",
  },
  {
    keywords: ["hello", "hi", "hey", "namaste"],
    response: "Hello! I'm ToolBox Assistant. Ask me about PDF tools, resume maker, image compressor, pricing, or anything else!",
  },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "Hi! I'm ToolBox Assistant. How can I help you today? You can ask about our tools, pricing, or features." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    // Find matching response
    const lowerInput = userMessage.toLowerCase();
    let botReply = "I'm not sure about that. Try asking about PDF tools, resume maker, image compressor, or pricing. You can also type 'help' for options.";

    for (const item of botResponses) {
      if (item.keywords.some(kw => lowerInput.includes(kw))) {
        botReply = item.response;
        break;
      }
    }

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: botReply }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
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
          <h1 className="text-4xl font-bold mb-4">💬 Chatbot Help</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Get instant answers to your questions about ToolBox.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${msg.type === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
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
          <p>Try asking: "How to merge PDF?" / "Pricing?" / "Is it free?"</p>
        </div>
      </div>
    </div>
  );
}
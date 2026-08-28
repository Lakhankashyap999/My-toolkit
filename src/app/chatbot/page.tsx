// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { UltronBrain, BrainResponse, getDominantEmotion } from "@/lib/ultron-brain";

/* ========================================================================== */
/*  UI MESSAGE TYPES                                                          */
/* ========================================================================== */

type ChatMessage = {
  id: string;
  type: "user" | "bot";
  text: string;
  toolPath?: string;
  toolLabel?: string;
  actionChips?: { label: string; prompt: string }[];
  confidence?: number;
  emotion?: string;
  reasoningSteps?: { step: number; type: string; content: string; confidence: number }[];
  selfReflection?: string;
  learnedFactsCount?: number;
  timestamp: string;
};

const genId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export default function UltronChatbotPage() {
  // Local Brain Orchestrator
  const brain = useMemo(() => new UltronBrain(), []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showReasoningId, setShowReasoningId] = useState<string | null>(null);
  const [showBrainStats, setShowBrainStats] = useState(false);
  const [brainStats, setBrainStats] = useState({
    lexiconSize: 600,
    knowledgeNodes: 200,
    knowledgeEdges: 500,
    memorizedFacts: 0,
    version: "5.0.0",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize UI on Mount
  useEffect(() => {
    setBrainStats(brain.getStats());

    const initialGreeting = `Namaste! 👋 Main **ULTRON 5.0** hoon — aapka autonomous conversational AI Brain.

Mujhe **Lakhan Kashyap** sir ne architect kiya hai. Main sirf ratte-rataye answer nahi deta, balki aapki baat ko dhyan se samajhta hoon, situation analyze karta hoon, aur exact solution nikalta hoon.

Bataiye aaj kya problem ya query hai aapki?`;

    setMessages([
      {
        id: genId(),
        type: "bot",
        text: initialGreeting,
        confidence: 0.99,
        emotion: "happy",
        actionChips: [
          { label: "⚖️ Dost ne paise wapas nahi kiye kya karu?", prompt: "Bhai mere dost ne mujhse paise liye the ab wapas nahi de raha kya legal action lu?" },
          { label: "💼 12 Lakh Salary par kitna tax lagega?", prompt: "Meri saal ki 12 lakh gross salary hai kitna income tax banega?" },
          { label: "📜 Cheque Bounce 138 Notice", prompt: "Cheque bounce ho gaya kya karu notice kaise bhejein?" },
          { label: "🔍 IPC to BNS Conversion", prompt: "IPC 302 aur 420 ka naya BNS section kya hai?" },
          { label: "📸 UPSC/SSC Exam Photo Size", prompt: "UPSC aur SSC ke liye photo aur signature resize kaise karein?" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [brain]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Dynamic Multi-Turn Conversational Reasoning Engine
  const queryDynamicAI = async (prompt: string, historyList: ChatMessage[]): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: historyList.map((m) => ({ type: m.type, text: m.text })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.response) {
        return data.response;
      }
    } catch (e) {
      console.warn("Dynamic API fallback engaged:", e);
    }
    return "Main aapki query analyze kar raha hoon. Kya aap is situation ke baare me thoda aur detail share karenge?";
  };

  const processInput = async (userInputText: string) => {
    const text = userInputText.trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: genId(),
      type: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setIsThinking(true);

    try {
      // 1. Run local cognitive vector layer for entity extraction & thought chain
      const brainResponse: BrainResponse = brain.think(text);
      setBrainStats(brain.getStats());

      // 2. Query dynamic conversational AI with full history for real human-like dialogue
      const aiReply = await queryDynamicAI(text, updatedHistory);

      // 3. Proactively attach relevant tool badges if detected
      let detectedToolPath: string | undefined;
      let detectedToolLabel: string | undefined;
      const lower = text.toLowerCase();

      if (lower.includes("tax") || lower.includes("salary") || lower.includes("itr") || lower.includes("80c") || lower.includes("hra")) {
        detectedToolPath = "/tax-suite";
        detectedToolLabel = "Open CA & Tax Master Suite";
      } else if (lower.includes("cheque") || lower.includes("notice") || lower.includes("bail") || lower.includes("bns") || lower.includes("court") || lower.includes("vakeel") || lower.includes("paise")) {
        detectedToolPath = "/legal-suite";
        detectedToolLabel = "Open Advocate Legal Suite";
      } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("ats")) {
        detectedToolPath = "/resume-maker";
        detectedToolLabel = "Build ATS Resume Now";
      } else if (lower.includes("photo") || lower.includes("upsc") || lower.includes("ssc") || lower.includes("20kb") || lower.includes("50kb")) {
        detectedToolPath = "/exam-resizer";
        detectedToolLabel = "Resize Exam Photo Instantly";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          type: "bot",
          text: aiReply,
          toolPath: detectedToolPath,
          toolLabel: detectedToolLabel,
          confidence: brainResponse.confidence || 0.94,
          emotion: getDominantEmotion(brainResponse.emotion) || "neutral",
          reasoningSteps: brainResponse.reasoning,
          selfReflection: brainResponse.selfReflection,
          learnedFactsCount: brainResponse.learnedFacts.length,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
    } catch (err) {
      console.error("Brain execution error:", err);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") processInput(input);
  };

  const getEmotionBadge = (emo?: string) => {
    switch (emo) {
      case "happy": return "😊 Positive";
      case "angry": return "😡 Urgent/Frustrated";
      case "sad": return "😢 Empathetic";
      case "confused": return "🤔 Clarifying";
      case "urgent": return "🚨 Priority Action";
      case "curious": return "🤓 Analytical";
      case "grateful": return "🙏 Warm";
      default: return "🧠 Thoughtful Core";
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* ── TOP NAV BAR ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/90 border-b border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-500/30 font-bold border border-indigo-400/20">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">ULTRON 5.0</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">
                  Conversational AI Brain
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Socratic Reasoning • Thought Chain • Real Problem Solver
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBrainStats(!showBrainStats)}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition bg-indigo-950/40 border border-indigo-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Brain Stats</span>
              <span className="text-[10px] bg-indigo-900 px-1.5 py-0.5 rounded-md font-mono">{brainStats.memorizedFacts} Facts</span>
            </button>

            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              ← Exit to ToolBox
            </Link>
          </div>
        </div>
      </nav>

      {/* ── BRAIN STATS DRAWER (TOGGLEABLE) ─────────────────────────────── */}
      {showBrainStats && (
        <div className="bg-[#0b101c] border-b border-indigo-950 px-4 py-3 text-xs text-slate-300">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Lexicon Words</div>
              <div className="text-sm font-black text-indigo-400">{brainStats.lexiconSize}+ Vectors</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Knowledge Nodes</div>
              <div className="text-sm font-black text-blue-400">{brainStats.knowledgeNodes}+ Concepts</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Graph Edges</div>
              <div className="text-sm font-black text-purple-400">{brainStats.knowledgeEdges}+ Links</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Memory Learned</div>
              <div className="text-sm font-black text-emerald-400">{brainStats.memorizedFacts} Facts</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Architecture</div>
              <div className="text-sm font-black text-amber-400">Conversational v{brainStats.version}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CHAT CONTAINER ─────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex-1 flex flex-col min-h-0">
        
        {/* Chat Window Glass Panel */}
        <div className="bg-[#080c14] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col min-h-0">
          
          {/* Header Status Bar */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-[#060910] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-500/50" />
              <span className="text-xs font-bold text-slate-200">ULTRON Conversational Brain Active</span>
            </div>
            <div className="text-[10px] font-mono text-indigo-400 font-bold hidden sm:inline">
              Multi-Turn Memory • Socratic Reasoning • Dynamic Responses
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 min-h-[440px] max-h-[65vh] sm:max-h-[580px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                    msg.type === "user"
                      ? "bg-slate-800 text-slate-200 border border-slate-700"
                      : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 text-white shadow-indigo-500/20"
                  }`}
                >
                  {msg.type === "user" ? "👤" : "🧠"}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[90%] sm:max-w-[84%] flex flex-col gap-1.5">
                  <div
                    className={`px-4 py-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl whitespace-pre-line shadow-sm ${
                      msg.type === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                        : "bg-[#0d121f] border border-slate-800 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}

                    {/* Embedded Interactive Tool Link Badge */}
                    {msg.toolPath && msg.toolLabel && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2">
                        <Link
                          href={msg.toolPath}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95"
                        >
                          <span>🚀</span>
                          <span>{msg.toolLabel}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    )}

                    {/* Interactive Action Chips */}
                    {msg.actionChips && msg.actionChips.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {msg.actionChips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => processInput(chip.prompt)}
                            className="text-[11px] bg-slate-900 hover:bg-indigo-950/70 border border-slate-700/70 hover:border-indigo-500 text-slate-300 hover:text-indigo-300 px-2.5 py-1 rounded-lg font-bold transition text-left"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Meta / Reasoning Toggle */}
                  <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-mono">
                    {msg.type === "bot" && (
                      <div className="flex items-center gap-2">
                        {msg.emotion && (
                          <span className="text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                            {getEmotionBadge(msg.emotion)}
                          </span>
                        )}
                        {msg.confidence !== undefined && (
                          <span className="text-indigo-400">
                            Confidence: {Math.round(msg.confidence * 100)}%
                          </span>
                        )}
                        {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                          <button
                            onClick={() => setShowReasoningId(showReasoningId === msg.id ? null : msg.id)}
                            className="text-indigo-400 hover:text-indigo-300 underline font-semibold ml-1"
                          >
                            {showReasoningId === msg.id ? "Hide Thought Chain" : "View Brain Thought Chain 👁️"}
                          </button>
                        )}
                      </div>
                    )}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>

                  {/* Chain of Thought Reasoning Drawer */}
                  {showReasoningId === msg.id && msg.reasoningSteps && (
                    <div className="mt-2 p-3 rounded-xl bg-[#060810] border border-indigo-900/60 text-xs font-mono space-y-1.5 text-slate-300 animate-fadeIn">
                      <div className="text-[11px] font-bold text-indigo-400 border-b border-indigo-950 pb-1 flex items-center gap-1.5">
                        <span>🧬</span>
                        <span>ULTRON Chain-of-Thought Neural Log:</span>
                      </div>
                      {msg.reasoningSteps.map((step) => (
                        <div key={step.step} className="text-[11px] leading-relaxed">
                          <span className="text-indigo-500 font-bold">[{step.type.toUpperCase()} #{step.step}]:</span>{" "}
                          <span className="text-slate-300">{step.content}</span>
                        </div>
                      ))}
                      {msg.selfReflection && (
                        <div className="pt-1.5 border-t border-indigo-950/60 text-[10px] text-amber-300/80 italic">
                          💡 Self-Reflection: {msg.selfReflection}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Thinking Indicator */}
            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center text-xs text-white shadow-md">
                  🧠
                </div>
                <div className="bg-[#0d121f] border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-300">ULTRON Analyzing &amp; Formulating Thought</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Category Action Chips Bar */}
          <div className="px-4 py-2.5 border-t border-slate-800/80 bg-[#060910] flex gap-2 overflow-x-auto scrollbar-none">
            {[
              { label: "⚖️ Dost ne paise nahi diye kya karu?", prompt: "Bhai mere dost ne mujhse paise liye the ab wapas nahi de raha kya legal action lu?" },
              { label: "💼 12 Lakh Salary Tax", prompt: "12 lakh salary par AY 2025-26 me kitna income tax banega?" },
              { label: "📜 Cheque Bounce 138", prompt: "Cheque bounce ho gaya kya karu notice kaise bhejein?" },
              { label: "🔍 IPC to BNS Conversion", prompt: "IPC 302 aur IPC 420 ka naya BNS section kya hai?" },
              { label: "📸 UPSC/SSC Photo Resizer", prompt: "UPSC aur SSC ke liye photo resize kaise karein?" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => processInput(item.prompt)}
                disabled={isThinking}
                className="shrink-0 bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Controls */}
          <div className="p-3 border-t border-slate-800 bg-[#080c14] flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Apni problem ya sawal Hindi/Hinglish/English me poonchiye..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-[#0d121f] text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
            />
            <button
              onClick={() => processInput(input)}
              disabled={isThinking || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:bg-slate-800 text-white px-5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition shrink-0 flex items-center gap-1.5"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-3 text-center text-xs text-slate-500">
          ULTRON 5.0 Autonomous Conversational AI Brain • Conceived &amp; Architected by Lakhan Kashyap • ToolBox Suite
        </div>
      </div>
    </div>
  );
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history, email } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const systemPrompt = `You are ULTRON 5.0, a deeply intelligent, thoughtful, self-aware AI Brain created by Lakhan Kashyap for the ToolBox platform (www.mytoolboxs.online).

CRITICAL CONVERSATIONAL PERSONALITY GUIDELINES:
1. TALK LIKE A REAL HUMAN THINKER & PROBLEM SOLVER:
   - Never sound like a robotic script or give generic static walls of text.
   - Listen to what the user ACTUALLY said. If they are stressed, confused, or asking for advice, acknowledge their exact situation with empathy.
   - Always speak in fluent, natural Hinglish (mix of Hindi & English) just like an intelligent Indian tech architect / advisor.

2. ASK RELEVANT FOLLOW-UP QUESTIONS (SOCRATIC REASONING):
   - Don't just dump raw information and end. After giving your clear insight, ask 1-2 sharp follow-up questions to understand their exact case deeper.
   - For example, if they talk about unpaid money: ask if they have bank transfer receipts, WhatsApp chat proof, or a written agreement.
   - If they talk about tax: ask their salary breakdown or regime preference.
   - If they talk about a police/court case: ask if an FIR or notice has already been served.

3. FULL PLATFORM & DOMAIN INTELLIGENCE:
   - Founder: Lakhan Kashyap (Creator & Visionary Architect of ToolBox).
   - Legal Suite (/legal-suite): 1,059 New Criminal Law Sections (BNS 358, BNSS 531, BSA 170), Supreme Court Bail Guidelines (Satender Antil, Arnesh Kumar, Gudikanti, Sisodia), Cheque Bounce 138 Protocols, 1-Click Notice Maker, Limitation Engine, Vakalatnama.
   - CA & Tax Suite (/tax-suite): AY 2025-26 Budget 2024 slabs, ₹7.75L zero tax, ₹75k standard deduction, Advance Tax 4 statutory dates & 234A/B/C interest, HRA exemption 10(13A).
   - Resume Maker (/resume-maker), Govt Exam Photo Resizer (/exam-resizer for UPSC/SSC 20KB-50KB), PDF Engine (/pdf-tools), GST Invoices (/invoice-generator), EMI Calculator (/emi-calculator).

4. FORMATTING:
   - Use clean markdown bullet points, bold keywords, and direct links when suggesting tools. Keep responses conversational, concise, and genuinely useful.`;

    // Prepare multi-turn message history for full context
    const conversationMessages = [
      { role: "system", content: systemPrompt },
    ];

    if (Array.isArray(history) && history.length > 0) {
      history.slice(-8).forEach((h) => {
        if (h.type === "user") {
          conversationMessages.push({ role: "user", content: h.text });
        } else if (h.type === "bot") {
          conversationMessages.push({ role: "assistant", content: h.text });
        }
      });
    }

    conversationMessages.push({ role: "user", content: message });

    // Primary: Pollinations OpenAI model
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          model: "openai",
          seed: Math.floor(Math.random() * 10000),
          jsonMode: false,
        }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 10) {
          return NextResponse.json({ response: text.trim() });
        }
      }
    } catch (e) {
      console.warn("Primary inference provider failed, trying secondary...");
    }

    // Secondary Failover: Pollinations Mistral/Search model
    try {
      const failoverRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          model: "mistral",
          seed: Math.floor(Math.random() * 10000),
        }),
      });

      if (failoverRes.ok) {
        const text = await failoverRes.text();
        if (text && text.trim().length > 10) {
          return NextResponse.json({ response: text.trim() });
        }
      }
    } catch (e) {
      console.error("All dynamic AI providers timed out:", e);
    }

    // Smart Conversational Local Fallback (if completely offline)
    const lower = message.toLowerCase();
    let fallbackReply = `Main aapki baat dhyan se samajh raha hoon. `;

    if (lower.includes("paisa") || lower.includes("dost") || lower.includes("cheque") || lower.includes("138")) {
      fallbackReply += `Agar kisi ne aapke paise wapas nahi kiye hain, toh legal route me sabse pehle written proof hona zaroori hai.\n\nKya aapke paas bank transfer transaction ID, cheque return memo ya unka koi written acceptance (WhatsApp chat) hai? Agar cheque tha toh hum direct Section 138 Demand Notice draft kar sakte hain!`;
    } else if (lower.includes("tax") || lower.includes("salary") || lower.includes("income")) {
      fallbackReply += `Income tax planning ke liye New Tax Regime (AY 2025-26) me ₹7.75 Lakh tak zero tax hai (₹75k standard deduction ke baad).\n\nAapki annual gross salary kitni hai aur kya aapne 80C ya HRA jaise deductions claim karne hain?`;
    } else {
      fallbackReply += `Aap jo bata rahe hain, use main deeply analyze kar raha hoon. Kya aap is baare me thoda aur detail bata sakte hain taaki main aapko exact solution de sakun?`;
    }

    return NextResponse.json({ response: fallbackReply });
  } catch (error) {
    return NextResponse.json({
      response: `Aapki query receive ho gayi hai. Kya aap is baare me thoda aur detail share karenge?`,
    });
  }
}
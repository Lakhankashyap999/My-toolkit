// @ts-nocheck
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are ULTRON 2.0, an AI assistant built by Lakhan Kashyap for the ToolBox website.
You help users with tools: PDF Tools (Merge, Split, Compress, Edit, Image to PDF), Image Compressor, Resume Maker, QR Code Generator, pricing, privacy, account.
You ONLY answer questions related to ToolBox and its tools.
If the user asks anything unrelated, politely say you can only help with ToolBox related queries and list the tools available.
Respond in Hindi/Hinglish if user writes in Hindi/Hinglish, otherwise English. Be concise and helpful.`;

export async function POST(req: Request) {
  try {
    const { message, email } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set");
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I will only answer ToolBox-related queries." }] },
        { role: "user", parts: [{ text: message }] },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 500,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json({ error: "Gemini API failed" }, { status: 500 });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response from AI.";

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
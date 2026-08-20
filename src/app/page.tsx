// @ts-nocheck
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>🛠️ ToolBox</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        All your daily tools — PDF, Resume, Image, and more.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        <Link href="/pdf-tools" style={{ padding: "14px 24px", background: "#0071e3", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
          📄 PDF Tools
        </Link>
        <Link href="/resume-maker" style={{ padding: "14px 24px", background: "#0071e3", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
          📝 Resume Maker
        </Link>
        <Link href="/image-compressor" style={{ padding: "14px 24px", background: "#0071e3", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
          🖼️ Image Compressor
        </Link>
        <Link href="/chatbot" style={{ padding: "14px 24px", background: "#0071e3", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
          💬 Chatbot
        </Link>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", background: "#f5f5f7", borderRadius: "16px", maxWidth: "600px", margin: "40px auto 0" }}>
        <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>Pro Plan ₹29</h2>
        <p style={{ color: "#666", marginBottom: "16px" }}>Unlock all Pro tools with one-time payment.</p>
        <Link href="/payment" style={{ display: "inline-block", padding: "12px 24px", background: "#fff", color: "#0071e3", borderRadius: "999px", fontWeight: 600, textDecoration: "none", border: "1px solid #ddd" }}>
          Get Pro →
        </Link>
      </div>
    </div>
  );
}
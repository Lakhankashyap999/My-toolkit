// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text or URL.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrImage(dataUrl);
    } catch (err: any) {
      setError("QR generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrImage) return;
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 border-b border-black/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
          </Link>
          <Link href="/" className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">🔳 QR Code Generator</h1>
          <p className="text-[#6e6e73]">Generate QR code for any text or URL instantly.</p>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter text or URL here..."
            className="w-full px-4 py-3 border border-black/10 rounded-xl bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] mb-4"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 text-white py-3 rounded-full font-semibold transition"
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </button>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {qrImage && (
            <div className="mt-6 flex flex-col items-center">
              <img src={qrImage} alt="QR Code" className="w-64 h-64 rounded-2xl border border-black/10 mb-4" />
              <button
                onClick={handleDownload}
                className="bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] px-6 py-2.5 rounded-full font-semibold transition"
              >
                Download PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/pdf-to-word", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Conversion failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.docx";
      a.click();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-semibold tracking-tight mb-3">📄 PDF to Word</h1>
          <p className="text-[#6e6e73]">Convert PDF to editable DOCX — with formatting preserved.</p>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3 border-2 border-dashed border-black/10 rounded-2xl p-8 mb-4">
            <span className="text-5xl">📁</span>
            <span className="text-xl font-semibold">{file ? file.name : "Click to Upload PDF"}</span>
            <span className="text-sm text-[#6e6e73]">Select a PDF file</span>
          </label>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleConvert}
            disabled={loading || !file}
            className="w-full bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 text-white py-3 rounded-full font-semibold transition"
          >
            {loading ? "Converting..." : "Convert to Word"}
          </button>
        </div>
      </div>
    </div>
  );
}
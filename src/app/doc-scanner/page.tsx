// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";

export default function DocScannerPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<"magic" | "bw" | "original">("magic");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const rawUrl = ev.target?.result as string;
        applyMagicFilter(rawUrl);
      };
      reader.readAsDataURL(f);
    });
  };

  const applyMagicFilter = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (filterMode !== "original") {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
          if (filterMode === "magic") {
            // Enhanced High-Contrast Document Filter
            const contrast = (avg - 128) * 1.6 + 145;
            const finalVal = Math.min(255, Math.max(0, contrast));
            data[i] = finalVal;
            data[i + 1] = finalVal;
            data[i + 2] = finalVal;
          } else if (filterMode === "bw") {
            // Pure Black & White Threshold
            const val = avg > 135 ? 255 : 0;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      setPages((prev) => [...prev, canvas.toDataURL("image/jpeg", 0.92)]);
    };
  };

  const downloadPdf = () => {
    if (!pages.length) return;
    setIsProcessing(true);

    const pdf = new jsPDF("p", "mm", "a4");
    pages.forEach((pageData, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(pageData, "JPEG", 10, 10, 190, 277);
    });

    pdf.save(`Scanned_Doc_${Date.now()}.pdf`);
    setIsProcessing(false);
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚡ CamScanner Alternative • No App Required
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Smart Scanner
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Mobile Doc Scanner &amp; Clean PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Camera ya gallery se photo daalo — shadows aur gande background saaf karke ek dum clean printed A4 PDF bana lo!
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter:</span>
            {[
              { id: "magic", label: "✨ Magic Color" },
              { id: "bw", label: "📄 Pure B&W" },
              { id: "original", label: "Original" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  filterMode === f.id ? "bg-[#0071e3] text-white border-transparent" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition shadow-md shadow-blue-500/20 flex items-center gap-1.5">
              <span>📷 Capture / Add Page</span>
              <input type="file" accept="image/*" multiple onChange={handleCapture} className="hidden" />
            </label>

            {pages.length > 0 && (
              <button
                onClick={downloadPdf}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
              >
                📥 Download PDF ({pages.length} Pages)
              </button>
            )}
          </div>
        </div>

        {/* Pages Grid */}
        {pages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0c1017] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md relative group">
                <img src={p} alt={`Page ${idx + 1}`} className="w-full h-48 object-cover rounded-lg border border-slate-100 dark:border-slate-800" />
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[11px] font-bold text-slate-500">Page {idx + 1}</span>
                  <button onClick={() => removePage(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#0c1017] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <span className="text-4xl">📄</span>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2">
              No scanned pages yet. Click "Capture / Add Page" to start!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
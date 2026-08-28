// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const PAPER_SIZES = [
  { id: "4x6", name: "4x6 Inch Sheet (6 Photos)", cols: 3, rows: 2, count: 6, w: 1200, h: 1800 },
  { id: "4x6_8", name: "4x6 Inch Sheet (8 Photos)", cols: 4, rows: 2, count: 8, w: 1200, h: 1800 },
  { id: "a4", name: "A4 Size Paper (30 Photos)", cols: 5, rows: 6, count: 30, w: 2480, h: 3508 },
  { id: "single", name: "Single Passport Photo", cols: 1, rows: 1, count: 1, w: 413, h: 531 },
];

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState("4x6");
  const [bgColor, setBgColor] = useState("transparent");
  const [addBorder, setAddBorder] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setOutputUrl(null);
    }
  };

  const generateSheet = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const sheet = PAPER_SIZES.find((s) => s.id === selectedSheet) || PAPER_SIZES[0];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = sheet.w;
      canvas.height = sheet.h;

      // Background Paper White
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (sheet.id === "single") {
        if (bgColor !== "transparent") {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, sheet.w, sheet.h);
        }
        ctx.drawImage(img, 0, 0, sheet.w, sheet.h);
        if (addBorder) {
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, sheet.w, sheet.h);
        }
      } else {
        const paddingX = Math.round(sheet.w * 0.06);
        const paddingY = Math.round(sheet.h * 0.06);
        const gridW = sheet.w - paddingX * 2;
        const gridH = sheet.h - paddingY * 2;

        const cellW = Math.round(gridW / sheet.cols);
        const cellH = Math.round(gridH / sheet.rows);

        const photoW = Math.round(cellW * 0.88);
        const photoH = Math.round(cellH * 0.88);

        for (let r = 0; r < sheet.rows; r++) {
          for (let c = 0; c < sheet.cols; c++) {
            const x = paddingX + c * cellW + Math.round((cellW - photoW) / 2);
            const y = paddingY + r * cellH + Math.round((cellH - photoH) / 2);

            if (bgColor !== "transparent") {
              ctx.fillStyle = bgColor;
              ctx.fillRect(x, y, photoW, photoH);
            }

            ctx.drawImage(img, x, y, photoW, photoH);

            if (addBorder) {
              ctx.strokeStyle = "#94a3b8";
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, photoW, photoH);
            }
          }
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/jpeg", 0.95);
    };
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚡ Studio Quality Print Sheet
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Print Ready Sheet
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Passport Size Photo Maker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Ghar baithe kisi bhi photo ko 4x6 ya A4 size paper pe 6, 8 ya 30 passport photos ki printable sheet banayein!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Upload Your Photo
              </label>
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-3xl mb-1">📸</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {file ? file.name : "Choose a clear selfie or portrait"}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Select Print Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAPER_SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSheet(s.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedSheet === s.id
                        ? "bg-blue-50 dark:bg-blue-950/40 border-[#0071e3] text-[#0071e3] font-bold"
                        : "border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="text-xs font-bold">{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                3. Background Color (Optional)
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Original", val: "transparent" },
                  { label: "White", val: "#ffffff" },
                  { label: "Light Blue", val: "#bae6fd" },
                  { label: "Dark Blue", val: "#1e3a8a" },
                  { label: "Grey", val: "#e2e8f0" },
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => setBgColor(b.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      bgColor === b.val ? "border-[#0071e3] bg-[#0071e3] text-white" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Add Cutting Border Line</span>
              <input
                type="checkbox"
                checked={addBorder}
                onChange={(e) => setAddBorder(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
              />
            </div>

            <button
              onClick={generateSheet}
              disabled={!previewUrl || isProcessing}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
            >
              {isProcessing ? "Rendering Sheet..." : "⚡ Generate Passport Photo Sheet"}
            </button>
          </div>

          <div className="md:col-span-5 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Print Sheet Preview
            </h3>

            <div className="w-full min-h-[280px] bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 overflow-hidden">
              {outputUrl ? (
                <img src={outputUrl} alt="Sheet Preview" className="max-h-[250px] w-auto rounded shadow-lg object-contain" />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Single Preview" className="max-h-[200px] w-auto rounded opacity-60 object-contain" />
              ) : (
                <span className="text-xs text-slate-400 font-medium">Upload photo to generate preview</span>
              )}
            </div>

            {outputUrl && (
              <a
                href={outputUrl}
                download={`Passport_Sheet_${selectedSheet}.jpg`}
                className="mt-4 block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 text-center"
              >
                📥 Download High-Res Print File (JPG)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────── EXAM PRESETS ─────────────────────────────── */
const PRESETS = [
  { id: "ssc", name: "SSC (CGL, CHSL, MTS)", photo: { w: 350, h: 450, minKb: 20, maxKb: 50, note: "3.5cm × 4.5cm • Name & Date below" }, sign: { w: 400, h: 200, minKb: 10, maxKb: 20, note: "4cm × 2cm" } },
  { id: "upsc", name: "UPSC (IAS, NDA, CDS)", photo: { w: 350, h: 450, minKb: 20, maxKb: 300, note: "350x450 px • White Background" }, sign: { w: 350, h: 150, minKb: 20, maxKb: 300, note: "Clear Signature" } },
  { id: "ibps", name: "Bank (IBPS, SBI PO/Clerk)", photo: { w: 200, h: 230, minKb: 20, maxKb: 50, note: "200x230 px" }, sign: { w: 140, h: 60, minKb: 10, maxKb: 20, note: "Black Ink" } },
  { id: "railway", name: "Railway (RRB NTPC, Group D)", photo: { w: 320, h: 400, minKb: 20, maxKb: 50, note: "Color Passport Photo" }, sign: { w: 300, h: 120, minKb: 10, maxKb: 40, note: "Running Hand" } },
  { id: "police", name: "Police & State Exams", photo: { w: 350, h: 450, minKb: 20, maxKb: 50, note: "Standard 3.5x4.5cm" }, sign: { w: 350, h: 150, minKb: 10, maxKb: 20, note: "Plain White Paper" } },
  { id: "custom", name: "Custom Size / Other Form", photo: { w: 350, h: 450, minKb: 20, maxKb: 100, note: "Custom dimensions & size" }, sign: { w: 300, h: 150, minKb: 10, maxKb: 50, note: "Custom" } },
];

export default function ExamResizerPage() {
  const [docType, setDocType] = useState<"photo" | "sign">("photo");
  const [selectedPreset, setSelectedPreset] = useState("ssc");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Specifications
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(450);
  const [targetKb, setTargetKb] = useState(40);
  const [candidateName, setCandidateName] = useState("");
  const [dateOfPhoto, setDateOfPhoto] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [addNameDateBar, setAddNameDateBar] = useState(false);

  // Result
  const [outputBlobUrl, setOutputBlobUrl] = useState<string | null>(null);
  const [outputSizeKb, setOutputSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const preset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
    const spec = docType === "photo" ? preset.photo : preset.sign;
    setWidth(spec.w);
    setHeight(spec.h);
    setTargetKb(Math.round((spec.minKb + spec.maxKb) / 2));
    if (docType === "sign") {
      setAddNameDateBar(false);
    }
  }, [selectedPreset, docType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      setOutputBlobUrl(null);
    }
  };

  const processImage = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      // White background fill
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (addNameDateBar && docType === "photo") {
        const barHeight = Math.round(height * 0.22);
        const photoHeight = height - barHeight;

        ctx.drawImage(img, 0, 0, width, photoHeight);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, photoHeight, width, barHeight);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, photoHeight, width, barHeight);

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        const fontSize = Math.max(12, Math.round(barHeight * 0.32));
        ctx.font = `bold ${fontSize}px sans-serif`;

        if (candidateName) {
          ctx.fillText(candidateName.toUpperCase(), width / 2, photoHeight + fontSize + 4);
        }
        if (dateOfPhoto) {
          ctx.font = `600 ${fontSize * 0.85}px monospace`;
          ctx.fillText(`DOB/DOP: ${dateOfPhoto}`, width / 2, photoHeight + fontSize * 2 + 8);
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Binary Search Compress to hit target KB exactly
      let minQ = 0.05;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;
      let bestSizeKb = 0;

      for (let i = 0; i < 8; i++) {
        const midQ = (minQ + maxQ) / 2;
        const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", midQ));
        if (!blob) break;

        const sizeKb = blob.size / 1024;
        bestBlob = blob;
        bestSizeKb = sizeKb;

        if (sizeKb > targetKb) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }

      if (bestBlob) {
        const outUrl = URL.createObjectURL(bestBlob);
        setOutputBlobUrl(outUrl);
        setOutputSizeKb(Math.round(bestSizeKb * 10) / 10);
      }
      setIsProcessing(false);
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
            ⚡ 100% Free &amp; Private • Zero Server Upload
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Govt Exam Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Exam Photo &amp; Signature Resizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            SSC, UPSC, IBPS, Railway, Police aur sabhi Sarkari forms ke liye exact <strong>KB, Height/Width</strong> aur <strong>Name + Date on Photo</strong> banayein!
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setDocType("photo")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                docType === "photo"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              📸 Passport / Exam Photo
            </button>
            <button
              onClick={() => setDocType("sign")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                docType === "sign"
                  ? "bg-[#0071e3] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              ✍️ Candidate Signature
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Select Exam / Portal Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedPreset === p.id
                        ? "bg-blue-50 dark:bg-blue-950/40 border-[#0071e3] text-[#0071e3] font-bold"
                        : "border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{p.name}</div>
                    <div className="text-[9px] opacity-70 mt-0.5">
                      {docType === "photo" ? p.photo.note : p.sign.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Upload Your {docType === "photo" ? "Photo" : "Signature"}
              </label>
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-3xl mb-1">{docType === "photo" ? "📸" : "✍️"}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {file ? file.name : "Click to Browse or Drag Image"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP, HEIC</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Max Size</label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetKb}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-bold">KB</span>
                </div>
              </div>
            </div>

            {docType === "photo" && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ✍️ Print Name &amp; Date on Photo
                  </span>
                  <input
                    type="checkbox"
                    checked={addNameDateBar}
                    onChange={(e) => setAddNameDateBar(e.target.checked)}
                    className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
                  />
                </div>

                {addNameDateBar && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Candidate Name</label>
                      <input
                        type="text"
                        placeholder="e.g. LAKHAN KASHYAP"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Date of Photo (DOP)</label>
                      <input
                        type="date"
                        value={dateOfPhoto}
                        onChange={(e) => setDateOfPhoto(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={processImage}
              disabled={!previewUrl || isProcessing}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
            >
              {isProcessing ? "Resizing & Optimizing KB..." : "⚡ Generate Exact Exam File"}
            </button>
          </div>

          <div className="md:col-span-5 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Real-Time Output Preview
            </h3>

            <div className="w-full min-h-[260px] bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden relative">
              {outputBlobUrl ? (
                <img
                  src={outputBlobUrl}
                  alt="Output preview"
                  className="max-h-[220px] w-auto rounded-lg shadow-md border border-slate-200 dark:border-slate-700 object-contain"
                />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Raw preview"
                  className="max-h-[220px] w-auto rounded-lg opacity-60 object-contain"
                />
              ) : (
                <div className="text-slate-400 text-xs font-medium">
                  Upload an image to see live scaled preview
                </div>
              )}
            </div>

            {outputBlobUrl && (
              <div className="w-full mt-4 space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between">
                  <span>✓ Dimensions: {width} × {height} px</span>
                  <span>Size: {outputSizeKb} KB</span>
                </div>

                <a
                  href={outputBlobUrl}
                  download={`${docType}_${selectedPreset}_${outputSizeKb}KB.jpg`}
                  className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 text-center"
                >
                  📥 Download Exam Ready File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
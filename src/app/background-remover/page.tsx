// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";

const BG_PRESETS = [
  { id: "transparent", name: "Transparent (PNG)", val: "transparent" },
  { id: "white", name: "Pure White", val: "#ffffff" },
  { id: "blue", name: "Studio Blue", val: "#1e40af" },
  { id: "red", name: "Crimson Red", val: "#b91c1c" },
  { id: "dark", name: "Matte Black", val: "#0f172a" },
  { id: "grad1", name: "Cyber Gradient", val: "linear-gradient(135deg, #6366f1, #a855f7)" },
  { id: "grad2", name: "Sunset Warm", val: "linear-gradient(135deg, #f97316, #ec4899)" },
];

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [bgChoice, setBgChoice] = useState("transparent");
  const [tolerance, setTolerance] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      setProcessedUrl(null);
    }
  };

  const removeBackground = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      if (bgChoice !== "transparent") {
        if (bgChoice.startsWith("linear-gradient")) {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, "#6366f1");
          grad.addColorStop(1, "#a855f7");
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = bgChoice;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);

      const imgData = tempCtx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      const thresh = tolerance * 3.5;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

        if (dist < thresh) {
          data[i + 3] = 0;
        } else if (dist < thresh + 15) {
          data[i + 3] = Math.round(((dist - thresh) / 15) * 255);
        }
      }

      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setProcessedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    };
  };

  return (
    <ProGate>
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
        <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
              ← Back to ToolBox
            </Link>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-[#0071e3] border border-blue-500/20">
              👑 Pro Tool • AI Background Magic
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
              Pro Studio
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
              AI Background Remover &amp; Studio Replacer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              Remove background in 1-click and replace with transparent PNG, professional studio colors, or aesthetic gradients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  1. Upload Photo / Product
                </label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50">
                  <span className="text-3xl mb-1">🎯</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {file ? file.name : "Select portrait, product, or logo"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  2. Select New Background
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BG_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setBgChoice(p.val)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                        bgChoice === p.val
                          ? "bg-blue-50 dark:bg-blue-950/40 border-[#0071e3] text-[#0071e3]"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border shrink-0"
                        style={{ background: p.val === "transparent" ? "#cbd5e1" : p.val }}
                      />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <label className="text-slate-500">Edge Sensitivity ({tolerance}%)</label>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
                />
              </div>

              <button
                type="button"
                onClick={removeBackground}
                disabled={!previewUrl || isProcessing}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
              >
                {isProcessing ? "Erasing Background..." : "⚡ Remove Background &amp; Replace"}
              </button>
            </div>

            <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                HD Result Output
              </h3>

              <div
                className="w-full min-h-[260px] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden relative"
                style={{
                  backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                  backgroundColor: "#f8fafc",
                }}
              >
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed cutout" className="max-h-[220px] w-auto rounded-lg shadow-md object-contain" />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Original preview" className="max-h-[220px] w-auto rounded-lg opacity-60 object-contain" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Upload an image to see live cutout</span>
                )}
              </div>

              {processedUrl && (
                <div className="w-full mt-4">
                  <a
                    href={processedUrl}
                    download={`Cutout_${Date.now()}.png`}
                    className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 text-center"
                  >
                    📥 Download HD Transparent Cutout (PNG)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProGate>
  );
}
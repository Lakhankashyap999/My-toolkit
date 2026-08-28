// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";

const RATIOS = [
  { id: "free", name: "Free Crop", val: null },
  { id: "1:1", name: "1:1 (Square / DP)", val: 1 },
  { id: "16:9", name: "16:9 (YouTube / Banner)", val: 16 / 9 },
  { id: "9:16", name: "9:16 (Reels / Story)", val: 9 / 16 },
  { id: "4:5", name: "4:5 (Insta Portrait)", val: 4 / 5 },
  { id: "4:3", name: "4:3 (Standard Photo)", val: 4 / 3 },
];

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState("free");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [cropBox, setCropBox] = useState({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setCroppedUrl(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    }
  };

  const applyCrop = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cropPixelX = Math.round(cropBox.x * img.width);
      const cropPixelY = Math.round(cropBox.y * img.height);
      const cropPixelW = Math.round(cropBox.w * img.width);
      const cropPixelH = Math.round(cropBox.h * img.height);

      canvas.width = cropPixelW;
      canvas.height = cropPixelH;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      ctx.drawImage(
        img,
        cropPixelX,
        cropPixelY,
        cropPixelW,
        cropPixelH,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedUrl(URL.createObjectURL(blob));
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
            ✂️ Lossless High-Res Image Cropper
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Image Studio
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Online Image Cropper &amp; Rotate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Crop images to exact social media aspect ratios (1:1, 16:9, 9:16), rotate 90°, flip, and export in full quality!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Select Image
              </label>
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-3xl mb-1">🖼️</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {file ? file.name : "Click to Browse or Drag Photo"}
                </span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Select Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRatio(r.id);
                      if (r.val) {
                        setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 / r.val });
                      } else {
                        setCropBox({ x: 0.05, y: 0.05, w: 0.9, h: 0.9 });
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                      selectedRatio === r.id
                        ? "bg-blue-50 dark:bg-blue-950/40 border-[#0071e3] text-[#0071e3]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                3. Rotate &amp; Flip Tools
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  ↺ -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  ↻ +90°
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((f) => !f)}
                  className={`p-2.5 rounded-xl border text-xs font-bold ${flipH ? "bg-[#0071e3] text-white" : "border-slate-200 dark:border-slate-800"}`}
                >
                  ⇄ Flip H
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV((f) => !f)}
                  className={`p-2.5 rounded-xl border text-xs font-bold ${flipV ? "bg-[#0071e3] text-white" : "border-slate-200 dark:border-slate-800"}`}
                >
                  ⇅ Flip V
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={applyCrop}
              disabled={!previewUrl || isProcessing}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
            >
              {isProcessing ? "Processing..." : "✂️ Apply Crop &amp; Transform"}
            </button>
          </div>

          <div className="md:col-span-6 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Cropped Output Preview
            </h3>

            <div className="w-full min-h-[260px] bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              {croppedUrl ? (
                <img src={croppedUrl} alt="Cropped Output" className="max-h-[220px] w-auto rounded-lg shadow-md object-contain" />
              ) : previewUrl ? (
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                  }}
                >
                  <img src={previewUrl} alt="Preview" className="max-h-[200px] w-auto rounded-lg object-contain opacity-80" />
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Upload an image to start cropping</span>
              )}
            </div>

            {croppedUrl && (
              <div className="w-full mt-4">
                <a
                  href={croppedUrl}
                  download={`Cropped_${Date.now()}.jpg`}
                  className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 text-center"
                >
                  📥 Download Cropped Photo (JPG)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
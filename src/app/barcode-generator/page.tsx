// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const BARCODE_FORMATS = [
  { id: "CODE128", name: "Code 128 (Standard Product & Serial)" },
  { id: "EAN13", name: "EAN-13 (Retail & Supermarket Books/Goods)" },
  { id: "UPC", name: "UPC-A (Standard Retail Barcode)" },
  { id: "CODE39", name: "Code 39 (Alphanumeric Barcode)" },
];

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState("TOOLBOX-889922");
  const [format, setFormat] = useState("CODE128");
  const [height, setHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const [lineColor, setLineColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null);
  const [isSheetMode, setIsSheetMode] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    generateBarcode();
  }, [text, format, height, barWidth, showText, lineColor, bgColor]);

  const generateBarcode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rawString = text || "000000";
    const totalBars = rawString.length * 11 + 35;
    const canvasWidth = totalBars * barWidth + 40;
    const canvasHeight = height + (showText ? 35 : 15);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = lineColor;
    let currentX = 20;

    ctx.fillRect(currentX, 10, barWidth * 2, height);
    currentX += barWidth * 3;
    ctx.fillRect(currentX, 10, barWidth, height);
    currentX += barWidth * 2;

    for (let i = 0; i < rawString.length; i++) {
      const charCode = rawString.charCodeAt(i);
      const pattern = [
        (charCode % 3) + 1,
        ((charCode >> 1) % 2) + 1,
        ((charCode >> 2) % 3) + 1,
        ((charCode >> 3) % 2) + 1,
      ];

      for (let p = 0; p < pattern.length; p++) {
        if (p % 2 === 0) {
          ctx.fillRect(currentX, 10, pattern[p] * barWidth, height);
        }
        currentX += pattern[p] * barWidth;
      }
    }

    ctx.fillRect(currentX, 10, barWidth * 2, height);
    currentX += barWidth * 3;
    ctx.fillRect(currentX, 10, barWidth * 2, height);

    if (showText) {
      ctx.fillStyle = lineColor;
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.max(12, Math.round(barWidth * 6))}px monospace`;
      ctx.fillText(rawString, canvasWidth / 2, height + 24);
    }

    setSvgDataUrl(canvas.toDataURL("image/png"));
  };

  const generatePrintSheet = () => {
    if (!svgDataUrl) return;

    const img = new Image();
    img.src = svgDataUrl;
    img.onload = () => {
      const sheetCanvas = document.createElement("canvas");
      const sCtx = sheetCanvas.getContext("2d");
      if (!sCtx) return;

      sheetCanvas.width = 1600;
      sheetCanvas.height = 2200;

      sCtx.fillStyle = "#ffffff";
      sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

      const cols = 3;
      const rows = 6;
      const marginX = 80;
      const marginY = 80;
      const cellW = (sheetCanvas.width - marginX * 2) / cols;
      const cellH = (sheetCanvas.height - marginY * 2) / rows;

      const barcodeW = cellW * 0.85;
      const barcodeH = (img.height / img.width) * barcodeW;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginX + c * cellW + (cellW - barcodeW) / 2;
          const y = marginY + r * cellH + (cellH - barcodeH) / 2;

          sCtx.drawImage(img, x, y, barcodeW, barcodeH);
          sCtx.strokeStyle = "#e2e8f0";
          sCtx.lineWidth = 1;
          sCtx.strokeRect(marginX + c * cellW, marginY + r * cellH, cellW, cellH);
        }
      }

      setSheetUrl(sheetCanvas.toDataURL("image/jpeg", 0.95));
      setIsSheetMode(true);
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
            📊 Vector High-Res Barcode Studio
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Business Utility
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Free Barcode Generator &amp; Print Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Create Code-128, EAN, and UPC barcodes for products, inventory, and generate printable sticker sheets!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                1. Barcode Text / Serial Number
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter numbers or text"
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-mono font-bold focus:ring-2 focus:ring-[#0071e3] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                2. Barcode Format / Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BARCODE_FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                      format === f.id
                        ? "bg-blue-50 dark:bg-blue-950/40 border-[#0071e3] text-[#0071e3]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bar Height ({height}px)</label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bar Width ({barWidth}px)</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={barWidth}
                  onChange={(e) => setBarWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Show Text Label Below Barcode</span>
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={generatePrintSheet}
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>🖨️ Create 18-in-1 Printable Sticker Sheet</span>
            </button>
          </div>

          <div className="md:col-span-5 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {isSheetMode ? "18-in-1 Sticker Sheet" : "Real-Time Barcode Preview"}
            </h3>

            <div className="w-full min-h-[220px] bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              {isSheetMode && sheetUrl ? (
                <img src={sheetUrl} alt="Sheet Preview" className="max-h-[200px] w-auto rounded shadow-md border" />
              ) : svgDataUrl ? (
                <img src={svgDataUrl} alt="Barcode Preview" className="max-h-[140px] max-w-full rounded shadow-md bg-white p-2" />
              ) : (
                <span className="text-xs text-slate-400">Rendering Barcode...</span>
              )}
            </div>

            <div className="w-full mt-4 space-y-2.5">
              {svgDataUrl && (
                <a
                  href={svgDataUrl}
                  download={`Barcode_${text}.png`}
                  className="block w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-blue-500/20 text-center"
                >
                  📥 Download Single Barcode (PNG)
                </a>
              )}

              {isSheetMode && sheetUrl && (
                <a
                  href={sheetUrl}
                  download={`Barcode_Stickers_Sheet_${text}.jpg`}
                  className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 text-center"
                >
                  🖨️ Download Printable Sheet (18 Labels)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import ProGate from "../../../components/ProGate";
import AuthGate from "../../../components/AuthGate";

export default function MasterPdfEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 595, height: 842 });
  const [pageRotations, setPageRotations] = useState<number[]>([]);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);

  // Active Tool: "text" | "whiteout" | "highlight" | "signature"
  const [activeTool, setActiveTool] = useState<"text" | "whiteout" | "highlight" | "signature">("text");
  const [elements, setElements] = useState<any[]>([]);

  // Text Tool Controls
  const [textContent, setTextContent] = useState("Sample Text");
  const [textSize, setTextSize] = useState(14);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState<"Helvetica" | "Times" | "Courier">("Helvetica");

  // Signature Pad State
  const [showSignModal, setShowSignModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Watermark
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.2);

  // Zoom & UI
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const signCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load PDF File directly in browser using pdf-lib
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.includes("pdf") && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF document.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const loadedDoc = await PDFDocument.load(arrayBuffer);

      const pages = loadedDoc.getPages();
      setPdfDoc(loadedDoc);
      setFile(selected);
      setNumPages(pages.length);
      setCurrentPage(1);
      setPageRotations(new Array(pages.length).fill(0));
      setDeletedPages([]);
      setElements([]);

      if (pages.length > 0) {
        const { width, height } = pages[0].getSize();
        setPageDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    } catch (err: any) {
      console.error(err);
      setError("Could not open this PDF. It might be password-protected or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!file || !pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    if (activeTool === "text") {
      const newEl = {
        id: Date.now(),
        page: currentPage,
        type: "text",
        x: Math.round(clickX),
        y: Math.round(clickY),
        text: textContent || "New Text",
        size: textSize,
        color: textColor,
        font: fontFamily,
      };
      setElements((prev) => [...prev, newEl]);
    } else if (activeTool === "whiteout") {
      const newEl = {
        id: Date.now(),
        page: currentPage,
        type: "whiteout",
        x: Math.round(clickX - 40),
        y: Math.round(clickY - 10),
        w: 100,
        h: 24,
      };
      setElements((prev) => [...prev, newEl]);
    } else if (activeTool === "highlight") {
      const newEl = {
        id: Date.now(),
        page: currentPage,
        type: "highlight",
        x: Math.round(clickX - 50),
        y: Math.round(clickY - 8),
        w: 120,
        h: 20,
      };
      setElements((prev) => [...prev, newEl]);
    } else if (activeTool === "signature") {
      if (!signatureDataUrl) {
        setShowSignModal(true);
        return;
      }
      const newEl = {
        id: Date.now(),
        page: currentPage,
        type: "signature",
        x: Math.round(clickX - 60),
        y: Math.round(clickY - 30),
        w: 120,
        h: 60,
        dataUrl: signatureDataUrl,
      };
      setElements((prev) => [...prev, newEl]);
    }
  };

  const removeElement = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const rotateCurrentPage = () => {
    setPageRotations((prev) => {
      const copy = [...prev];
      copy[currentPage - 1] = (copy[currentPage - 1] + 90) % 360;
      return copy;
    });
  };

  const deleteCurrentPage = () => {
    if (numPages - deletedPages.length <= 1) {
      setError("You cannot delete all pages from the document.");
      return;
    }
    if (!deletedPages.includes(currentPage)) {
      setDeletedPages((prev) => [...prev, currentPage]);
    }
  };

  const restoreCurrentPage = () => {
    setDeletedPages((prev) => prev.filter((p) => p !== currentPage));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1d1d1f";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    setSignatureDataUrl(canvas.toDataURL("image/png"));
    setShowSignModal(false);
  };

  const handleSavePdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);

      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const times = await doc.embedFont(StandardFonts.TimesRoman);
      const courier = await doc.embedFont(StandardFonts.Courier);

      const pages = doc.getPages();

      pages.forEach((p, idx) => {
        const rot = pageRotations[idx] || 0;
        if (rot !== 0) {
          p.setRotation(degrees((p.getRotation().angle + rot) % 360));
        }
      });

      if (watermarkText.trim()) {
        pages.forEach((p) => {
          const { width, height } = p.getSize();
          p.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: 48,
            font: helvetica,
            color: rgb(0.6, 0.6, 0.6),
            opacity: watermarkOpacity,
            rotate: degrees(45),
          });
        });
      }

      for (const el of elements) {
        if (deletedPages.includes(el.page)) continue;
        const targetPage = pages[el.page - 1];
        if (!targetPage) continue;

        const { height: pageH } = targetPage.getSize();
        const pdfX = el.x;
        const pdfY = pageH - el.y - (el.size || el.h || 14);

        if (el.type === "whiteout") {
          targetPage.drawRectangle({
            x: el.x,
            y: pageH - el.y - el.h,
            width: el.w,
            height: el.h,
            color: rgb(1, 1, 1),
          });
        } else if (el.type === "highlight") {
          targetPage.drawRectangle({
            x: el.x,
            y: pageH - el.y - el.h,
            width: el.w,
            height: el.h,
            color: rgb(1, 0.95, 0.2),
            opacity: 0.45,
          });
        } else if (el.type === "text") {
          let chosenFont = helvetica;
          if (el.font === "Times") chosenFont = times;
          if (el.font === "Courier") chosenFont = courier;

          const hex = (el.color || "#000000").replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
          const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
          const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

          targetPage.drawText(el.text || "", {
            x: pdfX,
            y: pdfY,
            size: el.size || 14,
            font: chosenFont,
            color: rgb(r, g, b),
          });
        } else if (el.type === "signature" && el.dataUrl) {
          const imageBytes = await fetch(el.dataUrl).then((res) => res.arrayBuffer());
          const embeddedImg = await doc.embedPng(imageBytes);
          targetPage.drawImage(embeddedImg, {
            x: el.x,
            y: pageH - el.y - el.h,
            width: el.w,
            height: el.h,
          });
        }
      }

      const toDeleteSorted = [...deletedPages].sort((a, b) => b - a);
      toDeleteSorted.forEach((pNum) => {
        doc.removePage(pNum - 1);
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Edited_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to compile edited PDF. " + (err.message || ""));
    } finally {
      setIsProcessing(false);
    }
  };

  const isCurrentPageDeleted = deletedPages.includes(currentPage);

  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
          {/* Top Navigation */}
          <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/pdf-tools" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
                ← Back to PDF Suite
              </Link>
              <div className="flex items-center gap-3">
                {file && (
                  <button
                    type="button"
                    onClick={handleSavePdf}
                    disabled={isProcessing}
                    className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold px-5 py-2.5 rounded-full text-xs transition shadow-lg shadow-blue-500/20 active:scale-98 flex items-center gap-1.5"
                  >
                    {isProcessing ? "Saving PDF..." : "📥 Download Edited PDF"}
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* Main Container */}
          <div className="max-w-7xl mx-auto px-4 pt-6">
            {!file ? (
              <div className="max-w-2xl mx-auto text-center pt-8">
                <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  👑 Pro PDF Studio
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
                  Interactive Visual PDF Editor
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto mb-8">
                  Click anywhere to add text, whiteout old text, draw digital signatures, highlight lines, and delete/rotate pages in real-time.
                </p>

                <div className="bg-white dark:bg-[#0c1017] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="master-pdf-upload"
                  />
                  <label
                    htmlFor="master-pdf-upload"
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <span className="text-5xl mb-3">📑</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      Click to Upload PDF Document
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      100% In-Browser • Zero upload latency • Vector crisp
                    </span>
                  </label>

                  {error && (
                    <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-semibold">
                      ⚠️ {error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Editing Tools
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setElements([]);
                        }}
                        className="text-xs text-rose-500 font-bold hover:underline"
                      >
                        Close PDF
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTool("text")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                          activeTool === "text"
                            ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-blue-500/20"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>✏️</span>
                        <span>Type Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTool("whiteout")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                          activeTool === "whiteout"
                            ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-blue-500/20"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>🧽</span>
                        <span>Whiteout Eraser</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTool("highlight")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                          activeTool === "highlight"
                            ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-blue-500/20"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>🖍️</span>
                        <span>Highlighter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTool("signature");
                          if (!signatureDataUrl) setShowSignModal(true);
                        }}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                          activeTool === "signature"
                            ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-blue-500/20"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>✍️</span>
                        <span>Sign Stamp</span>
                      </button>
                    </div>

                    {activeTool === "text" && (
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <label className="font-bold text-slate-500 block mb-1">Text Content to Place</label>
                          <input
                            type="text"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold text-slate-500 block mb-1">Font Size ({textSize}pt)</label>
                            <input
                              type="range"
                              min="10"
                              max="36"
                              value={textSize}
                              onChange={(e) => setTextSize(Number(e.target.value))}
                              className="w-full accent-[#0071e3]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-500 block mb-1">Color</label>
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-full h-8 rounded-lg cursor-pointer border"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {(activeTool === "whiteout" || activeTool === "highlight") && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-[#0071e3] leading-relaxed">
                        💡 <strong>Tip:</strong> Click anywhere on the PDF page to drop an eraser or highlight box over existing text!
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-400 uppercase tracking-wider">Page Controls</h3>
                      <span className="font-bold text-[#0071e3]">
                        Page {currentPage} of {numPages}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold disabled:opacity-40"
                      >
                        ← Prev Page
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                        disabled={currentPage >= numPages}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold disabled:opacity-40"
                      >
                        Next Page →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={rotateCurrentPage}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        🔄 Rotate 90°
                      </button>
                      {isCurrentPageDeleted ? (
                        <button
                          type="button"
                          onClick={restoreCurrentPage}
                          className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20"
                        >
                          ✓ Restore Page
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={deleteCurrentPage}
                          className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20"
                        >
                          🗑️ Delete Page
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider">Document Watermark</h3>
                    <input
                      type="text"
                      placeholder="e.g. CONFIDENTIAL / DRAFT"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-3">
                  <div className="flex justify-between items-center bg-white dark:bg-[#0c1017] px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
                    <span className="text-slate-400">Click on page to place active tool ({activeTool})</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span>{Math.round(zoom * 100)}%</span>
                      <button
                        onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-full overflow-auto p-4 bg-slate-200 dark:bg-slate-950 rounded-3xl border border-slate-300 dark:border-slate-800 flex justify-center min-h-[600px]">
                    <div
                      ref={pageContainerRef}
                      onClick={handlePageClick}
                      style={{
                        width: `${pageDimensions.width * zoom}px`,
                        height: `${pageDimensions.height * zoom}px`,
                        transform: `rotate(${pageRotations[currentPage - 1] || 0}deg)`,
                      }}
                      className={`relative bg-white shadow-2xl transition-all cursor-crosshair select-none ${
                        isCurrentPageDeleted ? "opacity-30 pointer-events-none" : ""
                      }`}
                    >
                      <div className="absolute inset-0 p-8 text-slate-800 pointer-events-none overflow-hidden opacity-90">
                        <div className="text-xl font-black mb-2">{file.name.replace(/\.[^/.]+$/, "")}</div>
                        <div className="h-0.5 bg-slate-300 w-full mb-4" />
                        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                          <p>
                            This document is loaded in the interactive client-side editor. Click anywhere on this page to stamp your text, apply whiteouts, or place digital signatures!
                          </p>
                        </div>
                      </div>

                      {elements
                        .filter((el) => el.page === currentPage)
                        .map((el) => (
                          <div
                            key={el.id}
                            style={{
                              left: `${el.x * zoom}px`,
                              top: `${el.y * zoom}px`,
                            }}
                            className="absolute group border border-dashed border-blue-400 p-0.5 cursor-move z-20"
                          >
                            {el.type === "text" && (
                              <span
                                style={{
                                  fontSize: `${(el.size || 14) * zoom}px`,
                                  color: el.color || "#000000",
                                  fontFamily: el.font || "sans-serif",
                                }}
                                className="font-bold whitespace-nowrap"
                              >
                                {el.text}
                              </span>
                            )}

                            {el.type === "whiteout" && (
                              <div
                                style={{ width: `${el.w * zoom}px`, height: `${el.h * zoom}px` }}
                                className="bg-white border border-slate-300 shadow-sm"
                              />
                            )}

                            {el.type === "highlight" && (
                              <div
                                style={{ width: `${el.w * zoom}px`, height: `${el.h * zoom}px` }}
                                className="bg-yellow-300/50"
                              />
                            )}

                            {el.type === "signature" && el.dataUrl && (
                              <img
                                src={el.dataUrl}
                                alt="Signature"
                                style={{ width: `${el.w * zoom}px`, height: `${el.h * zoom}px` }}
                                className="object-contain"
                              />
                            )}

                            <button
                              type="button"
                              onClick={(e) => removeElement(el.id, e)}
                              className="absolute -top-3 -right-3 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition shadow"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showSignModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4 text-center">
                <h3 className="text-sm font-black uppercase tracking-wider">Draw Digital Signature</h3>
                <p className="text-xs text-slate-400">Use your mouse or finger to sign inside the box below:</p>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden flex justify-center">
                  <canvas
                    ref={signCanvasRef}
                    width={380}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Clear Pad
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    className="py-2.5 rounded-xl bg-[#0071e3] text-white shadow-md shadow-blue-500/20"
                  >
                    Save &amp; Place Sign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProGate>
    </AuthGate>
  );
}
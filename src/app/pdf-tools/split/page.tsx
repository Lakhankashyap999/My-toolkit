// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import AuthGate from "../../../components/AuthGate";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [extractedCount, setExtractedCount] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const acceptFile = async (selected: File | undefined | null) => {
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      setPageInput("");
      setTotalPages(null);
      // Read page count
      try {
        const buf = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        setTotalPages(pdf.getPageCount());
      } catch {
        setTotalPages(null);
      }
    } else {
      setFile(null);
      setTotalPages(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    setTotalPages(null);
    setPageInput("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Parse "1,3-5,7" → [1,3,4,5,7]
  const parsePageInput = (input: string, max: number): number[] | string => {
    const pageNumbers: number[] = [];
    const parts = input.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end) || start > end) return `Invalid range: "${trimmed}"`;
        if (start < 1 || end > max) return `Pages must be between 1 and ${max}.`;
        for (let i = start; i <= end; i++) pageNumbers.push(i);
      } else {
        const page = parseInt(trimmed);
        if (isNaN(page)) return `Invalid page number: "${trimmed}"`;
        if (page < 1 || page > max) return `Page ${page} is out of range (1–${max}).`;
        pageNumbers.push(page);
      }
    }
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file) { setError("Please upload a PDF file."); return; }
    if (!pageInput.trim()) { setError('Enter page numbers (e.g., "1,3-5").'); return; }

    setIsProcessing(true);
    setError("");
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const total = srcPdf.getPageCount();

      const parsed = parsePageInput(pageInput, total);
      if (typeof parsed === "string") {
        setError(parsed);
        setProgress(0);
        return;
      }

      setProgress(40);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, parsed.map((p) => p - 1));
      copiedPages.forEach((page) => newPdf.addPage(page));

      setProgress(80);
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setProgress(100);
      setExtractedCount(parsed.length);
      setSuccessUrl(url);
      setTimeout(() => setShowPopup(true), 200);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setProgress(0);
    } finally {
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setProgress(0);
    if (successUrl) {
      URL.revokeObjectURL(successUrl);
      setSuccessUrl("");
    }
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 dark:bg-[#040404]/75 border-b border-black/5 dark:border-white/10">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
            </a>
            <div className="flex items-center gap-4 text-[13px] font-medium text-[#1d1d1f]/70 dark:text-white/70">
              <a href="/" className="hover:text-[#0071e3] transition-colors">← Back to Home</a>
              <a href="/pdf-tools" className="hover:text-[#0071e3] transition-colors">PDF Tools</a>
            </div>
          </div>
        </nav>

        {/* Ambient glow */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-violet-400/15 dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-violet-500/10 blur-3xl" />
          </div>

          <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-2xl mb-4"
                style={{ boxShadow: "0 10px 24px -6px rgba(99,102,241,0.4)" }}
              >
                ✂️
              </div>
              <h1 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3">Split / Extract Pages</h1>
              <p className="text-[#6e6e73] dark:text-white/60 text-[15px] sm:text-lg">
                Extract specific pages from any PDF. Enter page numbers like <code className="bg-[#f5f5f7] dark:bg-white/10 px-1.5 py-0.5 rounded-md text-[14px]">1,3-5</code>
              </p>
            </div>

            {/* Upload / File card */}
            {!file ? (
              <label
                htmlFor="pdf-upload"
                onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                className={`block cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-12 text-center transition-all ${
                  isDragActive
                    ? "border-[#0071e3] bg-[#0071e3]/5 scale-[1.01]"
                    : "border-black/10 dark:border-white/15 bg-white dark:bg-[#111113] hover:border-[#0071e3]/40 hover:bg-[#0071e3]/[0.03]"
                }`}
              >
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-3xl">📁</div>
                  <span className="text-[17px] sm:text-xl font-semibold tracking-tight">
                    {isDragActive ? "Drop it here" : "Click or drag a PDF here"}
                  </span>
                  <span className="text-[13px] text-[#6e6e73] dark:text-white/50">Only .pdf files are supported</span>
                </div>
              </label>
            ) : (
              <div className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden">
                {/* File info */}
                <div className="flex items-center gap-4 p-5 sm:p-6">
                  <div
                    className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl"
                    style={{ boxShadow: "0 8px 20px -6px rgba(99,102,241,0.35)" }}
                  >
                    📄
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[15px] truncate">{file.name}</p>
                    <p className="text-[13px] text-[#6e6e73] dark:text-white/50">
                      {formatSize(file.size)}
                      {totalPages != null && <span> · {totalPages} pages</span>}
                    </p>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={removeFile}
                      className="shrink-0 w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 flex items-center justify-center text-sm transition-colors"
                    >✕</button>
                  )}
                </div>

                {/* Page input */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-black/5 dark:border-white/10 pt-4">
                  <label className="block text-[13px] font-semibold text-[#1d1d1f] dark:text-white mb-2">
                    Pages to Extract
                    {totalPages && <span className="font-normal text-[#6e6e73] dark:text-white/50 ml-1">(1 – {totalPages})</span>}
                  </label>
                  <input
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleExtract()}
                    placeholder="e.g., 1,3-5,8"
                    className="w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-white/5 text-[#1d1d1f] dark:text-white placeholder-[#6e6e73] dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 text-[15px] transition-all"
                  />
                  <p className="text-[12px] text-[#6e6e73] dark:text-white/40 mt-2">
                    Use commas to separate pages and hyphens for ranges. Example: <span className="font-mono">1,3-5,8</span>
                  </p>
                </div>

                {/* Progress bar */}
                {isProcessing && (
                  <div className="px-5 sm:px-6 pb-5 border-t border-black/5 dark:border-white/10 pt-4">
                    <div className="flex items-center justify-between text-[12px] text-[#6e6e73] dark:text-white/50 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
                        Extracting pages…
                      </span>
                      <span className="font-medium text-[#0071e3]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f0f0f2] dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0071e3] to-[#5856d6] transition-[width] duration-150 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center mt-7">
              <button
                onClick={handleExtract}
                disabled={isProcessing || !file || !pageInput.trim()}
                className="bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold text-[15px] transition-colors shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                {isProcessing ? "Extracting…" : "Extract Pages"}
              </button>
            </div>

            <div className="mt-10 bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 text-[13px] text-[#6e6e73] dark:text-white/60">
              💡 <strong className="text-[#1d1d1f] dark:text-white">Note:</strong> Extracted pages are saved as a new PDF. Original file is untouched. Everything happens in your browser — nothing is uploaded.
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-[#111113] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden">
              <span className="absolute top-6 left-8 w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              <span className="absolute top-10 right-10 w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="absolute top-4 right-20 w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0.35s" }} />

              <div className="relative mx-auto mb-5 w-20 h-20">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-4xl"
                  style={{ boxShadow: "0 12px 28px -6px rgba(99,102,241,0.45)" }}
                >
                  ✂️
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-base shadow-md">✓</span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight mb-1">Pages extracted! 🎉</h2>
              <p className="text-[#6e6e73] dark:text-white/60 mb-6 text-[14px]">
                {extractedCount} page{extractedCount !== 1 ? "s" : ""} saved as a new PDF.
              </p>

              <div className="flex flex-col gap-2.5">
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#0071e3] hover:bg-[#0077ED] text-white py-3 rounded-full font-semibold transition-colors text-[14px]"
                >
                  Open PDF
                </a>
                <a
                  href={successUrl}
                  download="extracted.pdf"
                  className="block w-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white py-3 rounded-full font-semibold transition-colors text-[14px]"
                >
                  Download Again
                </a>
                <button
                  onClick={() => { closePopup(); removeFile(); }}
                  className="w-full text-[#6e6e73] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white py-2 text-[13px] transition-colors"
                >
                  Extract from another file
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
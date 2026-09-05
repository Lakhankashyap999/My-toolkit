// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import AuthGate from "../../../components/AuthGate";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const pdfs = arr.filter((f) => f.type === "application/pdf");
    if (pdfs.length !== arr.length) setError("Only PDF files are allowed.");
    else setError("");
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const moveFile = (index: number, dir: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files.");
      return;
    }
    setIsMerging(true);
    setError("");
    setProgress(5);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        setProgress(10 + Math.round(((i + 1) / files.length) * 80));
      }

      setProgress(95);
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setProgress(100);
      setSuccessUrl(url);
      setTimeout(() => setShowPopup(true), 200);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setProgress(0);
    } finally {
      setTimeout(() => setIsMerging(false), 300);
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

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

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
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-rose-400/20 via-orange-400/10 to-pink-400/15 dark:from-rose-500/10 dark:via-orange-500/5 dark:to-pink-500/10 blur-3xl" />
          </div>

          <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 text-2xl mb-4"
                style={{ boxShadow: "0 10px 24px -6px rgba(251,146,60,0.4)" }}
              >
                📑
              </div>
              <h1 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3">Merge PDF</h1>
              <p className="text-[#6e6e73] dark:text-white/60 text-[15px] sm:text-lg">
                Combine multiple PDF files into one — free, fast, done entirely in your browser.
              </p>
            </div>

            {/* Drop zone */}
            <label
              htmlFor="pdf-upload"
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`block cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all ${
                isDragActive
                  ? "border-[#0071e3] bg-[#0071e3]/5 scale-[1.01]"
                  : "border-black/10 dark:border-white/15 bg-white dark:bg-[#111113] hover:border-[#0071e3]/40 hover:bg-[#0071e3]/[0.03]"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-3xl">
                  📁
                </div>
                <span className="text-[17px] sm:text-xl font-semibold tracking-tight">
                  {isDragActive ? "Drop PDFs here" : "Click or drag PDFs here"}
                </span>
                <span className="text-[13px] text-[#6e6e73] dark:text-white/50">
                  Select multiple PDF files · min 2 required
                </span>
              </div>
            </label>

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10">
                  <span className="font-semibold text-[15px]">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#6e6e73] dark:text-white/50">{formatSize(totalSize)} total</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[13px] text-[#0071e3] font-medium hover:opacity-80 transition-opacity"
                    >
                      + Add more
                    </button>
                  </div>
                </div>
                <ul className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-base">
                        📄
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium truncate">{file.name}</p>
                        <p className="text-[12px] text-[#6e6e73] dark:text-white/50">{formatSize(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveFile(index, "up")}
                          disabled={index === 0}
                          className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors"
                          title="Move up"
                        >↑</button>
                        <button
                          onClick={() => moveFile(index, "down")}
                          disabled={index === files.length - 1}
                          className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#e8e8ed] dark:hover:bg-white/20 transition-colors"
                          title="Move down"
                        >↓</button>
                        <button
                          onClick={() => removeFile(index)}
                          className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove"
                        >✕</button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Progress bar */}
                {isMerging && (
                  <div className="px-5 py-4 border-t border-black/5 dark:border-white/10">
                    <div className="flex items-center justify-between text-[12px] text-[#6e6e73] dark:text-white/50 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
                        Merging…
                      </span>
                      <span className="font-medium text-[#0071e3]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f0f0f2] dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-[width] duration-150 ease-out"
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
                onClick={handleMerge}
                disabled={isMerging || files.length < 2}
                className="bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold text-[15px] transition-colors shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                {isMerging ? "Merging…" : `Merge ${files.length > 0 ? files.length : ""} PDFs`}
              </button>
            </div>

            <div className="mt-8 bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 text-[13px] text-[#6e6e73] dark:text-white/60">
              💡 <strong className="text-[#1d1d1f] dark:text-white">Note:</strong> Files are merged in the order shown above. Drag to reorder. Everything happens in your browser — nothing is uploaded.
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-[#111113] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden">
              <span className="absolute top-6 left-8 w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
              <span className="absolute top-10 right-10 w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="absolute top-4 right-20 w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.35s" }} />

              <div className="relative mx-auto mb-5 w-20 h-20">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-4xl animate-bounce"
                  style={{ boxShadow: "0 12px 28px -6px rgba(251,146,60,0.45)", animationIterationCount: 1 }}
                >
                  📑
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-base shadow-md">✓</span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight mb-1">Merge complete! 🎉</h2>
              <p className="text-[#6e6e73] dark:text-white/60 mb-6 text-[14px]">Your merged PDF has been downloaded.</p>

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
                  download="merged.pdf"
                  className="block w-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white py-3 rounded-full font-semibold transition-colors text-[14px]"
                >
                  Download Again
                </a>
                <button
                  onClick={() => { closePopup(); setFiles([]); }}
                  className="w-full text-[#6e6e73] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white py-2 text-[13px] transition-colors"
                >
                  Merge another set
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
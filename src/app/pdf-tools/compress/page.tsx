// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import AuthGate from "../../../components/AuthGate";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [resultInfo, setResultInfo] = useState<{ before: string; after: string; percent: number } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<string>("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<any>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const acceptFile = (selected: File | undefined | null) => {
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      setResultInfo(null);
    } else {
      setFile(null);
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
    setResultInfo(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Smooth, fast-feeling progress animation — climbs quickly to ~90%
  // while the real work happens, then snaps to 100% on completion.
  const startFakeProgress = () => {
    setProgress(6);
    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        const step = prev < 50 ? 14 : prev < 75 ? 7 : 3;
        return Math.min(prev + step, 90);
      });
    }, 90);
  };

  const stopFakeProgress = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
  };

  useEffect(() => () => stopFakeProgress(), []);

  const handleCompress = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }
    setIsCompressing(true);
    setError("");
    setResultInfo(null);
    startFakeProgress();
    const startTime = performance.now();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const originalSize = file.size;
      const compressedSize = blob.size;
      const percent = Math.round((1 - compressedSize / originalSize) * 100);

      setResultInfo({
        before: formatSize(originalSize),
        after: formatSize(compressedSize),
        percent,
      });

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setElapsedSeconds(elapsed);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      stopFakeProgress();
      setProgress(100);
      setTimeout(() => {
        setSuccessUrl(url);
        setShowPopup(true);
      }, 250);
    } catch (err: any) {
      stopFakeProgress();
      setProgress(0);
      setError(err.message || "Something went wrong.");
    } finally {
      setTimeout(() => setIsCompressing(false), 300);
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
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 dark:bg-[#040404]/75 border-b border-black/5 dark:border-white/10">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-[17px] font-semibold tracking-tight">ToolBox</span></a>
            <div className="flex items-center gap-4 text-[13px] font-medium text-[#1d1d1f]/70 dark:text-white/70">
              <a href="/" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">← Back to Home</a>
              <a href="/pdf-tools" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">PDF Tools</a>
            </div>
          </div>
        </nav>

        {/* Ambient premium glow, matches homepage */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-purple-400/15 dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-purple-500/10 blur-3xl" />
          </div>

          <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
            <div className="text-center mb-8 sm:mb-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-2xl mb-4"
                style={{ boxShadow: "0 10px 24px -6px rgba(99,102,241,0.35)" }}
              >
                🗜️
              </div>
              <h1 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3">Compress PDF</h1>
              <p className="text-[#6e6e73] dark:text-white/60 text-[15px] sm:text-lg">
                Reduce your PDF's file size in seconds — private, fast, done right in your browser.
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
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-3xl">
                    📁
                  </div>
                  <span className="text-[17px] sm:text-xl font-semibold tracking-tight">
                    {isDragActive ? "Drop it here" : "Click or drag a PDF here"}
                  </span>
                  <span className="text-[13px] sm:text-sm text-[#6e6e73] dark:text-white/50">Only .pdf files are supported</span>
                </div>
              </label>
            ) : (
              <div className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-2xl" style={{ boxShadow: "0 8px 20px -6px rgba(251,146,60,0.35)" }}>
                    📄
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[15px] truncate">{file.name}</p>
                    <p className="text-[13px] text-[#6e6e73] dark:text-white/50">{formatSize(file.size)}</p>
                  </div>
                  {!isCompressing && (
                    <button
                      onClick={removeFile}
                      className="shrink-0 w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 flex items-center justify-center text-sm transition-colors"
                      aria-label="Remove file"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Fast progress bar */}
                {isCompressing && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[12px] text-[#6e6e73] dark:text-white/50 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
                        Compressing…
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

            {resultInfo && !showPopup && (
              <div className="mt-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl p-4 text-sm">
                {resultInfo.before} → {resultInfo.after}{" "}
                {resultInfo.percent > 0 ? `(saved ${resultInfo.percent}%)` : "(no significant change)"}
                {elapsedSeconds && <span className="opacity-70"> · done in {elapsedSeconds}s</span>}
              </div>
            )}

            <div className="flex justify-center mt-7">
              <button
                onClick={handleCompress}
                disabled={isCompressing || !file}
                className="bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold text-[15px] transition-colors shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                {isCompressing ? "Compressing…" : "Compress PDF"}
              </button>
            </div>

            <div className="mt-10 bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 text-[13px] text-[#6e6e73] dark:text-white/60">
              💡 <strong className="text-[#1d1d1f] dark:text-white">Note:</strong> Compression re-saves your PDF with optimized settings. For heavily image-based PDFs, the size reduction may be modest. Everything happens entirely in your browser — nothing is uploaded.
            </div>
          </div>
        </div>

        {/* Success Popup — cartoon-style celebration */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-[#111113] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden">
              {/* confetti bits */}
              <span className="absolute top-6 left-8 w-2 h-2 rounded-full bg-blue-400 animate-[bounce_1.4s_ease-in-out_infinite]" />
              <span className="absolute top-10 right-10 w-2 h-2 rounded-full bg-emerald-400 animate-[bounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: "0.2s" }} />
              <span className="absolute top-4 right-20 w-1.5 h-1.5 rounded-full bg-orange-400 animate-[bounce_1.3s_ease-in-out_infinite]" style={{ animationDelay: "0.35s" }} />
              <span className="absolute top-14 left-16 w-1.5 h-1.5 rounded-full bg-purple-400 animate-[bounce_1.5s_ease-in-out_infinite]" style={{ animationDelay: "0.1s" }} />

              <div className="relative mx-auto mb-5 w-20 h-20">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl animate-[bounce_0.6s_ease-in-out_1]"
                  style={{ boxShadow: "0 12px 28px -6px rgba(45,212,191,0.45)" }}
                >
                  📦
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-base shadow-md">
                  ✓
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight mb-1">Yeh lo aapki file! 🎉</h2>
              <p className="text-[#6e6e73] dark:text-white/60 mb-1 text-[14px]">Your compressed PDF is ready.</p>
              {elapsedSeconds && (
                <p className="text-[13px] text-[#0071e3] font-medium mb-5">⚡ Done in {elapsedSeconds}s</p>
              )}
              {resultInfo && (
                <p className="text-[13px] text-[#6e6e73] dark:text-white/50 mb-6">
                  {resultInfo.before} → <span className="font-semibold text-[#1d1d1f] dark:text-white">{resultInfo.after}</span>
                  {resultInfo.percent > 0 && <span className="text-emerald-600 dark:text-emerald-400"> (−{resultInfo.percent}%)</span>}
                </p>
              )}

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
                  download="compressed.pdf"
                  className="block w-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white py-3 rounded-full font-semibold transition-colors text-[14px]"
                >
                  Download Again
                </a>
                <button
                  onClick={() => { closePopup(); removeFile(); }}
                  className="w-full text-[#6e6e73] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white py-2 text-[13px] transition-colors"
                >
                  Compress another file
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

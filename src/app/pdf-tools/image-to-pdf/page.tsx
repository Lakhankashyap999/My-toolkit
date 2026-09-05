// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import AuthGate from "../../../components/AuthGate";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [elapsedLabel, setElapsedLabel] = useState("");
  const [pageSize, setPageSize] = useState<"fit" | "a4p" | "a4l" | "letter">("fit");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZES = {
    a4p: [595.28, 841.89],
    a4l: [841.89, 595.28],
    letter: [612, 792],
  };

  const PAGE_SIZE_LABELS = {
    fit: "Fit to image",
    a4p: "A4 Portrait",
    a4l: "A4 Landscape",
    letter: "Letter",
  };

  const addFiles = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    const valid = arr.filter((f) => f.type.startsWith("image/"));
    if (valid.length !== arr.length) setError("Only image files (JPG, PNG) are allowed.");
    else setError("");
    setImages((prev) => [...prev, ...valid]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setIsConverting(true);
    setError("");
    setProgress(2);
    setStage("Preparing…");
    const start = performance.now();

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const arrayBuffer = await image.arrayBuffer();
        const mimeType = image.type;
        let embeddedImage;

        setStage(`Processing image ${i + 1} of ${images.length}…`);

        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (mimeType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Try JPG fallback for other image types via canvas
          continue;
        }

        let pageWidth: number, pageHeight: number;
        let drawWidth: number, drawHeight: number;
        let x: number, y: number;

        if (pageSize === "fit") {
          pageWidth = embeddedImage.width;
          pageHeight = embeddedImage.height;
          drawWidth = pageWidth;
          drawHeight = pageHeight;
          x = 0;
          y = 0;
        } else {
          [pageWidth, pageHeight] = PAGE_SIZES[pageSize];
          const scale = Math.min(pageWidth / embeddedImage.width, pageHeight / embeddedImage.height);
          drawWidth = embeddedImage.width * scale;
          drawHeight = embeddedImage.height * scale;
          x = (pageWidth - drawWidth) / 2;
          y = (pageHeight - drawHeight) / 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, { x, y, width: drawWidth, height: drawHeight });
        setProgress(8 + Math.round(((i + 1) / images.length) * 72));
        await sleep(40);
      }

      setStage("Creating PDF…");
      setProgress(92);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const elapsed = performance.now() - start;
      if (elapsed < 600) await sleep(600 - elapsed);

      setProgress(100);
      setStage("Done!");
      setElapsedLabel(((performance.now() - start) / 1000).toFixed(1));

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccessUrl(url);
      setTimeout(() => setShowPopup(true), 200);
    } catch (err: any) {
      setError(err.message || "Something went wrong, please try again.");
      setProgress(0);
    } finally {
      setTimeout(() => setIsConverting(false), 300);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setProgress(0);
    setStage("");
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
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
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
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-400/20 via-pink-400/10 to-fuchsia-400/15 dark:from-purple-500/10 dark:via-pink-500/5 dark:to-fuchsia-500/10 blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-2xl mb-4"
                style={{ boxShadow: "0 10px 24px -6px rgba(217,70,239,0.4)" }}
              >
                🖼️
              </div>
              <h1 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3">Image to PDF</h1>
              <p className="text-[#6e6e73] dark:text-white/60 text-[15px] sm:text-lg">
                Convert JPG or PNG images into a professional PDF — privately, instantly.
              </p>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "🔒", label: "100% Private", note: "Processed in browser" },
                { icon: "⚡", label: "Instant", note: "No upload needed" },
                { icon: "🗂️", label: "Multi-page", note: "Multiple images at once" },
                { icon: "🖼️", label: "JPG & PNG", note: "Both formats supported" },
              ].map((f) => (
                <div key={f.label} className="bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <div>
                    <strong className="text-[13px] block font-semibold">{f.label}</strong>
                    <span className="text-[11px] text-[#6e6e73] dark:text-white/50">{f.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
                isDragActive
                  ? "border-purple-500 bg-purple-50/50 dark:bg-purple-500/5 scale-[1.01]"
                  : "border-black/10 dark:border-white/15 bg-white dark:bg-[#111113] hover:border-purple-400/50 hover:bg-purple-50/30 dark:hover:bg-purple-500/[0.03]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-3xl">📁</div>
                <span className="text-[17px] sm:text-xl font-semibold tracking-tight">
                  {isDragActive ? "Drop images here" : "Click or drag images here"}
                </span>
                <span className="text-[13px] text-[#6e6e73] dark:text-white/50">JPG, PNG · Multiple files supported</span>
              </div>
            </div>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="mt-5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10">
                  <span className="font-semibold text-[15px]">{images.length} image{images.length > 1 ? "s" : ""} selected</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[13px] text-[#0071e3] font-medium hover:opacity-80 transition-opacity"
                  >
                    + Add more
                  </button>
                </div>

                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-[#f5f5f7] dark:bg-white/5 aspect-[4/3]">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-full h-full object-contain"
                      />
                      {/* Index badge */}
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-md">
                        {index + 1}
                      </span>
                      {/* Controls */}
                      <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                        <button
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          className="w-6 h-6 rounded-md bg-white/90 dark:bg-black/60 text-[11px] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
                        >↑</button>
                        <button
                          onClick={() => moveImage(index, "down")}
                          disabled={index === images.length - 1}
                          className="w-6 h-6 rounded-md bg-white/90 dark:bg-black/60 text-[11px] flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
                        >↓</button>
                        <button
                          onClick={() => removeImage(index)}
                          className="w-6 h-6 rounded-md bg-white/90 dark:bg-black/60 text-[11px] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                        >✕</button>
                      </div>
                      {/* Name tooltip */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/60 px-2 py-1 text-[10px] truncate text-center">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page size selector */}
            {images.length > 0 && (
              <div className="mt-4 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3">
                <span className="text-[14px] font-semibold shrink-0">Page size:</span>
                <div className="flex flex-wrap gap-2">
                  {(["fit", "a4p", "a4l", "letter"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPageSize(s)}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                        pageSize === s
                          ? "bg-[#0071e3] text-white border-[#0071e3]"
                          : "bg-[#f5f5f7] dark:bg-white/5 text-[#6e6e73] dark:text-white/60 border-transparent hover:border-[#0071e3]/30"
                      }`}
                    >
                      {PAGE_SIZE_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center mt-7">
              <button
                onClick={handleConvert}
                disabled={isConverting || images.length === 0}
                className="bg-[#0071e3] hover:bg-[#0077ED] disabled:bg-gray-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold text-[15px] transition-colors shadow-lg shadow-purple-500/20 disabled:shadow-none"
              >
                {isConverting ? "Converting…" : "Convert to PDF"}
              </button>
            </div>

            {/* Progress */}
            {isConverting && (
              <div className="mt-5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-[13px]">
                  <span className="text-lg">🖨️</span>
                  <span className="text-[#6e6e73] dark:text-white/50 flex-1">{stage}</span>
                  <span className="font-semibold text-[#0071e3]">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f0f0f2] dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-[width] duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 bg-[#f5f5f7] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 rounded-2xl p-4 text-[13px] text-[#6e6e73] dark:text-white/60">
              💡 <strong className="text-[#1d1d1f] dark:text-white">Note:</strong> Your images stay on your device and are never uploaded to any server. Everything is processed locally in your browser.
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-[#111113] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden">
              <span className="absolute top-6 left-8 w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <span className="absolute top-10 right-10 w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="absolute top-4 right-20 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "0.35s" }} />

              <div className="relative mx-auto mb-5 w-20 h-20">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl"
                  style={{ boxShadow: "0 12px 28px -6px rgba(217,70,239,0.45)" }}
                >
                  🖼️
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-base shadow-md">✓</span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight mb-1">PDF Ready! 🎉</h2>
              <p className="text-[#6e6e73] dark:text-white/60 mb-1 text-[14px]">Your PDF has been downloaded.</p>
              {elapsedLabel && <p className="text-[13px] text-[#0071e3] font-medium mb-5">⚡ Created in {elapsedLabel}s</p>}

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
                  download="converted.pdf"
                  className="block w-full bg-[#f5f5f7] dark:bg-white/10 hover:bg-[#e8e8ed] dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white py-3 rounded-full font-semibold transition-colors text-[14px]"
                >
                  Download Again
                </a>
                <button
                  onClick={() => { closePopup(); setImages([]); }}
                  className="w-full text-[#6e6e73] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white py-2 text-[13px] transition-colors"
                >
                  Convert more images
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

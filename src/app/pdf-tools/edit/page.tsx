// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import ProGate from "../../../components/ProGate";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16) || 0;
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return { r, g, b };
}

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageRotations, setPageRotations] = useState<number[]>([]);
  const [deleteFlags, setDeleteFlags] = useState<boolean[]>([]);
  const [selectedPageForText, setSelectedPageForText] = useState(1);

  const [addTextContent, setAddTextContent] = useState("");
  const [addTextX, setAddTextX] = useState(50);
  const [addTextY, setAddTextY] = useState(50);
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");

  const [watermarkContent, setWatermarkContent] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkSize, setWatermarkSize] = useState(40);

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const pdfProxyRef = useRef<any>(null);
  const mainScaleRef = useRef(1);
  const mainPageHeightRef = useRef(0);

  const resetAll = () => {
    setFile(null);
    setNumPages(0);
    setThumbnails([]);
    setPageRotations([]);
    setDeleteFlags([]);
    setSelectedPageForText(1);
    setAddTextContent("");
    setWatermarkContent("");
    setError("");
    setSuccess("");
    setSuccessUrl("");
    setShowPopup(false);
    pdfProxyRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const drawMainPage = async (pageNum: number, marker: { x: number; y: number } | null) => {
    const pdf = pdfProxyRef.current;
    const canvas = mainCanvasRef.current;
    if (!pdf || !canvas) return;

    const page = await pdf.getPage(pageNum);
    const baseViewport = page.getViewport({ scale: 1 });
    const containerWidth = mainContainerRef.current?.clientWidth || 500;
    const scale = Math.min(containerWidth / baseViewport.width, 1.6);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    await page.render({ canvasContext: ctx, viewport }).promise;

    mainScaleRef.current = scale;
    mainPageHeightRef.current = baseViewport.height;

    if (marker) {
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(marker.x - 11, marker.y);
      ctx.lineTo(marker.x + 11, marker.y);
      ctx.moveTo(marker.x, marker.y - 11);
      ctx.lineTo(marker.x, marker.y + 11);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (numPages > 0) {
      drawMainPage(selectedPageForText, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageForText, numPages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || selected.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoadingPreview(true);

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      pdfProxyRef.current = pdf;

      const thumbs: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = 130 / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const c = document.createElement("canvas");
        c.width = viewport.width;
        c.height = viewport.height;
        const ctx = c.getContext("2d");
        if (ctx) await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(c.toDataURL());
      }

      setFile(selected);
      setNumPages(pdf.numPages);
      setThumbnails(thumbs);
      setPageRotations(new Array(pdf.numPages).fill(0));
      setDeleteFlags(new Array(pdf.numPages).fill(false));
      setSelectedPageForText(1);
      setAddTextX(50);
      setAddTextY(50);
    } catch (err) {
      console.error(err);
      setError("Could not read this PDF. Please try another file.");
      resetAll();
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const scale = mainScaleRef.current;
    const pageHeightPt = mainPageHeightRef.current;
    const pdfX = clickX / scale;
    const pdfY = pageHeightPt - clickY / scale;

    setAddTextX(Math.round(pdfX));
    setAddTextY(Math.round(pdfY));
    await drawMainPage(selectedPageForText, { x: clickX, y: clickY });
  };

  const toggleDeletePage = (idx: number) => {
    setDeleteFlags(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const rotatePageBy90 = (idx: number) => {
    setPageRotations(prev => prev.map((v, i) => (i === idx ? (v + 90) % 360 : v)));
  };

  const selectAllForDelete = () => setDeleteFlags(new Array(numPages).fill(true));
  const clearDeleteSelection = () => setDeleteFlags(new Array(numPages).fill(false));

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    const hasRotation = pageRotations.some(r => r !== 0);
    const hasDeletion = deleteFlags.some(Boolean);

    if (!addTextContent.trim() && !watermarkContent.trim() && !hasDeletion && !hasRotation) {
      setError("Please specify at least one edit operation.");
      return;
    }

    const remainingPages = numPages - deleteFlags.filter(Boolean).length;
    if (remainingPages < 1) {
      setError("You can't delete every page from the PDF.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      // Rotate pages
      pages.forEach((page, idx) => {
        const delta = pageRotations[idx] || 0;
        if (delta !== 0) {
          const current = page.getRotation().angle;
          page.setRotation(degrees((current + delta) % 360));
        }
      });

      // Watermark on every page
      if (watermarkContent.trim()) {
        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.drawText(watermarkContent, {
            x: width / 2 - watermarkContent.length * watermarkSize * 0.25,
            y: height / 2,
            size: watermarkSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
            opacity: Math.min(Math.max(watermarkOpacity, 0), 1),
            rotate: degrees(45),
          });
        });
      }

      // Add text on the chosen page
      if (addTextContent.trim()) {
        const pageIdx = Math.min(Math.max(selectedPageForText - 1, 0), pages.length - 1);
        const { r, g, b } = hexToRgb(textColor);
        pages[pageIdx].drawText(addTextContent, {
          x: addTextX,
          y: addTextY,
          size: textSize,
          font,
          color: rgb(r, g, b),
        });
      }

      // Delete pages (descending order so indices stay valid)
      const indicesToDelete = deleteFlags
        .map((flag, idx) => (flag ? idx : -1))
        .filter(idx => idx !== -1)
        .sort((a, b) => b - a);
      indicesToDelete.forEach(idx => pdfDoc.removePage(idx));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Show success popup
      setSuccessUrl(url);
      setShowPopup(true);
      setSuccess("PDF edited successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while editing the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (successUrl) {
      URL.revokeObjectURL(successUrl);
      setSuccessUrl("");
    }
  };

  const deleteCount = deleteFlags.filter(Boolean).length;

  return (
    <ProGate>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</a>
              <a href="/pdf-tools" className="text-sm text-gray-600 hover:text-blue-600">PDF Tools</a>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">✏️ Edit PDF</h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Upload a PDF, click on the page to place text, add a watermark, and delete or rotate pages.
            </p>
          </div>

          {!file && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
              <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <span className="text-5xl">📁</span>
                <span className="text-xl font-semibold">Click to Upload PDF</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Editing happens right here in your browser — nothing is uploaded anywhere.</span>
              </label>
              {isLoadingPreview && <p className="text-sm text-blue-600 mt-4">Loading preview…</p>}
            </div>
          )}

          {file && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: interactive preview + page manager */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPageForText(p => Math.max(1, p - 1))}
                        disabled={selectedPageForText <= 1}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 text-sm"
                      >
                        ← Prev
                      </button>
                      <span className="text-sm font-medium">Page {selectedPageForText} / {numPages}</span>
                      <button
                        onClick={() => setSelectedPageForText(p => Math.min(numPages, p + 1))}
                        disabled={selectedPageForText >= numPages}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 text-sm"
                      >
                        Next →
                      </button>
                    </div>
                    <button onClick={resetAll} className="text-xs text-red-500 hover:text-red-700 font-medium">
                      Upload different file
                    </button>
                  </div>

                  <div ref={mainContainerRef} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto bg-gray-100 dark:bg-gray-900 flex justify-center">
                    <canvas
                      ref={mainCanvasRef}
                      onClick={handleCanvasClick}
                      className="cursor-crosshair max-w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Tap / click anywhere on the page above to set exactly where your text will appear.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h2 className="font-bold text-lg">📄 Pages ({numPages})</h2>
                    <div className="flex gap-2 text-xs">
                      <button onClick={selectAllForDelete} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">Select all</button>
                      <button onClick={clearDeleteSelection} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">Clear</button>
                    </div>
                  </div>
                  {deleteCount > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-3">{deleteCount} page(s) marked for deletion.</p>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {thumbnails.map((thumb, idx) => (
                      <div
                        key={idx}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer transition ${
                          selectedPageForText === idx + 1 ? "border-blue-600 ring-2 ring-blue-500" : "border-gray-200 dark:border-gray-700"
                        } ${deleteFlags[idx] ? "opacity-40" : ""}`}
                        onClick={() => setSelectedPageForText(idx + 1)}
                      >
                        <img
                          src={thumb}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-auto block"
                          style={{ transform: `rotate(${pageRotations[idx]}deg)` }}
                        />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                        <div className="absolute bottom-1 right-1 flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); rotatePageBy90(idx); }}
                            title="Rotate 90°"
                            className="bg-white/90 dark:bg-gray-900/90 text-xs w-6 h-6 rounded-full flex items-center justify-center shadow"
                          >
                            ⟳
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleDeletePage(idx); }}
                            title="Mark for deletion"
                            className={`text-xs w-6 h-6 rounded-full flex items-center justify-center shadow ${
                              deleteFlags[idx] ? "bg-red-600 text-white" : "bg-white/90 dark:bg-gray-900/90"
                            }`}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: edit controls */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-3">➕ Add Text</h2>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={addTextContent}
                      onChange={(e) => setAddTextContent(e.target.value)}
                      placeholder="Text to add (e.g., Approved by ABC)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    />
                    <div>
                      <label className="block text-xs mb-1">Will be placed on page</label>
                      <select
                        value={selectedPageForText}
                        onChange={(e) => setSelectedPageForText(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                          <option key={p} value={p}>Page {p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1">X Position</label>
                        <input type="number" value={addTextX} onChange={(e) => setAddTextX(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Y Position</label>
                        <input type="number" value={addTextY} onChange={(e) => setAddTextY(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Font Size</label>
                        <input type="number" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Color</label>
                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">X/Y update automatically when you click on the preview — you can also fine-tune them manually.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-3">💧 Watermark</h2>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={watermarkContent}
                      onChange={(e) => setWatermarkContent(e.target.value)}
                      placeholder="Watermark text (e.g., CONFIDENTIAL)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1">Opacity (0-1)</label>
                        <input type="number" step="0.1" min="0" max="1" value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Font Size</label>
                        <input type="number" value={watermarkSize} onChange={(e) => setWatermarkSize(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Applied diagonally across every page that remains after deletion.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-3">🔧 Page Operations</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use the 🗑 button on a page thumbnail to mark it for deletion, and the ⟳ button to rotate it 90° at a time. Changes are shown instantly on the thumbnails.
                  </p>
                </div>

                {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-3 text-sm">{error}</div>}
                {success && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl p-3 text-sm">{success}</div>}

                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
                >
                  {isProcessing ? "Processing..." : "Edit & Download PDF"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 max-w-7xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Privacy:</strong> Everything happens locally in your browser — your PDF is never uploaded to any server.
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Edit Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your edited PDF is ready.</p>
            <div className="flex flex-col gap-3">
              <a
                href={successUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Open PDF
              </a>
              <a
                href={successUrl}
                download="edited.pdf"
                className="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition"
              >
                Download Again
              </a>
              <button
                onClick={closePopup}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ProGate>
  );
}
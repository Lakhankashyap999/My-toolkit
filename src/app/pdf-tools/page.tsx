// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }
    if (!pageInput.trim()) {
      setError("Please enter page numbers to extract (e.g., 1,3-5).");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = srcPdf.getPageCount();

      // Parse page input
      const pageNumbers: number[] = [];
      const parts = pageInput.split(",");
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [startStr, endStr] = trimmed.split("-");
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (isNaN(start) || isNaN(end)) {
            setError("Invalid page range.");
            return;
          }
          for (let i = start; i <= end; i++) pageNumbers.push(i);
        } else {
          const page = parseInt(trimmed);
          if (!isNaN(page)) pageNumbers.push(page);
        }
      }

      const uniquePages = [...new Set(pageNumbers)].sort((a, b) => a - b);

      if (uniquePages.some((p) => p < 1 || p > totalPages)) {
        setError(`Page numbers must be between 1 and ${totalPages}.`);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, uniquePages.map((p) => p - 1));
      copiedPages.forEach((page) => newPdf.addPage(page));

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

      // Show popup
      setSuccessUrl(url);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/pdf-tools" className="text-sm text-gray-600 hover:text-blue-600">← Back to PDF Tools</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">✂️ Split / Extract Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Extract specific pages from your PDF. Enter page numbers like <code>1,3-5</code>.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <span className="text-5xl">📁</span>
            <span className="text-xl font-semibold">{file ? file.name : "Click to Upload PDF"}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Select a PDF file</span>
          </label>
        </div>

        {file && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm">
            <label className="block text-sm font-medium mb-2">Pages to Extract</label>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="e.g., 1,3-5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate pages with commas. Use hyphens for ranges.</p>
          </div>
        )}

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">{error}</div>}

        <div className="flex justify-center">
          <button
            onClick={handleExtract}
            disabled={isProcessing || !file}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {isProcessing ? "Extracting..." : "Extract Pages"}
          </button>
        </div>

        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Privacy:</strong> Files are processed in your browser, never uploaded.
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Extraction Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your PDF pages are ready.</p>
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
                download="extracted.pdf"
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
    </div>
  );
}
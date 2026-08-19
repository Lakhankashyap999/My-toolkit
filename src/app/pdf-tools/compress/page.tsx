"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");
  const [resultInfo, setResultInfo] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      setResultInfo("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setIsCompressing(true);
    setError("");
    setResultInfo("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      // Safe error handling: response may not be JSON
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Compression failed";
        try {
          const err = JSON.parse(text);
          if (err.error) errorMessage = err.error;
        } catch (e) {
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const originalSize = file.size;
      const compressedSize = blob.size;
      const percent = Math.round((1 - compressedSize / originalSize) * 100);

      setResultInfo(`Original: ${formatSize(originalSize)} → Compressed: ${formatSize(compressedSize)} (${percent > 0 ? `saved ${percent}%` : "no significant change"})`);

      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsCompressing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
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
          <h1 className="text-4xl font-bold mb-4">🗜️ Compress PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Reduce PDF file size. Note: Compression effectiveness depends on the PDF content.
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

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">{error}</div>}
        {resultInfo && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl p-4 mb-6 text-sm">{resultInfo}</div>}

        <div className="flex justify-center">
          <button
            onClick={handleCompress}
            disabled={isCompressing || !file}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {isCompressing ? "Compressing..." : "Compress PDF"}
          </button>
        </div>

        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Note:</strong> Our compression re-saves the PDF with optimized settings. For heavily image-based PDFs, reduction may be minimal.
        </div>
      </div>
    </div>
  );
}
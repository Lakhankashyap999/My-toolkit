// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length !== selectedFiles.length) setError("Only PDF files are allowed.");
    else setError("");
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files.");
      return;
    }
    setIsMerging(true);
    setError("");
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
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

      // Show popup
      setSuccessUrl(url);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsMerging(false);
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
          <h1 className="text-4xl font-bold mb-4">📑 Merge PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Combine multiple PDF files into a single document. Free, fast, and private — no upload to server.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
          <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <span className="text-5xl">📁</span>
            <span className="text-xl font-semibold">Click to Upload PDFs</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">You can select multiple files</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
            <h2 className="font-semibold mb-3">Selected Files ({files.length})</h2>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-sm truncate">📄 {file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">{error}</div>}

        <div className="flex justify-center">
          <button
            onClick={handleMerge}
            disabled={isMerging || files.length < 2}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {isMerging ? "Merging..." : "Merge PDFs"}
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
            <h2 className="text-2xl font-bold mb-2">Download Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your merged PDF is ready.</p>
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
                download="merged.pdf"
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
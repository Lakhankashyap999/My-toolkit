// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf");
    if (pdfFiles.length !== selectedFiles.length) setError("Only PDF files are allowed.");
    else setError("");
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleMerge = async () => {
    if (files.length < 2) { setError("Please upload at least 2 PDF files."); return; }
    setIsMerging(true);
    setError("");
    try {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      const response = await fetch("/api/merge-pdfs", { method: "POST", body: formData });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Merge failed";
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
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsMerging(false);
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
          <p className="text-gray-600 dark:text-gray-300 text-lg">Combine multiple PDF files into a single document.</p>
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
            <ul className="space-y-2">{files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                <span className="text-sm truncate">📄 {file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
              </li>
            ))}</ul>
          </div>
        )}
        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">{error}</div>}
        <div className="flex justify-center">
          <button onClick={handleMerge} disabled={isMerging || files.length < 2} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition">{isMerging ? "Merging..." : "Merge PDFs"}</button>
        </div>
      </div>
    </div>
  );
}
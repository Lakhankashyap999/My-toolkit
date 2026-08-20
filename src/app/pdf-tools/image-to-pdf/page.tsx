// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validImages = selectedFiles.filter(file => file.type.startsWith("image/"));
    if (validImages.length !== selectedFiles.length) setError("Only image files are allowed (JPG, PNG).");
    else setError("");
    setImages(prev => [...prev, ...validImages]);
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleConvert = async () => {
    if (images.length === 0) { setError("Please upload at least one image."); return; }
    setIsConverting(true);
    setError("");
    try {
      const formData = new FormData();
      images.forEach(image => formData.append("images", image));
      const response = await fetch("/api/image-to-pdf", { method: "POST", body: formData });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Conversion failed";
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
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsConverting(false);
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
          <h1 className="text-4xl font-bold mb-4">🖼️ Image to PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Convert JPG or PNG images into a single PDF document.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="image-upload" ref={fileInputRef} />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <span className="text-5xl">📁</span>
            <span className="text-xl font-semibold">Click to Upload Images</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG supported. Multiple files allowed.</span>
          </label>
        </div>
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
            <h2 className="font-semibold mb-3">Selected Images ({images.length})</h2>
            <ul className="space-y-2">
              {images.map((image, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-sm truncate">🖼️ {image.name}</span>
                  <button onClick={() => removeImage(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-sm">{error}</div>}
        <div className="flex justify-center">
          <button onClick={handleConvert} disabled={isConverting || images.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition">{isConverting ? "Converting..." : "Convert to PDF"}</button>
        </div>
        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Privacy:</strong> Images are processed securely and never stored.
        </div>
      </div>
    </div>
  );
}
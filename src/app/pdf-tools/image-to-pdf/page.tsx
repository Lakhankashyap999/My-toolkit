// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
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
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setIsConverting(true);
    setError("");
    try {
      const pdfDoc = await PDFDocument.create();

      for (const image of images) {
        const arrayBuffer = await image.arrayBuffer();
        const mimeType = image.type;
        let embeddedImage;

        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (mimeType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Show popup
      setSuccessUrl(url);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsConverting(false);
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
          <h1 className="text-4xl font-bold mb-4">🖼️ Image to PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Convert JPG or PNG images into a single PDF document. Free, fast, and private.</p>
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
          <button onClick={handleConvert} disabled={isConverting || images.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition">
            {isConverting ? "Converting..." : "Convert to PDF"}
          </button>
        </div>
        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Privacy:</strong> Images are processed in your browser, never uploaded.
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Conversion Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your PDF is ready.</p>
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
                download="converted.pdf"
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
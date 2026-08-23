// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import AuthGate from "../../../components/AuthGate";
import ProGate from "../../../components/ProGate";

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [addTextContent, setAddTextContent] = useState("");
  const [addTextX, setAddTextX] = useState(50);
  const [addTextY, setAddTextY] = useState(50);
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [watermarkContent, setWatermarkContent] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkSize, setWatermarkSize] = useState(40);
  const [deletePagesInput, setDeletePagesInput] = useState("");
  const [rotateAngle, setRotateAngle] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFileUrl(URL.createObjectURL(selected));
      // Reset fields
      setAddTextContent("");
      setWatermarkContent("");
      setDeletePagesInput("");
      setRotateAngle(0);
      setSelectedPage(1);
      setAddTextX(50);
      setAddTextY(50);
      setTextSize(16);
      setTextColor("#000000");
      setWatermarkOpacity(0.3);
      setWatermarkSize(40);
    } else {
      setFile(null);
      setFileUrl("");
      setError("Please select a valid PDF file.");
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    if (!addTextContent && !watermarkContent && !deletePagesInput.trim() && rotateAngle === 0) {
      setError("Please specify at least one edit operation.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("add_text", addTextContent);
      formData.append("add_text_x", String(addTextX));
      formData.append("add_text_y", String(addTextY));
      formData.append("text_size", String(textSize));
      formData.append("text_color", textColor);
      formData.append("watermark", watermarkContent);
      formData.append("watermark_opacity", String(watermarkOpacity));
      formData.append("watermark_size", String(watermarkSize));
      formData.append("delete_pages", deletePagesInput);
      formData.append("rotate_angle", String(rotateAngle));
      formData.append("selected_page", String(selectedPage));

      const response = await fetch("/api/edit-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Edit failed" }));
        throw new Error(err.error || "Edit failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccessUrl(url);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong while editing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (successUrl) URL.revokeObjectURL(successUrl);
    setSuccessUrl("");
  };

  return (
    <AuthGate>
      <ProGate>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
          <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></a>
              <div className="flex items-center gap-4">
                <a href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</a>
                <a href="/pdf-tools" className="text-sm text-gray-600 hover:text-blue-600">PDF Tools</a>
                <a href="/account" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-lg">👤</a>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">✏️ Edit PDF</h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                Upload a PDF, add text, watermark, delete or rotate pages — securely processed on our server.
              </p>
            </div>

            {!file ? (
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <span className="text-5xl">📁</span>
                  <span className="text-xl font-semibold">Click to Upload PDF</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Your file is processed securely, not stored.</span>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <iframe src={fileUrl} className="w-full h-[600px]" title="PDF Preview" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 This is a preview only. Edit settings on the right panel.
                  </p>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-lg mb-3">➕ Add Text</h2>
                    <div className="space-y-3">
                      <input type="text" value={addTextContent} onChange={(e) => setAddTextContent(e.target.value)} placeholder="Text to add (e.g., Approved by ABC)" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      <div>
                        <label className="block text-xs mb-1">Page Number</label>
                        <input type="number" min={1} value={selectedPage} onChange={(e) => setSelectedPage(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="block text-xs mb-1">X Position</label><input type="number" value={addTextX} onChange={(e) => setAddTextX(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                        <div><label className="block text-xs mb-1">Y Position</label><input type="number" value={addTextY} onChange={(e) => setAddTextY(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                        <div><label className="block text-xs mb-1">Font Size</label><input type="number" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                        <div><label className="block text-xs mb-1">Color</label><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-lg mb-3">💧 Watermark</h2>
                    <div className="space-y-3">
                      <input type="text" value={watermarkContent} onChange={(e) => setWatermarkContent(e.target.value)} placeholder="Watermark text (e.g., CONFIDENTIAL)" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="block text-xs mb-1">Opacity (0-1)</label><input type="number" step="0.1" min="0" max="1" value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                        <div><label className="block text-xs mb-1">Font Size</label><input type="number" value={watermarkSize} onChange={(e) => setWatermarkSize(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-lg mb-3">🔧 Page Operations</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1">Delete Pages (e.g., 2,4-6)</label>
                        <input type="text" value={deletePagesInput} onChange={(e) => setDeletePagesInput(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Rotate Pages</label>
                        <select value={rotateAngle} onChange={(e) => setRotateAngle(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <option value={0}>No Rotation</option>
                          <option value={90}>90° Clockwise</option>
                          <option value={180}>180°</option>
                          <option value={270}>270° Clockwise</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-3 text-sm">{error}</div>}

                  <button onClick={handleProcess} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition">
                    {isProcessing ? "Processing..." : "Edit & Download PDF"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 max-w-7xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Privacy:</strong> File is processed securely and deleted immediately after editing.
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Edit Complete!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your edited PDF is ready.</p>
              <div className="flex flex-col gap-3">
                <a href={successUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">Open PDF</a>
                <a href={successUrl} download="edited.pdf" className="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition">Download Again</a>
                <button onClick={closePopup} className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition">Close</button>
              </div>
            </div>
          </div>
        )}
      </ProGate>
    </AuthGate>
  );
}
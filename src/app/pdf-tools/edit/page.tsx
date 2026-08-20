// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ProGate from "../../components/ProGate";

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  
  const [addTextContent, setAddTextContent] = useState("");
  const [addTextX, setAddTextX] = useState(100);
  const [addTextY, setAddTextY] = useState(100);
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");

  const [watermarkContent, setWatermarkContent] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkSize, setWatermarkSize] = useState(40);

  const [deletePagesInput, setDeletePagesInput] = useState("");
  const [rotateAngle, setRotateAngle] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      setSuccess("");
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFileUrl(URL.createObjectURL(selected));
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
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("addText", addTextContent);
      formData.append("addTextX", String(addTextX));
      formData.append("addTextY", String(addTextY));
      formData.append("textSize", String(textSize));
      formData.append("textColor", textColor);
      formData.append("watermark", watermarkContent);
      formData.append("watermarkOpacity", String(watermarkOpacity));
      formData.append("watermarkSize", String(watermarkSize));
      formData.append("deletePages", deletePagesInput);
      formData.append("rotateAngle", String(rotateAngle));

      // Token localStorage se nikalo
      let token = "";
      const proData = localStorage.getItem("toolbox_pro");
      if (proData) {
        try {
          const parsed = JSON.parse(proData);
          token = parsed.token || "";
        } catch {}
      }

      const response = await fetch("/api/edit-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Edit failed";
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
      a.download = "edited.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setSuccess("PDF edited successfully! Download started.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProGate>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
            <Link href="/pdf-tools" className="text-sm text-gray-600 hover:text-blue-600">← Back to PDF Tools</Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">✏️ Edit PDF</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload PDF, add text, watermark, delete or rotate pages.
            </p>
          </div>

          {!file && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" ref={fileInputRef} />
              <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <span className="text-5xl">📁</span>
                <span className="text-xl font-semibold">Click to Upload PDF</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">PDF preview will appear below</span>
              </label>
            </div>
          )}

          {file && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src={fileUrl}
                    className="w-full h-[600px]"
                    title="PDF Preview"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Preview uses browser's built-in PDF viewer. Coordinates are in PDF points (origin bottom-left).
                </p>
              </div>

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
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-3">🔧 Page Operations</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1">Delete Pages</label>
                      <input
                        type="text"
                        value={deletePagesInput}
                        onChange={(e) => setDeletePagesInput(e.target.value)}
                        placeholder="e.g., 2,4-6"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Rotate Pages</label>
                      <select
                        value={rotateAngle}
                        onChange={(e) => setRotateAngle(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <option value={0}>No Rotation</option>
                        <option value={90}>90° Clockwise</option>
                        <option value={180}>180°</option>
                        <option value={270}>270° Clockwise</option>
                      </select>
                    </div>
                  </div>
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
            💡 <strong>Privacy:</strong> Files are processed securely and never stored.
          </div>
        </div>
      </div>
    </ProGate>
  );
}
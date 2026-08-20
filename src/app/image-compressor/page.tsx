// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import AuthGate from "../../components/AuthGate";

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.7);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setCompressedFile(null);
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setCompressedSize(0);
    setCompressedUrl("");
  };

  const compressImage = async () => {
    if (!originalFile) return;

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
      setCompressedSize(compressed.size);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedFile) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed_${originalFile?.name || "image"}`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-xl font-bold">ToolBox</span>
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
              ← Back to Home
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">🖼️ Image Compressor</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Reduce image file size without losing quality. Free, fast, and private — no upload to server.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <span className="text-5xl">📁</span>
              <span className="text-xl font-semibold">
                {originalFile ? "Choose Another Image" : "Click to Upload Image"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                JPG, PNG, WebP supported
              </span>
            </label>
          </div>

          {originalFile && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 shadow-sm">
              <label className="block text-sm font-medium mb-2">
                Compression Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More Compression</span>
                <span>Better Quality</span>
              </div>
            </div>
          )}

          {originalFile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-2">Original</h3>
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg mb-3"
                />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Size: {formatSize(originalSize)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-2">Compressed</h3>
                {compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 text-gray-400">
                    Compressed preview will appear here
                  </div>
                )}
                {compressedSize > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Size: {formatSize(compressedSize)}{" "}
                    <span className="text-green-600 font-medium">
                      (Saved {Math.round((1 - compressedSize / originalSize) * 100)}%)
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {originalFile && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={compressImage}
                disabled={isCompressing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {isCompressing ? "Compressing..." : "Compress Image"}
              </button>
              {compressedFile && (
                <button
                  onClick={downloadCompressed}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Download Compressed
                </button>
              )}
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setCompressedFile(null);
                  setOriginalUrl("");
                  setCompressedUrl("");
                  setOriginalSize(0);
                  setCompressedSize(0);
                }}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Reset
              </button>
            </div>
          )}

          <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Privacy:</strong> All compression happens in your browser. Your images never leave your device.
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
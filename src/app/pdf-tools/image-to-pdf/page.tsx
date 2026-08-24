// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import AuthGate from "../../../components/AuthGate";

const FEATURES = [
  { icon: "🔒", label: "100% Private", note: "Processed in browser" },
  { icon: "⚡", label: "Instant", note: "Instant convert" },
  { icon: "🗂️", label: "Multi-page", note: "Multiple images at once" },
  { icon: "🖼️", label: "JPG & PNG", note: "Both formats supported" },
];

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Page size constants (points)
const A4_PORTRAIT = [595.28, 841.89];
const A4_LANDSCAPE = [841.89, 595.28];
const LETTER_PORTRAIT = [612, 792];
const LETTER_LANDSCAPE = [792, 612];

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [elapsedLabel, setElapsedLabel] = useState("");
  const [pageSize, setPageSize] = useState<"fit" | "a4p" | "a4l" | "letter">("fit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const addFiles = (fileList: FileList | File[]) => {
    const selectedFiles = Array.from(fileList);
    const validImages = selectedFiles.filter((file) => file.type.startsWith("image/"));
    if (validImages.length !== selectedFiles.length) setError("Only image files are allowed (JPG, PNG).");
    else setError("");
    setImages((prev) => [...prev, ...validImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const newImages = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= newImages.length) return newImages;
      [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
      return newImages;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setIsConverting(true);
    setError("");
    setProgress(2);
    setStage("Preparing...");
    const start = performance.now();

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const arrayBuffer = await image.arrayBuffer();
        const mimeType = image.type;
        let embeddedImage;

        setStage(`Processing page ${i + 1} of ${images.length}`);

        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (mimeType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        let pageWidth: number, pageHeight: number;
        let drawWidth: number, drawHeight: number;
        let x: number, y: number;

        if (pageSize === "fit") {
          // Determine orientation based on image aspect ratio
          const imgRatio = embeddedImage.width / embeddedImage.height;
          // Cap page size to A4 portrait/landscape dimensions
          const maxLong = 842;   // points
          const maxShort = 595;  // points
          if (imgRatio > 1) {
            // Landscape
            pageWidth = Math.min(maxLong, embeddedImage.width * 72 / 96); // 96 DPI
            pageHeight = pageWidth / imgRatio;
            // ensure within short dimension
            if (pageHeight > maxShort) {
              pageHeight = maxShort;
              pageWidth = pageHeight * imgRatio;
            }
          } else {
            // Portrait
            pageHeight = Math.min(maxLong, embeddedImage.height * 72 / 96);
            pageWidth = pageHeight * imgRatio;
            if (pageWidth > maxShort) {
              pageWidth = maxShort;
              pageHeight = pageWidth / imgRatio;
            }
          }
          // No margin, image fills page exactly
          drawWidth = pageWidth;
          drawHeight = pageHeight;
          x = 0;
          y = 0;
        } else {
          // Standard page sizes
          if (pageSize === "a4p") [pageWidth, pageHeight] = A4_PORTRAIT;
          else if (pageSize === "a4l") [pageWidth, pageHeight] = A4_LANDSCAPE;
          else if (pageSize === "letter") [pageWidth, pageHeight] = LETTER_PORTRAIT;
          else [pageWidth, pageHeight] = A4_PORTRAIT; // fallback

          // Scale image to fit within page with margin
          const margin = 36; // 0.5 inch
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;
          const scale = Math.min(maxWidth / embeddedImage.width, maxHeight / embeddedImage.height, 1);
          drawWidth = embeddedImage.width * scale;
          drawHeight = embeddedImage.height * scale;
          x = (pageWidth - drawWidth) / 2;
          y = (pageHeight - drawHeight) / 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, { x, y, width: drawWidth, height: drawHeight });

        setProgress(8 + Math.round(((i + 1) / images.length) * 72));
        await sleep(50);
      }

      setStage("Creating PDF...");
      setProgress(92);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const elapsed = performance.now() - start;
      if (elapsed < 650) await sleep(650 - elapsed);

      setProgress(100);
      setStage("Done!");
      setElapsedLabel(((performance.now() - start) / 1000).toFixed(1));

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccessUrl(url);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setProgress(0);
    setStage("");
    if (successUrl) {
      URL.revokeObjectURL(successUrl);
      setSuccessUrl("");
    }
  };

  return (
    <AuthGate>
      <div className="itp-root">
        <nav className="itp-nav">
          <div className="itp-nav-inner">
            <a href="/" className="itp-brand">
              <span className="itp-brand-icon">🛠️</span>
              <span className="itp-brand-text">ToolBox</span>
            </a>
            <div className="itp-nav-links">
              <a href="/">← Home</a>
              <a href="/pdf-tools">PDF Tools</a>
            </div>
          </div>
        </nav>

        <div className="itp-wrap">
          <div className="itp-hero">
            <h1>Image to PDF</h1>
            <p>Convert JPG or PNG images into a professional PDF — privately, instantly.</p>
          </div>

          <div className="itp-features">
            {FEATURES.map((f) => (
              <div className="itp-feature" key={f.label}>
                <span className="itp-feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.label}</strong>
                  <span>{f.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div
            className={`itp-dropzone ${dragActive ? "itp-drop-active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="itp-hidden-input"
              id="image-upload"
              ref={fileInputRef}
            />
            <label htmlFor="image-upload" className="itp-drop-label">
              <div className="itp-drop-icon">📁</div>
              <div className="itp-drop-title">Drop images here or click to upload</div>
              <div className="itp-drop-sub">JPG, PNG · multiple files supported</div>
            </label>
          </div>

          {/* Image grid */}
          {images.length > 0 && (
            <div className="itp-card">
              <div className="itp-card-header">
                <span>Selected Images</span>
                <span className="itp-badge">{images.length}</span>
              </div>
              <div className="itp-grid">
                {images.map((image, index) => (
                  <div className="itp-grid-item" key={index}>
                    <img src={URL.createObjectURL(image)} alt={image.name} className="itp-grid-img" />
                    <div className="itp-grid-overlay">
                      <span className="itp-grid-index">{index + 1}</span>
                    </div>
                    <div className="itp-grid-actions">
                      <button
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="itp-grid-btn"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveImage(index, "down")}
                        disabled={index === images.length - 1}
                        className="itp-grid-btn"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="itp-grid-btn itp-grid-remove"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="itp-grid-name">{image.name}</div>
                  </div>
                ))}
              </div>
              <button className="itp-add-more" onClick={() => fileInputRef.current?.click()}>
                + Add More Images
              </button>
            </div>
          )}

          {/* Page size */}
          {images.length > 0 && (
            <div className="itp-card itp-options-card">
              <span className="itp-options-label">Page size</span>
              <div className="itp-options">
                <button className={`itp-option ${pageSize === "fit" ? "itp-option-active" : ""}`} onClick={() => setPageSize("fit")}>
                  Fit to image
                </button>
                <button className={`itp-option ${pageSize === "a4p" ? "itp-option-active" : ""}`} onClick={() => setPageSize("a4p")}>
                  A4 Portrait
                </button>
                <button className={`itp-option ${pageSize === "a4l" ? "itp-option-active" : ""}`} onClick={() => setPageSize("a4l")}>
                  A4 Landscape
                </button>
                <button className={`itp-option ${pageSize === "letter" ? "itp-option-active" : ""}`} onClick={() => setPageSize("letter")}>
                  Letter
                </button>
              </div>
            </div>
          )}

          {error && <div className="itp-error">{error}</div>}

          <div className="itp-convert-row">
            <button
              onClick={handleConvert}
              disabled={isConverting || images.length === 0}
              className="itp-convert-btn"
            >
              {isConverting ? "Converting..." : "Convert to PDF"}
            </button>
          </div>

          {isConverting && (
            <div className="itp-card itp-progress-card">
              <div className="itp-progress-head">
                <span className="itp-printer-icon">🖨️</span>
                <span className="itp-stage-text">{stage}</span>
                <span className="itp-progress-pct">{progress}%</span>
              </div>
              <div className="itp-gauge">
                <div className="itp-gauge-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="itp-privacy-note">💡 Your images stay on your device — never uploaded.</div>
        </div>

        {showPopup && (
          <div className="itp-overlay">
            <div className="itp-popup">
              <div className="itp-popup-check">✅</div>
              <h2>PDF Ready!</h2>
              <p>Created in {elapsedLabel}s</p>
              <div className="itp-popup-actions">
                <a href={successUrl} target="_blank" rel="noopener noreferrer" className="itp-btn-primary">Open PDF</a>
                <a href={successUrl} download="converted.pdf" className="itp-btn-secondary">Download Again</a>
                <button onClick={closePopup} className="itp-btn-ghost">Close</button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        `}</style>

        <style jsx>{`
          .itp-root {
            --bg: #f9fafb;
            --card-bg: #ffffff;
            --text: #111827;
            --muted: #6b7280;
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --border: #e5e7eb;
            --error-bg: #fee2e2;
            --error-border: #fecaca;
            --error-text: #b91c1c;
            --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            min-height: 100vh;
            background: var(--bg);
            color: var(--text);
            font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .itp-nav {
            position: sticky;
            top: 0;
            z-index: 40;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
          }
          .itp-nav-inner {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 16px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .itp-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: var(--text);
            font-weight: 600;
            font-size: 18px;
          }
          .itp-nav-links {
            display: flex;
            gap: 16px;
            font-size: 14px;
          }
          .itp-nav-links a {
            color: var(--muted);
            text-decoration: none;
          }
          .itp-nav-links a:hover {
            color: var(--primary);
          }

          .itp-wrap {
            max-width: 800px;
            margin: 0 auto;
            padding: 32px 16px 64px;
          }

          .itp-hero {
            text-align: center;
            margin-bottom: 24px;
          }
          .itp-hero h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px;
          }
          .itp-hero p {
            color: var(--muted);
            font-size: 16px;
          }

          .itp-features {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .itp-feature {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow-sm);
          }
          .itp-feature-icon {
            font-size: 22px;
          }
          .itp-feature strong {
            font-size: 13px;
            display: block;
          }
          .itp-feature span:last-child {
            font-size: 11px;
            color: var(--muted);
          }

          .itp-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: var(--shadow-sm);
            padding: 16px;
            margin-bottom: 16px;
          }
          .itp-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .itp-badge {
            background: #e0e7ff;
            color: var(--primary);
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 12px;
          }

          .itp-dropzone {
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            padding: 32px 16px;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            margin-bottom: 16px;
            background: var(--card-bg);
          }
          .itp-drop-active {
            border-color: var(--primary);
            background: #f0f4ff;
          }
          .itp-hidden-input {
            display: none;
          }
          .itp-drop-icon {
            font-size: 40px;
            margin-bottom: 8px;
          }
          .itp-drop-title {
            font-weight: 600;
            font-size: 16px;
          }
          .itp-drop-sub {
            font-size: 13px;
            color: var(--muted);
          }

          .itp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 12px;
          }
          .itp-grid-item {
            position: relative;
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
            background: #f3f4f6;
            aspect-ratio: 4/3;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .itp-grid-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .itp-grid-overlay {
            position: absolute;
            top: 6px;
            left: 6px;
          }
          .itp-grid-index {
            background: rgba(0,0,0,0.6);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .itp-grid-actions {
            position: absolute;
            bottom: 6px;
            right: 6px;
            display: flex;
            gap: 4px;
          }
          .itp-grid-btn {
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 12px;
            color: #374151;
            transition: background 0.2s;
          }
          .itp-grid-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .itp-grid-btn:not(:disabled):hover {
            background: white;
          }
          .itp-grid-remove {
            color: #dc2626;
          }
          .itp-grid-name {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.95);
            padding: 4px 6px;
            font-size: 11px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .itp-add-more {
            width: 100%;
            background: #f9fafb;
            border: 1px dashed #d1d5db;
            border-radius: 8px;
            padding: 8px;
            font-size: 13px;
            color: var(--primary);
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
          }
          .itp-add-more:hover {
            background: #f3f4f6;
          }

          .itp-options-card {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .itp-options-label {
            font-weight: 600;
            font-size: 14px;
          }
          .itp-options {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }
          .itp-option {
            background: white;
            border: 1px solid var(--border);
            border-radius: 999px;
            padding: 6px 14px;
            font-size: 13px;
            cursor: pointer;
            color: var(--muted);
            transition: all 0.2s;
          }
          .itp-option-active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
          }

          .itp-error {
            background: var(--error-bg);
            border: 1px solid var(--error-border);
            color: var(--error-text);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 16px;
          }

          .itp-convert-row {
            display: flex;
            justify-content: center;
            margin-top: 16px;
          }
          .itp-convert-btn {
            background: var(--primary);
            color: white;
            border: none;
            font-weight: 600;
            font-size: 16px;
            padding: 12px 32px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .itp-convert-btn:not(:disabled):hover {
            background: var(--primary-hover);
          }
          .itp-convert-btn:disabled {
            background: #d1d5db;
            cursor: not-allowed;
          }

          .itp-progress-card {
            margin-top: 16px;
          }
          .itp-progress-head {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .itp-printer-icon {
            font-size: 18px;
          }
          .itp-stage-text {
            flex: 1;
            color: var(--muted);
          }
          .itp-progress-pct {
            font-weight: 600;
            color: var(--primary);
          }
          .itp-gauge {
            height: 8px;
            background: #e5e7eb;
            border-radius: 999px;
            overflow: hidden;
          }
          .itp-gauge-fill {
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            border-radius: 999px;
            transition: width 0.3s;
          }

          .itp-privacy-note {
            text-align: center;
            font-size: 13px;
            color: var(--muted);
            margin-top: 16px;
          }

          .itp-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
          }
          .itp-popup {
            background: white;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            max-width: 320px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          }
          .itp-popup-check {
            font-size: 48px;
            margin-bottom: 12px;
          }
          .itp-popup h2 {
            margin: 0 0 8px;
            font-size: 20px;
          }
          .itp-popup p {
            color: var(--muted);
            margin-bottom: 20px;
          }
          .itp-popup-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .itp-btn-primary,
          .itp-btn-secondary,
          .itp-btn-ghost {
            display: block;
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
          }
          .itp-btn-primary {
            background: var(--primary);
            color: white;
          }
          .itp-btn-primary:hover {
            background: var(--primary-hover);
          }
          .itp-btn-secondary {
            background: #f3f4f6;
            color: var(--text);
          }
          .itp-btn-secondary:hover {
            background: #e5e7eb;
          }
          .itp-btn-ghost {
            background: transparent;
            color: var(--muted);
          }
          .itp-btn-ghost:hover {
            background: #f9fafb;
          }

          @media (max-width: 640px) {
            .itp-features {
              grid-template-columns: repeat(2, 1fr);
            }
            .itp-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .itp-hero h1 {
              font-size: 26px;
            }
          }
        `}</style>
      </div>
    </AuthGate>
  );
}
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
    setStage("Preparing ticket...");
    const start = performance.now();

    try {
      const pdfDoc = await PDFDocument.create();

      // Define standard page sizes (in points)
      const pageSizes = {
        a4p: [595.28, 841.89], // A4 portrait
        a4l: [841.89, 595.28], // A4 landscape
        letter: [612, 792], // Letter portrait
      };

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const arrayBuffer = await image.arrayBuffer();
        const mimeType = image.type;
        let embeddedImage;

        setStage(`Preparing page ${i + 1} of ${images.length}`);

        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (mimeType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        let pageWidth, pageHeight;

        if (pageSize === "fit") {
          // Use image's original dimensions
          pageWidth = embeddedImage.width;
          pageHeight = embeddedImage.height;
        } else {
          // Use standard page size, image will be centered and scaled to fit
          [pageWidth, pageHeight] = pageSizes[pageSize];
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate scale to fit image within page
        const scaleX = pageWidth / embeddedImage.width;
        const scaleY = pageHeight / embeddedImage.height;
        const scale = Math.min(scaleX, scaleY, 1); // don't upscale if fit mode not used? actually if page larger than image, we can upscale to fill? Usually fit means scale to fit, but not exceeding. We'll keep scale <=1 for non-fit mode.

        const drawWidth = embeddedImage.width * (pageSize === "fit" ? 1 : scale);
        const drawHeight = embeddedImage.height * (pageSize === "fit" ? 1 : scale);

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });

        setProgress(8 + Math.round(((i + 1) / images.length) * 72));
        await sleep(60);
      }

      setStage("Sealing PDF...");
      setProgress(92);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const elapsed = performance.now() - start;
      const minVisibleDuration = 650;
      if (elapsed < minVisibleDuration) await sleep(minVisibleDuration - elapsed);

      setProgress(100);
      setStage("Done!");

      const totalSeconds = ((performance.now() - start) / 1000).toFixed(1);
      setElapsedLabel(totalSeconds);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccessUrl(url);
      await sleep(200);
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
            <span className="itp-eyebrow">IMG → PDF</span>
            <h1>Image to PDF</h1>
            <p>Convert your JPG or PNG images into a clean PDF — completely private, completely fast.</p>
          </div>

          {/* Tools / feature strip */}
          <div className="itp-chip-row">
            {FEATURES.map((f) => (
              <div className="itp-chip" key={f.label}>
                <span className="itp-chip-icon">{f.icon}</span>
                <div className="itp-chip-text">
                  <strong>{f.label}</strong>
                  <span>{f.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload ticket */}
          <div
            className={`itp-ticket itp-dropzone ${dragActive ? "itp-drop-active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
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
              <span className="itp-drop-icon">📁</span>
              <span className="itp-drop-title">Drop images here or click to upload</span>
              <span className="itp-drop-sub">JPG, PNG · multiple files supported</span>
            </label>
          </div>

          {/* Image list with thumbnails and controls */}
          {images.length > 0 && (
            <div className="itp-ticket itp-list">
              <div className="itp-list-head">
                <span>Selected Images</span>
                <span className="itp-mono">{images.length} file{images.length > 1 ? "s" : ""}</span>
              </div>
              <ul>
                {images.map((image, index) => (
                  <li key={index}>
                    <span className="itp-mono itp-list-num">{String(index + 1).padStart(2, "0")}</span>
                    <div className="itp-thumb">
                      {/* Thumbnail preview */}
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="itp-thumb-img"
                      />
                    </div>
                    <span className="itp-list-name">🖼️ {image.name}</span>
                    <div className="itp-list-actions">
                      <button
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        title="Move up"
                        className="itp-action-btn"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveImage(index, "down")}
                        disabled={index === images.length - 1}
                        title="Move down"
                        className="itp-action-btn"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        title="Remove"
                        className="itp-remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="itp-add-more"
                onClick={() => fileInputRef.current?.click()}
              >
                + Add More Images
              </button>
            </div>
          )}

          {/* Page size selector */}
          {images.length > 0 && (
            <div className="itp-ticket itp-options">
              <span className="itp-options-label">Page size:</span>
              <div className="itp-options-group">
                <button
                  className={`itp-option ${pageSize === "fit" ? "itp-option-active" : ""}`}
                  onClick={() => setPageSize("fit")}
                >
                  Fit to image
                </button>
                <button
                  className={`itp-option ${pageSize === "a4p" ? "itp-option-active" : ""}`}
                  onClick={() => setPageSize("a4p")}
                >
                  A4 Portrait
                </button>
                <button
                  className={`itp-option ${pageSize === "a4l" ? "itp-option-active" : ""}`}
                  onClick={() => setPageSize("a4l")}
                >
                  A4 Landscape
                </button>
                <button
                  className={`itp-option ${pageSize === "letter" ? "itp-option-active" : ""}`}
                  onClick={() => setPageSize("letter")}
                >
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

          {/* Progress ticket */}
          {isConverting && (
            <div className="itp-ticket itp-progress-card">
              <div className="itp-progress-head">
                <span className="itp-printer-icon">🖨️</span>
                <span className="itp-stage-text">{stage}</span>
                <span className="itp-mono itp-progress-pct">{progress}%</span>
              </div>
              <div className="itp-gauge">
                <div className="itp-gauge-fill" style={{ width: `${progress}%` }} />
                <div className="itp-gauge-ticks" />
              </div>
            </div>
          )}

          <div className="itp-privacy-note">💡 Images are processed in your browser, never uploaded.</div>
        </div>

        {showPopup && (
          <div className="itp-overlay" role="dialog" aria-modal="true">
            <div className="itp-ticket itp-done-card">
              <div className="itp-stamp">
                <span>DONE</span>
              </div>
              <h2>All done!</h2>
              <p>
                Just <strong className="itp-mono">{elapsedLabel}s</strong> to create your PDF.
              </p>
              <div className="itp-done-actions">
                <a href={successUrl} target="_blank" rel="noopener noreferrer" className="itp-btn-primary">
                  Open PDF
                </a>
                <a href={successUrl} download="converted.pdf" className="itp-btn-secondary">
                  Download Again
                </a>
                <button onClick={closePopup} className="itp-btn-ghost">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        `}</style>

        <style jsx>{`
          .itp-root {
            --paper: #fbfbfd;
            --paper-deep: #f5f5f7;
            --ink: #1d1d1f;
            --ink-soft: #6e6e73;
            --press: #0071e3;
            --press-deep: #0077ed;
            --signal: #0071e3;
            --success: #30d158;
            --line: #d2d2d7;
            min-height: 100vh;
            background: var(--paper);
            color: var(--ink);
            font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .itp-nav {
            position: sticky;
            top: 0;
            z-index: 40;
            background: rgba(251, 251, 253, 0.9);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          .itp-nav-inner {
            max-width: 880px;
            margin: 0 auto;
            padding: 0 16px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .itp-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: var(--ink);
            font-family: "Inter", sans-serif;
            font-weight: 600;
            font-size: 17px;
          }
          .itp-nav-links {
            display: flex;
            gap: 18px;
            font-size: 13px;
          }
          .itp-nav-links a {
            color: var(--ink-soft);
            text-decoration: none;
          }
          .itp-nav-links a:hover {
            color: var(--press);
          }

          .itp-wrap {
            max-width: 720px;
            margin: 0 auto;
            padding: 40px 16px 64px;
          }

          .itp-hero {
            text-align: center;
            margin-bottom: 28px;
          }
          .itp-eyebrow {
            font-family: "Inter", sans-serif;
            font-size: 12px;
            letter-spacing: 0.14em;
            color: var(--signal);
            font-weight: 600;
          }
          .itp-hero h1 {
            font-family: "Inter", sans-serif;
            font-size: clamp(28px, 6vw, 42px);
            font-weight: 600;
            margin: 6px 0 10px;
            letter-spacing: -0.01em;
          }
          .itp-hero p {
            color: var(--ink-soft);
            font-size: 15px;
            max-width: 480px;
            margin: 0 auto;
          }

          .itp-chip-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
          .itp-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 10px 8px;
          }
          .itp-chip-icon {
            font-size: 18px;
          }
          .itp-chip-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }
          .itp-chip-text strong {
            font-size: 12.5px;
          }
          .itp-chip-text span {
            font-size: 10.5px;
            color: var(--ink-soft);
          }

          .itp-ticket {
            position: relative;
            background: white;
            border: 1px solid var(--line);
            border-radius: 14px;
            margin-bottom: 18px;
          }
          .itp-ticket::before,
          .itp-ticket::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 12px;
            background-image: radial-gradient(circle at 10px 0, transparent 8px, var(--paper) 9px);
            background-size: 20px 12px;
            background-repeat: repeat-x;
          }
          .itp-ticket::before {
            top: -1px;
          }
          .itp-ticket::after {
            bottom: -1px;
            transform: rotate(180deg);
          }

          .itp-dropzone {
            padding: 32px 16px;
            text-align: center;
            border-style: dashed;
            border-color: var(--press);
            transition: background 0.2s ease, transform 0.15s ease;
          }
          .itp-drop-active {
            background: #eef4fa;
            transform: scale(1.01);
          }
          .itp-hidden-input {
            display: none;
          }
          .itp-drop-label {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .itp-drop-icon {
            font-size: 38px;
          }
          .itp-drop-title {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            font-size: 17px;
          }
          .itp-drop-sub {
            font-size: 12.5px;
            color: var(--ink-soft);
          }

          .itp-list {
            padding: 16px;
          }
          .itp-list-head {
            display: flex;
            justify-content: space-between;
            font-size: 12.5px;
            color: var(--ink-soft);
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed var(--line);
          }
          .itp-mono {
            font-family: "Inter", sans-serif;
            font-variant-numeric: tabular-nums;
          }
          .itp-list ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .itp-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--paper-deep);
            border-radius: 8px;
            padding: 8px 10px;
            transition: background 0.2s;
          }
          .itp-list li:hover {
            background: #e9e9eb;
          }
          .itp-list-num {
            font-size: 11px;
            color: var(--signal);
            min-width: 24px;
            text-align: center;
          }
          .itp-thumb {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .itp-thumb-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .itp-list-name {
            flex: 1;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .itp-list-actions {
            display: flex;
            gap: 4px;
          }
          .itp-action-btn,
          .itp-remove-btn {
            background: none;
            border: 1px solid transparent;
            cursor: pointer;
            font-size: 13px;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s;
          }
          .itp-action-btn {
            color: var(--ink-soft);
          }
          .itp-action-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          .itp-action-btn:not(:disabled):hover {
            background: var(--line);
            color: var(--ink);
          }
          .itp-remove-btn {
            color: #c14c4c;
          }
          .itp-remove-btn:hover {
            background: #fdecea;
            border-color: #f2c4c0;
          }

          .itp-add-more {
            margin-top: 10px;
            background: var(--paper-deep);
            border: 1px dashed var(--line);
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            width: 100%;
            font-size: 13px;
            color: var(--press);
            font-weight: 500;
          }
          .itp-add-more:hover {
            background: #e9e9eb;
          }

          .itp-options {
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .itp-options-label {
            font-size: 13px;
            font-weight: 600;
          }
          .itp-options-group {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }
          .itp-option {
            background: white;
            border: 1px solid var(--line);
            border-radius: 999px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            color: var(--ink-soft);
            transition: all 0.2s;
          }
          .itp-option-active {
            background: var(--press);
            color: white;
            border-color: var(--press);
          }

          .itp-error {
            background: #fdecea;
            border: 1px solid #f2c4c0;
            color: #a83e34;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 16px;
          }

          .itp-convert-row {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          .itp-convert-btn {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            font-size: 15px;
            color: white;
            background: var(--press);
            border: none;
            padding: 13px 30px;
            border-radius: 999px;
            cursor: pointer;
            transition: transform 0.12s ease, background 0.2s ease;
            box-shadow: 0 4px 0 var(--press-deep);
          }
          .itp-convert-btn:not(:disabled):hover {
            transform: translateY(-1px);
          }
          .itp-convert-btn:not(:disabled):active {
            transform: translateY(2px);
            box-shadow: 0 2px 0 var(--press-deep);
          }
          .itp-convert-btn:disabled {
            background: #b7bcc7;
            box-shadow: none;
            cursor: not-allowed;
          }

          .itp-progress-card {
            padding: 16px;
          }
          .itp-progress-head {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            font-size: 13px;
          }
          .itp-printer-icon {
            font-size: 18px;
            animation: itp-bounce 0.9s ease-in-out infinite;
          }
          .itp-stage-text {
            flex: 1;
            color: var(--ink-soft);
          }
          .itp-progress-pct {
            font-weight: 600;
            color: var(--signal);
          }
          .itp-gauge {
            position: relative;
            height: 10px;
            border-radius: 999px;
            background: var(--paper-deep);
            overflow: hidden;
          }
          .itp-gauge-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--signal), #5856d6);
            border-radius: 999px;
            transition: width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .itp-gauge-ticks {
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.04) 0,
              rgba(0, 0, 0, 0.04) 1px,
              transparent 1px,
              transparent 10%
            );
            pointer-events: none;
          }

          .itp-privacy-note {
            text-align: center;
            font-size: 12.5px;
            color: var(--ink-soft);
            margin-top: 8px;
          }

          .itp-overlay {
            position: fixed;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(28, 30, 38, 0.55);
            backdrop-filter: blur(3px);
            padding: 16px;
          }
          .itp-done-card {
            max-width: 340px;
            width: 100%;
            padding: 34px 24px 24px;
            text-align: center;
            animation: itp-pop 0.3s ease-out;
          }
          .itp-stamp {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 3px solid var(--success);
            color: var(--success);
            border-radius: 10px;
            padding: 6px 18px;
            font-family: "Inter", sans-serif;
            font-weight: 700;
            font-size: 22px;
            letter-spacing: 0.08em;
            transform: rotate(-8deg);
            margin-bottom: 14px;
            animation: itp-stamp-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          .itp-done-card h2 {
            font-family: "Inter", sans-serif;
            font-size: 20px;
            margin: 0 0 6px;
          }
          .itp-done-card p {
            font-size: 13.5px;
            color: var(--ink-soft);
            margin: 0 0 20px;
          }
          .itp-done-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .itp-btn-primary,
          .itp-btn-secondary,
          .itp-btn-ghost {
            display: block;
            width: 100%;
            padding: 11px;
            border-radius: 10px;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            box-sizing: border-box;
          }
          .itp-btn-primary {
            background: var(--press);
            color: white;
          }
          .itp-btn-secondary {
            background: var(--paper-deep);
            color: var(--ink);
          }
          .itp-btn-ghost {
            background: transparent;
            color: var(--ink-soft);
          }

          @keyframes itp-bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          @keyframes itp-stamp-in {
            0% {
              transform: scale(2.4) rotate(-24deg);
              opacity: 0;
            }
            60% {
              transform: scale(0.94) rotate(-8deg);
              opacity: 1;
            }
            100% {
              transform: scale(1) rotate(-8deg);
              opacity: 1;
            }
          }
          @keyframes itp-pop {
            0% {
              opacity: 0;
              transform: scale(0.92);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .itp-printer-icon,
            .itp-stamp,
            .itp-done-card {
              animation: none !important;
            }
          }

          @media (max-width: 640px) {
            .itp-chip-row {
              grid-template-columns: repeat(2, 1fr);
            }
            .itp-nav-links a:first-child {
              display: none;
            }
            .itp-hero p {
              font-size: 14px;
            }
            .itp-options {
              flex-direction: column;
              align-items: flex-start;
            }
            .itp-options-group {
              width: 100%;
            }
            .itp-option {
              flex: 1;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </AuthGate>
  );
}
// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";

export default function TextToPdfPage() {
  const [title, setTitle] = useState("Official Document & Notes");
  const [author, setAuthor] = useState("ToolBox User");
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("helvetica");
  const [content, setContent] = useState(
    "Type or paste your formatted essay, article, college assignment, or meeting notes here.\n\nThis tool automatically calculates line wrapping and page pagination to output a crisp, high-resolution A4 PDF document directly inside your browser!"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - margin * 2;

      doc.setFont(fontFamily, "bold");
      doc.setFontSize(18);
      doc.text(title || "Untitled Document", margin, 25);

      doc.setFont(fontFamily, "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Author: ${author} | Generated on: ${new Date().toLocaleDateString()}`, margin, 32);

      doc.setDrawColor(220, 220, 220);
      doc.line(margin, 36, pageWidth - margin, 36);

      doc.setFont(fontFamily, "normal");
      doc.setFontSize(Number(fontSize));
      doc.setTextColor(20, 20, 20);

      const splitText = doc.splitTextToSize(content, maxLineWidth);
      let cursorY = 44;
      const lineHeight = Number(fontSize) * 0.45;

      for (let i = 0; i < splitText.length; i++) {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(splitText[i], margin, cursorY);
        cursorY += lineHeight;
      }

      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      doc.save(`${(title || "Document").replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            📄 Instant Clean Text to A4 PDF Engine
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            PDF Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Text to Clean PDF Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Convert plain text, notes, assignments, and agreements into beautiful formatted A4 PDF files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider">Document Settings</h3>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border rounded-xl p-2.5 font-bold outline-none"
              >
                <option value="helvetica">Helvetica (Modern Clean)</option>
                <option value="times">Times New Roman (Formal)</option>
                <option value="courier">Courier (Monospace Typewriter)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Font Size ({fontSize}pt)</span>
              </div>
              <input
                type="range"
                min="9"
                max="18"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[#0071e3]"
              />
            </div>

            <button
              type="button"
              onClick={generatePdf}
              disabled={isGenerating || !content.trim()}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/20 text-xs mt-2"
            >
              {isGenerating ? "Building PDF..." : "📥 Download A4 PDF"}
            </button>
          </div>

          <div className="md:col-span-8 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Document Text Content
            </h3>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write your text content here..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-serif leading-relaxed outline-none focus:ring-2 focus:ring-[#0071e3] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

export default function ResumeMakerPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    if (!form.fullName || !form.email || !form.title) {
      setError("Please fill at least Name, Email, and Title.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(0, 51, 102);
      doc.text(form.fullName, pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(form.title, pageWidth / 2, y, { align: "center" });
      y += 6;

      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`${form.email} | ${form.phone}`, pageWidth / 2, y, { align: "center" });
      y += 12;

      // Summary
      if (form.summary) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text("SUMMARY", margin, y);
        y += 4;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const summaryLines = doc.splitTextToSize(form.summary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 5;
      }

      // Skills
      if (form.skills) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text("SKILLS", margin, y);
        y += 4;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const skillsLines = doc.splitTextToSize(form.skills, pageWidth - 2 * margin);
        doc.text(skillsLines, margin, y);
        y += skillsLines.length * 5 + 5;
      }

      // Experience
      if (form.experience) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text("EXPERIENCE", margin, y);
        y += 4;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const expLines = doc.splitTextToSize(form.experience, pageWidth - 2 * margin);
        doc.text(expLines, margin, y);
        y += expLines.length * 5 + 5;
      }

      // Education
      if (form.education) {
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text("EDUCATION", margin, y);
        y += 4;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const eduLines = doc.splitTextToSize(form.education, pageWidth - 2 * margin);
        doc.text(eduLines, margin, y);
        y += eduLines.length * 5 + 5;
      }

      doc.save(`${form.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err: any) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">📝 Resume Maker</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create a professional resume and download as PDF. Free & private.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Professional Summary</label>
            <textarea name="summary" value={form.summary} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Brief summary about yourself..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <input type="text" name="skills" value={form.skills} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="JavaScript, React, Node.js, Python" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <textarea name="experience" value={form.experience} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Company - Role - Duration&#10;Description of responsibilities..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <textarea name="education" value={form.education} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Degree - Institution - Year&#10;Example: B.Tech CSE - IIT Delhi - 2023" />
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm">{error}</div>}

          <button onClick={generatePDF} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition">
            {isGenerating ? "Generating..." : "Generate & Download PDF"}
          </button>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Privacy:</strong> All data stays in your browser. Nothing is uploaded.
        </div>
      </div>
    </div>
  );
}
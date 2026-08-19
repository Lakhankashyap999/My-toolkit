"use client";
import Link from "next/link";

const pdfTools = [
  { id: 1, name: "Merge PDF", icon: "📑", desc: "Combine multiple PDFs into one file.", path: "/pdf-tools/merge", available: true, badge: "Free" },
  { id: 2, name: "Split PDF", icon: "✂️", desc: "Extract specific pages from a PDF.", path: "/pdf-tools/split", available: true, badge: "Free" },
  { id: 3, name: "Compress PDF", icon: "🗜️", desc: "Reduce PDF file size.", path: "/pdf-tools/compress", available: true, badge: "Free" },
  { id: 4, name: "Image to PDF", icon: "🖼️", desc: "Convert images to PDF.", path: "/pdf-tools/image-to-pdf", available: true, badge: "Free" },
  { id: 5, name: "Edit PDF", icon: "✏️", desc: "Add text, watermark, delete or rotate pages.", path: "/pdf-tools/edit", available: true, badge: "Free" }
];

export default function PdfToolsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">📄 PDF Tools</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Choose a tool to manage your PDF files easily. No signup required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pdfTools.map((tool) => (
            <div key={tool.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1">
              <div className="text-5xl mb-4">{tool.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full font-medium">{tool.badge}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{tool.desc}</p>
              <Link href={tool.path} className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-semibold transition">
                Use Tool →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
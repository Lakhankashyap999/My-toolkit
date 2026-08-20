// @ts-nocheck
"use client";
import Link from "next/link";

const pdfTools = [
  {
    id: 1,
    name: "Merge PDF",
    icon: "📑",
    desc: "Combine multiple PDFs into one file.",
    path: "/pdf-tools/merge",
    badge: "Free",
    gradient: "from-rose-400 to-orange-400",
    glow: "rgba(251,146,60,0.35)",
  },
  {
    id: 2,
    name: "Split PDF",
    icon: "✂️",
    desc: "Extract specific pages from a PDF.",
    path: "/pdf-tools/split",
    badge: "Free",
    gradient: "from-blue-400 to-indigo-400",
    glow: "rgba(99,102,241,0.35)",
  },
  {
    id: 3,
    name: "Compress PDF",
    icon: "🗜️",
    desc: "Reduce PDF file size.",
    path: "/pdf-tools/compress",
    badge: "Free",
    gradient: "from-emerald-400 to-teal-400",
    glow: "rgba(45,212,191,0.35)",
  },
  {
    id: 4,
    name: "Image to PDF",
    icon: "🖼️",
    desc: "Convert images to PDF.",
    path: "/pdf-tools/image-to-pdf",
    badge: "Free",
    gradient: "from-purple-400 to-pink-400",
    glow: "rgba(217,70,239,0.35)",
  },
  {
    id: 5,
    name: "Edit PDF",
    icon: "✏️",
    desc: "Add text, watermark, delete or rotate pages.",
    path: "/pdf-tools/edit",
    badge: "Pro",
    gradient: "from-yellow-400 to-amber-400",
    glow: "rgba(245,158,11,0.35)",
  },
];

export default function PdfToolsDashboard() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbfd]/75 dark:bg-[#040404]/75 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span className="text-[17px] font-semibold tracking-tight">ToolBox</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-[#6e6e73] hover:text-[#0071e3] dark:hover:text-white transition-colors">
                ← Back to Home
              </a>
              <a href="/account" className="w-9 h-9 rounded-full bg-[#f5f5f7] dark:bg-white/10 flex items-center justify-center text-lg">
                👤
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">📄 PDF Tools</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Choose a tool to manage your PDF files easily. Free, fast, and private.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {pdfTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white dark:bg-[#111113] rounded-3xl border border-black/5 dark:border-white/10 p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-5`}
                style={{ boxShadow: `0 10px 24px -6px ${tool.glow}` }}
              >
                {tool.icon}
              </div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-lg font-bold tracking-tight">{tool.name}</h3>
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                    tool.badge === "Pro"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                  }`}
                >
                  {tool.badge}
                </span>
              </div>
              <p className="text-[#6e6e73] dark:text-white/60 text-sm mb-5 flex-grow leading-relaxed">
                {tool.desc}
              </p>
              <Link
                href={tool.path}
                className="inline-block bg-[#0071e3] hover:bg-[#0077ED] text-white text-center py-2.5 rounded-xl font-semibold transition-colors"
              >
                Use Tool →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
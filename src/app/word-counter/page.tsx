// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMin: 0,
        speakingTimeMin: 0,
        topWords: [],
      };
    }

    const wordsArr = trimmed.split(/\s+/).filter(Boolean);
    const words = wordsArr.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    const readingTimeMin = (words / 200).toFixed(1);
    const speakingTimeMin = (words / 130).toFixed(1);

    const frequency: { [k: string]: number } = {};
    wordsArr.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      if (clean.length > 2) {
        frequency[clean] = (frequency[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: Math.round((count / words) * 100),
      }));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMin,
      speakingTimeMin,
      topWords,
    };
  }, [text]);

  const transformCase = (type: string) => {
    if (!text) return;
    if (type === "upper") setText(text.toUpperCase());
    if (type === "lower") setText(text.toLowerCase());
    if (type === "title") {
      setText(
        text
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      );
    }
    if (type === "sentence") {
      setText(
        text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      );
    }
    if (type === "snake") {
      setText(
        text
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "")
      );
    }
    if (type === "camel") {
      setText(
        text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      );
    }
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            🔤 Live Character &amp; Word Counter
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Content Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Real-Time Word &amp; Character Counter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Count words, characters, sentences, check reading time, keyword density, and transform text case in 1-click.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-[#0c1017] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#0071e3]">{stats.words}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Words</div>
          </div>
          <div className="bg-white dark:bg-[#0c1017] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.charsWithSpaces}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Characters</div>
          </div>
          <div className="bg-white dark:bg-[#0c1017] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-500">{stats.sentences}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Sentences</div>
          </div>
          <div className="bg-white dark:bg-[#0c1017] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{stats.paragraphs}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Paragraphs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your content here to start live counting..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-[#0071e3] resize-none"
            />

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Text Transformations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => transformCase("upper")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  UPPERCASE
                </button>
                <button
                  type="button"
                  onClick={() => transformCase("lower")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  lowercase
                </button>
                <button
                  type="button"
                  onClick={() => transformCase("title")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  Title Case
                </button>
                <button
                  type="button"
                  onClick={() => transformCase("sentence")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  Sentence case
                </button>
                <button
                  type="button"
                  onClick={() => transformCase("snake")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  snake_case
                </button>
                <button
                  type="button"
                  onClick={() => transformCase("camel")}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                >
                  camelCase
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setText("")}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Clear Text
              </button>
              <button
                type="button"
                onClick={copyText}
                className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition shadow-md shadow-blue-500/20"
              >
                {copied ? "✓ Copied!" : "📋 Copy Text"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reading Estimation
              </h3>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>📖 Reading Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">~{stats.readingTimeMin} mins</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>🗣️ Speaking Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">~{stats.speakingTimeMin} mins</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-600 dark:text-slate-400">
                <span>No-Space Characters:</span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.charsNoSpaces}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c1017] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Top Keywords (Density)
              </h3>
              {stats.topWords.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {stats.topWords.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {item.word}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.count}x ({item.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 py-2">
                  Type at least a few sentences to see keyword frequency.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
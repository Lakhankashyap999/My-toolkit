// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

const CARDS = [
  {
    id: "dev-suite",
    title: "IT & Developer Daily Suite",
    desc: "14 Power Tools: .env Diff, JWT, SVG to JSX, Indian Mock Data & Git PR",
    image: "/showcase/card-dev.jpg",
    path: "/office-dev-suite",
    badge: "14-in-1 Suite",
  },
  {
    id: "pdf-tools",
    title: "All-in-One PDF Suite",
    desc: "Merge, Split, Compress & PDF to Word with 100% In-Browser Privacy",
    image: "/showcase/card-pdf.jpg",
    path: "/pdf-tools",
    badge: "0.2s Engine",
  },
  {
    id: "resume-maker",
    title: "ATS Resume Builder",
    desc: "5 Clean ATS-Compliant Themes with Instant Formatted PDF Export",
    image: "/showcase/card-resume.jpg",
    path: "/resume-maker",
    badge: "99% ATS Pass",
  },
  {
    id: "tax-suite",
    title: "CA & Tax Master Suite",
    desc: "Budget 2024 Tax Slabs, GST Invoicing & Client Master Database",
    image: "/showcase/card-tax.jpg",
    path: "/tax-suite",
    badge: "Pro Pass",
  },
  {
    id: "legal-suite",
    title: "Advocate & Legal Master Suite",
    desc: "IPC to BNS 2024 Section Converter, Supreme Court Rulings & Notices",
    image: "/showcase/card-legal.jpg",
    path: "/legal-suite",
    badge: "BNS 2024 Ready",
  },
];

export default function AppleStoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 370;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-Style Single-Line Continuous Heading with Desktop Navigation Controls */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-[19px] sm:text-[26px] tracking-tight leading-snug">
            <span className="font-bold text-[#1d1d1f] dark:text-white">
              Real tools. Instant results.{" "}
            </span>
            <span className="text-[#86868b] dark:text-[#86868b] font-normal">
              Built for India&apos;s fastest teams.
            </span>
          </h2>

          {/* Desktop Chevron Navigation Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous card"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-[#e8e8ed] dark:bg-white/15 text-[#1d1d1f] dark:text-white hover:bg-[#d8d8dd] active:scale-95"
                  : "bg-black/[0.04] dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next card"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-[#e8e8ed] dark:bg-white/15 text-[#1d1d1f] dark:text-white hover:bg-[#d8d8dd] active:scale-95"
                  : "bg-black/[0.04] dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Card Slider with Native Touch Snap & Desktop Scrolling */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.path}
              className="group relative shrink-0 w-[84vw] sm:w-[320px] md:w-[350px] lg:w-[370px] aspect-[3/4] rounded-[28px] sm:rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-2xl transition-all duration-300 snap-center active:scale-[0.99] flex flex-col justify-end bg-black"
            >
              {/* High-Resolution Poster Card Image with Zoom on Hover */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Bottom Subtle Gradient for Tap Feedback & Button Protection */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating Bottom Launch Button (Apple Style) */}
              <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[11px] font-bold text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {card.badge}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors">
                    Explore Suite
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 mt-2">
          <span>Swipe to explore all tools</span>
          <span>→</span>
        </div>

      </div>
    </section>
  );
}

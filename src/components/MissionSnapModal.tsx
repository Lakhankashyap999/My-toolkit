'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Sparkles, X, ArrowRight, ShieldCheck, Mic, HelpCircle, Compass } from 'lucide-react';

interface MissionSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  delay: number;
}

export default function MissionSnapModal({
  isOpen,
  onClose,
  onProceed,
}: MissionSnapModalProps) {
  const [isSnapping, setIsSnapping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSnapping(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Thanos Particle Disintegration Engine
  const triggerThanosSnap = useCallback(() => {
    if (!cardRef.current || !canvasRef.current) {
      if (onProceed) onProceed();
      onClose();
      return;
    }

    setIsSnapping(true);

    const card = cardRef.current;
    const canvas = canvasRef.current;
    const rect = card.getBoundingClientRect();

    // Set canvas dimensions over modal area
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (onProceed) onProceed();
      onClose();
      return;
    }

    // Generate dust/ash particle spectrum
    const colors = [
      '#e11d48', // rose-600
      '#fb7185', // rose-400
      '#f59e0b', // amber-500
      '#fbbf24', // amber-400
      '#64748b', // slate-500 ash
      '#94a3b8', // slate-400 ash
      '#cbd5e1', // slate-300 dust
      '#ffffff', // ember highlight
      '#475569', // dark ash
    ];

    const particleCount = 550;
    const particles: Particle[] = [];

    // Create particles across the card rectangle
    for (let i = 0; i < particleCount; i++) {
      const relX = Math.random() * rect.width;
      const relY = Math.random() * rect.height;
      const x = rect.left + relX;
      const y = rect.top + relY;

      // Thanos snap wave: dissolves from left-to-right & bottom-to-top
      const normalizedProgress = (relX / rect.width) * 0.4 + (1 - relY / rect.height) * 0.3;
      const delay = normalizedProgress * 400 + Math.random() * 200;

      particles.push({
        x,
        y,
        vx: Math.random() * 3.5 + 1.2, // drifting rightward (wind effect)
        vy: -(Math.random() * 3.2 + 0.8), // drifting upward (ash lifting into air)
        size: Math.random() * 3.2 + 1.2,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay,
      });
    }

    const startTime = performance.now();
    const duration = 1400; // 1.4s total snap time

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (elapsed > p.delay) {
          p.x += p.vx + (Math.random() - 0.5) * 0.6;
          p.y += p.vy + (Math.random() - 0.5) * 0.4;
          p.alpha -= p.decay;

          if (p.alpha > 0) {
            activeCount++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        } else {
          activeCount++;
        }
      }

      if (elapsed < duration && activeCount > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsSnapping(false);
        try {
          localStorage.setItem('deutschready_mission_seen', 'true');
        } catch {}
        if (onProceed) onProceed();
        onClose();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [onClose, onProceed]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-md transition-opacity duration-300">
      {/* Canvas Layer for Thanos Disintegration Particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[130] h-full w-full"
      />

      {/* Modal Container */}
      <div
        ref={cardRef}
        style={{
          transition: isSnapping
            ? 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'transform 0.3s ease, opacity 0.3s ease',
          opacity: isSnapping ? 0 : 1,
          filter: isSnapping ? 'blur(8px) brightness(1.2)' : 'none',
          transform: isSnapping
            ? 'scale(0.96) translate(24px, -16px) skewX(2deg)'
            : 'scale(1) translate(0, 0)',
        }}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-rose-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-rose-900/60 dark:bg-neutral-900"
      >
        {/* Close Button */}
        {!isSnapping && (
          <button
            onClick={triggerThanosSnap}
            className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Top Heart Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 dark:border-rose-900/80 dark:bg-rose-950/60 dark:text-rose-300 mb-4">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          <span>Our Heartfelt Mission for Every Student</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
          High-Quality German Learning Should{' '}
          <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
            Never Be Blocked by Money.
          </span>
        </h2>

        {/* The Core Problem & Empathy */}
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
          Traditional German coaching institutes routinely charge between{' '}
          <strong className="text-rose-600 dark:text-rose-400 font-bold">
            ₹60,000 to ₹1,20,000+
          </strong>
          . For thousands of ambitious students, nursing candidates, and workers aspiring to build a life in Germany, this financial burden is simply out of reach.
        </p>

        {/* Helping Purpose */}
        <div className="mt-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 dark:bg-amber-950/30 dark:border-amber-900/50">
          <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
            🤝 We built <strong>DeutschReady</strong> as an act of service — so that anyone with dedication can master German with 100% confidence, completely accessible, without paying a single rupee.
          </p>
        </div>

        {/* Highlights: What They Get */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3 text-xs dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <Mic className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-neutral-900 dark:text-white">
                Voice Recording &amp; Accuracy Evaluation:
              </strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-300">
                Record your voice, compare against native German sounds, test your accuracy, and see exactly where to improve.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3 text-xs dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <HelpCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-neutral-900 dark:text-white">
                10-Level AI Doubt Ladder:
              </strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-300">
                Never get stuck. Explanations step-down into simple analogies with Hindi grammar links (कारक / लिंग).
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3 text-xs dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <Compass className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-neutral-900 dark:text-white">
                A0 to B2 Life Simulators:
              </strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-300">
                Bürgeramt registration, doctor appointments, train delays, and supermarket Pfand dialogues — fully prepared before you fly.
              </span>
            </div>
          </div>
        </div>

        {/* Inspiring Closing Line */}
        <p className="mt-5 text-xs text-neutral-500 dark:text-neutral-400 italic text-center">
          &ldquo;Your future belongs to your effort, not your bank balance. Practice daily with pride.&rdquo;
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={triggerThanosSnap}
            disabled={isSnapping}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 py-4 text-sm font-bold text-white shadow-xl hover:from-rose-700 hover:to-indigo-700 active:scale-98 transition-all min-h-[52px] cursor-pointer"
          >
            {isSnapping ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Dissolving &amp; Launching...</span>
              </span>
            ) : (
              <>
                <span>I&apos;m Ready to Learn — Let&apos;s Begin</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-2 text-[10px] text-neutral-400 text-center">
            Clicking will dissolve this note and take you straight into your German workstation ✨
          </p>
        </div>
      </div>
    </div>
  );
}

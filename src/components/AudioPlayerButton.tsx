'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, Snail } from 'lucide-react';
import { speakGerman, stopSpeaking } from '@/lib/speechUtils';
import { useUserProgress } from '@/lib/progressStore';

interface AudioPlayerButtonProps {
  text: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioPlayerButton({
  text,
  className = '',
  showText = false,
  size = 'md',
}: AudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);
  const { progress } = useUserProgress();
  const playingRef = useRef(false);

  const handlePlay = useCallback(
    async (e: React.MouseEvent, forceSlow?: boolean) => {
      e.stopPropagation();
      e.preventDefault();
      if (playingRef.current) {
        stopSpeaking();
        playingRef.current = false;
        setIsPlaying(false);
        setIsSlowPlaying(false);
        return;
      }
      const slow = forceSlow !== undefined ? forceSlow : progress.audioSlowMode;
      playingRef.current = true;
      if (forceSlow) {
        setIsSlowPlaying(true);
      } else {
        setIsPlaying(true);
      }
      try {
        await speakGerman(text, slow);
      } finally {
        playingRef.current = false;
        setIsPlaying(false);
        setIsSlowPlaying(false);
      }
    },
    [text, progress.audioSlowMode]
  );

  const iconSizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const btnPad = { sm: 'p-2', md: 'p-2.5', lg: 'p-3' };
  const minSize = 'min-w-[44px] min-h-[44px]';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Normal Speed Button */}
      <button
        onClick={(e) => handlePlay(e, false)}
        title={isPlaying ? 'Stop Audio' : `Listen: ${text}`}
        aria-label={isPlaying ? 'Stop' : `Play German audio for: ${text}`}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-300 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 ${btnPad[size]} ${minSize}`}
      >
        <Volume2
          className={`${iconSizes[size]} ${
            isPlaying
              ? 'text-rose-600 dark:text-rose-400 animate-pulse'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        />
        {showText && (
          <span className="text-xs font-semibold">{isPlaying ? 'Stop' : 'Hören'}</span>
        )}
      </button>

      {/* Slow Mode 0.75x Turtle Button */}
      <button
        onClick={(e) => handlePlay(e, true)}
        title={isSlowPlaying ? 'Stop Slow Audio' : 'Play Slow German (0.75x) — Turtle Mode'}
        aria-label={`Play slow German audio for: ${text}`}
        className={`inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800 transition-all hover:bg-amber-100 active:scale-95 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300 ${btnPad[size]} ${minSize}`}
      >
        <Snail
          className={`${iconSizes[size]} ${
            isSlowPlaying ? 'text-amber-600 animate-bounce' : 'text-amber-600 dark:text-amber-400'
          }`}
        />
      </button>
    </div>
  );
}

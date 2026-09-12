'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Snail } from 'lucide-react';
import { speakGerman } from '@/lib/speechUtils';
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
  size = 'md'
}: AudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { progress } = useUserProgress();

  const handlePlay = async (e: React.MouseEvent, forceSlow?: boolean) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    const slow = forceSlow !== undefined ? forceSlow : progress.audioSlowMode;
    await speakGerman(text, slow);
    setIsPlaying(false);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        onClick={(e) => handlePlay(e, false)}
        disabled={isPlaying}
        title="Play Native German Audio"
        aria-label={`Listen to ${text}`}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-300 active:scale-95 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 ${sizeClasses[size]}`}
      >
        <Volume2 className={`${iconSizes[size]} ${isPlaying ? 'text-rose-600 animate-pulse' : 'text-neutral-600 dark:text-neutral-400'}`} />
        {showText && <span className="font-medium">Hören</span>}
      </button>

      {/* Instant 0.75x Turtle Slow Button */}
      <button
        onClick={(e) => handlePlay(e, true)}
        disabled={isPlaying}
        title="Play Slow German (0.75x) for Clear Syllables"
        aria-label={`Listen slowly to ${text}`}
        className={`inline-flex items-center justify-center rounded-full border border-amber-200/80 bg-amber-50/80 text-amber-800 transition-all hover:bg-amber-100 active:scale-95 disabled:opacity-50 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 ${sizeClasses[size]}`}
      >
        <Snail className={iconSizes[size]} />
      </button>
    </div>
  );
}

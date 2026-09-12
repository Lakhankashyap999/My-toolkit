'use client';

/**
 * iOS-Safe German Speech Engine
 * Handles voice loading, iOS unlock, and slow-mode correctly
 */

let voicesLoaded = false;
let germanVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.addEventListener('voiceschanged', function handler() {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(window.speechSynthesis.getVoices());
    });
    // iOS fallback: resolve after 1.5s even if voiceschanged never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
}

async function getGermanVoice(): Promise<SpeechSynthesisVoice | null> {
  if (germanVoice && voicesLoaded) return germanVoice;
  const voices = await loadVoices();
  voicesLoaded = true;
  // Priority: de-DE > de > German named voice
  germanVoice =
    voices.find((v) => v.lang === 'de-DE' && v.localService) ||
    voices.find((v) => v.lang === 'de-DE') ||
    voices.find((v) => v.lang.startsWith('de')) ||
    voices.find((v) => v.name.toLowerCase().includes('german')) ||
    voices.find((v) => v.name.toLowerCase().includes('deutsch')) ||
    null;
  return germanVoice;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export async function speakGerman(text: string, isSlow: boolean = false): Promise<void> {
  return new Promise(async (resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 80)); // Small delay for cancel to flush

    const voice = await getGermanVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    utterance.lang = 'de-DE';
    // iOS Safari: rate 0.1-2.0 (but real useful range is 0.5-1.5)
    utterance.rate = isSlow ? 0.7 : 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (voice) {
      utterance.voice = voice;
    }

    const cleanup = () => {
      currentUtterance = null;
      resolve();
    };

    utterance.onend = cleanup;
    utterance.onerror = cleanup;

    // iOS Safari workaround: speechSynthesis pauses in background tabs
    // Resume it before speaking
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);

    // Safety timeout: resolve after max 30 seconds to prevent hanging
    setTimeout(cleanup, 30000);
  });
}

export function comparePronunciation(
  spoken: string,
  target: string
): {
  accuracy: number;
  isMatch: boolean;
  feedbackHindi: string;
  feedbackEnglish: string;
} {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .trim();

  const cleanSpoken = clean(spoken);
  const cleanTarget = clean(target);

  if (cleanSpoken === cleanTarget) {
    return {
      accuracy: 100,
      isMatch: true,
      feedbackHindi: '🎉 Perfekt! Bilkul sahi utparan (Exact match)!',
      feedbackEnglish: 'Perfect pronunciation match!',
    };
  }

  const targetWords = cleanTarget.split(/\s+/);
  const spokenWords = cleanSpoken.split(/\s+/);
  let matches = 0;

  for (const tw of targetWords) {
    if (spokenWords.some((sw) => sw.includes(tw) || tw.includes(sw))) {
      matches++;
    }
  }

  const accuracy = Math.min(100, Math.round((matches / targetWords.length) * 100));
  const isMatch = accuracy >= 65;

  let feedbackHindi = '';
  let feedbackEnglish = '';

  if (accuracy >= 85) {
    feedbackHindi = '✅ Bahut accha! Almost native accent. Thodi practice aur karein.';
    feedbackEnglish = 'Excellent! Near-native German pronunciation.';
  } else if (accuracy >= 65) {
    feedbackHindi = '👍 Kaafi accha! Umlauts (ä, ö, ü) aur SCH sound par focus karein. 0.75x slow audio suno.';
    feedbackEnglish = 'Good attempt! Focus on German umlauts and special sounds.';
  } else {
    feedbackHindi = '🐢 Turtle audio suno aur ek-ek syllable ke saath repeat karo. Koi pressure nahi!';
    feedbackEnglish = 'Keep practicing! Use turtle audio to hear each syllable clearly.';
  }

  return { accuracy, isMatch, feedbackHindi, feedbackEnglish };
}

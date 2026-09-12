/**
 * Web Speech API utilities for native German pronunciation and Speech-to-Text evaluation
 */

export function speakGerman(text: string, isSlow: boolean = false): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = isSlow ? 0.65 : 0.88; // slower rate for beginners
    utterance.pitch = 1.0;

    // Try to find a native German voice
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(v => v.lang.startsWith('de') || v.name.includes('German') || v.name.includes('Deutsch'));
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function comparePronunciation(spoken: string, target: string): {
  accuracy: number;
  isMatch: boolean;
  feedbackText: string;
} {
  const cleanSpoken = spoken.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
  const cleanTarget = target.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();

  if (cleanSpoken === cleanTarget) {
    return {
      accuracy: 100,
      isMatch: true,
      feedbackText: 'Perfekt! Ausgezeichnete Aussprache! (Exact match)'
    };
  }

  // Simple Levenshtein distance similarity
  const maxLen = Math.max(cleanSpoken.length, cleanTarget.length);
  if (maxLen === 0) return { accuracy: 100, isMatch: true, feedbackText: 'Sehr gut!' };

  let matches = 0;
  const targetWords = cleanTarget.split(' ');
  const spokenWords = cleanSpoken.split(' ');

  for (const word of targetWords) {
    if (spokenWords.includes(word)) {
      matches++;
    }
  }

  const wordAccuracy = Math.round((matches / targetWords.length) * 100);
  const isMatch = wordAccuracy >= 70;

  let feedback = 'Schon gut! Thoda sa aur saaf bolo (Try slower with 0.75x audio)';
  if (wordAccuracy >= 85) {
    feedback = 'Sehr gut! Almost native accent!';
  } else if (wordAccuracy < 50) {
    feedback = 'Umlauts ya German sounds par dhyan do. Turtle audio suno aur repeat karo.';
  }

  return {
    accuracy: wordAccuracy,
    isMatch,
    feedbackText: feedback
  };
}

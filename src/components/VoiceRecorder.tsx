'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { comparePronunciation } from '@/lib/speechUtils';

interface VoiceRecorderProps {
  targetPhrase: string;
  onSuccess?: (spoken: string) => void;
  className?: string;
}

export default function VoiceRecorder({
  targetPhrase,
  onSuccess,
  className = '',
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<{
    accuracy: number;
    isMatch: boolean;
    feedbackHindi: string;
    feedbackEnglish: string;
  } | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<unknown>(null);

  const checkSupport = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    return !!SR;
  }, []);

  const startListening = useCallback(() => {
    const supported = checkSupport();
    if (!supported) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    const recognition = new (SR as new () => {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: () => void;
      onresult: (e: unknown) => void;
      onerror: (e: unknown) => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    })();

    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setResult(null);
    };

    recognition.onresult = (event: unknown) => {
      const e = event as {
        results: { [key: number]: { [key: number]: { transcript: string } } };
      };
      // Try best of up to 3 alternatives
      const spoken = e.results[0][0].transcript;
      setTranscript(spoken);
      const evalResult = comparePronunciation(spoken, targetPhrase);
      setResult(evalResult);
      if (evalResult.isMatch && onSuccess) {
        onSuccess(spoken);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [checkSupport, targetPhrase, onSuccess]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      (recognitionRef.current as { stop: () => void }).stop();
    }
    setIsRecording(false);
  }, []);

  const reset = () => {
    setResult(null);
    setTranscript('');
  };

  if (isSupported === false) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
          Microphone unavailable on this browser
        </p>
        <p className="text-xs">
          🎙️ Speaking Lab works best on <strong>Chrome</strong> or <strong>Edge</strong> on desktop/Android.
          iOS Safari may require unlocking microphone in Settings → Safari → Microphone.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 w-full ${className}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={isRecording ? stopListening : startListening}
          className={`flex items-center justify-center gap-2 rounded-full px-6 py-4 font-bold text-white shadow-lg transition-all active:scale-95 min-w-[200px] min-h-[56px] ${
            isRecording
              ? 'bg-rose-600 ring-4 ring-rose-500/30'
              : 'bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 shadow-rose-500/20'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-5 w-5" />
              <span>Sunna Band Karo</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>German Mein Bolo</span>
            </>
          )}
        </button>

        {result && (
          <button
            onClick={reset}
            title="Reset"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-neutral-200 p-2.5 text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-semibold animate-pulse">
          <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping inline-block" />
          Sunna chal raha hai... (Sprechen Sie jetzt!)
        </div>
      )}

      {transcript && (
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span className="font-semibold">Humne suna:</span>
            {result?.isMatch ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {result.accuracy}% Match!
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                {result?.accuracy}% — Keep Going!
              </span>
            )}
          </div>
          <p className="text-base font-bold text-neutral-800 dark:text-neutral-100">
            &ldquo;{transcript}&rdquo;
          </p>
          {result && (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {result.feedbackHindi}
              </p>
              {/* Accuracy Bar */}
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden dark:bg-neutral-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.accuracy >= 85
                      ? 'bg-emerald-500'
                      : result.accuracy >= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.accuracy}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

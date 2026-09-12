'use client';

import { useState, useRef } from 'react';
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
  className = ''
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<{
    accuracy: number;
    isMatch: boolean;
    feedbackText: string;
  } | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        setResult(null);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        const evalResult = comparePronunciation(spoken, targetPhrase);
        setResult(evalResult);
        if (evalResult.isMatch && onSuccess) {
          onSuccess(spoken);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        💡 Micro-speaking requires Chrome, Edge, or Safari with microphone permission enabled.
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={isRecording ? stopListening : startListening}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-lg transition-all active:scale-95 ${
            isRecording
              ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/20'
              : 'bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 shadow-rose-500/20'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-5 w-5" />
              <span>Listening... (Sprechen Sie!)</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>Tap to Speak German</span>
            </>
          )}
        </button>

        {result && (
          <button
            onClick={() => {
              setResult(null);
              setTranscript('');
            }}
            title="Reset"
            className="rounded-full border border-neutral-200 p-2.5 text-neutral-500 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Transcript & Feedback Card */}
      {transcript && (
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>We heard:</span>
            {result?.isMatch ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Matched!
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <AlertCircle className="h-3.5 w-3.5" /> Keep practicing
              </span>
            )}
          </div>
          <p className="mt-1 text-base font-semibold text-neutral-800 dark:text-neutral-100">
            &ldquo;{transcript}&rdquo;
          </p>
          {result && (
            <p className="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {result.feedbackText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

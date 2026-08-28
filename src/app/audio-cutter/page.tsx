// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function AudioCutterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [isTrimming, setIsTrimming] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setAudioUrl(url);
      setOutputUrl(null);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = Math.round(audioRef.current.duration);
      setDuration(d);
      setStartTime(0);
      setEndTime(Math.min(30, d));
    }
  };

  const trimAudio = async () => {
    if (!file) return;
    setIsTrimming(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const sampleRate = audioBuffer.sampleRate;
      const startOffset = Math.floor(startTime * sampleRate);
      const endOffset = Math.floor(endTime * sampleRate);
      const frameCount = endOffset - startOffset;

      const trimmedBuffer = audioCtx.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const srcData = audioBuffer.getChannelData(ch);
        const destData = trimmedBuffer.getChannelData(ch);
        for (let i = 0; i < frameCount; i++) {
          destData[i] = srcData[startOffset + i];
        }
      }

      // Convert AudioBuffer to WAV Blob
      const wavBlob = bufferToWave(trimmedBuffer, frameCount);
      setOutputUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      alert("Error trimming audio. Please try another audio/video file.");
    } finally {
      setIsTrimming(false);
    }
  };

  // Helper: AudioBuffer to WAV
  function bufferToWave(abuffer: AudioBuffer, len: number) {
    let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [],
      i,
      sample,
      offset = 0,
      pos = 0;

    function setUint16(data: any) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data: any) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4);

    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#040404] text-[#1d1d1f] dark:text-white pb-16 antialiased">
      <nav className="border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#0071e3]">
            ← Back to ToolBox
          </Link>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ⚡ In-Browser Audio Cutter
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-[#0071e3] px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Media Utility
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Audio &amp; Ringtone Cutter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Kisi bhi gaane ya video se audio cut karke WhatsApp status ya Ringtone banayein!
          </p>
        </div>

        <div className="bg-white dark:bg-[#0c1017] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0071e3] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-4xl mb-2">🎵</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {file ? file.name : "Select Audio / Video File"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Supports MP3, WAV, AAC, MP4</span>
            <input type="file" accept="audio/*,video/*" onChange={handleFile} className="hidden" />
          </label>

          {audioUrl && (
            <div className="space-y-4">
              <audio ref={audioRef} src={audioUrl} onLoadedMetadata={handleLoadedMetadata} controls className="w-full rounded-xl" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Start Time (Seconds)</label>
                  <input
                    type="number"
                    min={0}
                    max={duration}
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">End Time (Seconds)</label>
                  <input
                    type="number"
                    min={startTime}
                    max={duration}
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <button
                onClick={trimAudio}
                disabled={isTrimming}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
              >
                {isTrimming ? "Cutting Audio..." : "✂️ Cut &amp; Export Audio"}
              </button>
            </div>
          )}

          {outputUrl && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ Trimmed Audio Ready!</div>
              <audio src={outputUrl} controls className="w-full" />
              <a
                href={outputUrl}
                download="Ringtone_Clipped.wav"
                className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                📥 Download Ringtone File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Mail, KeyRound, CheckCircle2, AlertCircle, X, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useUserProgress } from '@/lib/progressStore';

interface DeutschAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeutschAuthModal({ isOpen, onClose }: DeutschAuthModalProps) {
  const { setUserEmail, progress } = useUserProgress();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Kripya ek valid email address enter karein.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep('code');
        setSuccess(`Verification code ${cleanEmail} par bhej diya gaya hai!`);
      } else {
        setError(data.error || 'Code bhejne mein samasya aayi. Kripya punah prayas karein.');
      }
    } catch {
      setError('Network samasya. Kripya apna connection check karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) {
      setError('Kripya 6-digit code enter karein.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Save to Toolbox local storage
        localStorage.setItem('toolbox_email', cleanEmail);
        localStorage.setItem('toolbox_login_time', String(Date.now()));
        setUserEmail(cleanEmail);
        setSuccess('Account verify ho gaya! Aapki saari German progress ab safe hai.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.error || 'Code galat hai ya expire ho chuka hai.');
      }
    } catch {
      setError('Verification mein samasya aayi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            Toolbox Account Sync
          </h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Apni email se verify karein taaki browser band hone par bhi saari activity aur lessons resume ho sakein.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full rounded-2xl border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-neutral-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white hover:bg-rose-700 active:scale-98 disabled:opacity-50 min-h-[48px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Code Bhej Rahe Hain...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Verification Code Prapt Karein</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full rounded-2xl border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm font-mono tracking-widest text-neutral-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white text-center text-lg font-bold"
                />
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                Code <strong className="text-neutral-600 dark:text-neutral-300">{email}</strong> par bheja gaya hai.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white hover:bg-rose-700 active:scale-98 disabled:opacity-50 min-h-[48px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verify Ho Raha Hai...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Account Confirm Karein</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); }}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
            >
              ← Email Change Karein
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-neutral-100 pt-4 text-center text-[11px] text-neutral-400 dark:border-neutral-800">
          🔒 Password ki zarurat nahi hai. Ek baar verify hone par aapka device safe rahega.
        </div>
      </div>
    </div>
  );
}

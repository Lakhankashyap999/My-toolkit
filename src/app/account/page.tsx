// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [remaining, setRemaining] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const countdownIntervalRef = useRef<any>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    if (storedEmail) {
      const cleanStored = storedEmail.trim().toLowerCase();
      setVerifiedEmail(cleanStored);
      fetchSubscription(cleanStored);
    } else {
      setLoading(false);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const fetchSubscription = async (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Fetch live status from server
      const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      
      if (data.active && data.subscription) {
        setSubscription(data.subscription);
        const expDate = data.subscription.expiry_date || data.subscription.expiry || data.subscription.expires_at;
        if (expDate) {
          startCountdown(expDate);
          localStorage.setItem(
            "toolbox_pro",
            JSON.stringify({
              token: "pro_active",
              active: true,
              expiry: new Date(expDate).getTime(),
            })
          );
        }
      } else {
        const localProData = localStorage.getItem("toolbox_pro");
        if (localProData) {
          try {
            const parsed = JSON.parse(localProData);
            if (parsed.active && parsed.expiry > Date.now()) {
              const expIso = new Date(parsed.expiry).toISOString();
              setSubscription({
                email: cleanEmail,
                expiry_date: expIso,
              });
              startCountdown(expIso);
            } else {
              setSubscription(null);
            }
          } catch {
            setSubscription(null);
          }
        } else {
          setSubscription(null);
        }
      }
    } catch {
      const localProData = localStorage.getItem("toolbox_pro");
      if (localProData) {
        try {
          const parsed = JSON.parse(localProData);
          if (parsed.active && parsed.expiry > Date.now()) {
            const expIso = new Date(parsed.expiry).toISOString();
            setSubscription({
              email: cleanEmail,
              expiry_date: expIso,
            });
            startCountdown(expIso);
          }
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = (expiryDate: string) => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    const updateTimer = () => {
      const now = Date.now();
      const expiry = new Date(expiryDate).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setRemaining("Expired");
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setRemaining(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    };

    updateTimer();
    countdownIntervalRef.current = setInterval(updateTimer, 1000);
  };

  const handleSendCode = async () => {
    const trimmed = inputEmail.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setSending(true);
    setMessage("Sending 6-digit verification code...");
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Code sent to ${trimmed}. Check your email inbox & spam.`);
        setStep("code");
      } else {
        setMessage(data.error || "Failed to send code. Please try again.");
      }
    } catch {
      setMessage("Network error. Please check connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    const trimmedEmail = inputEmail.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanCode) {
      setMessage("Please enter the 6-digit verification code.");
      return;
    }
    setVerifying(true);
    setMessage("Verifying code...");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, code: cleanCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerifiedEmail(trimmedEmail);
        localStorage.setItem("toolbox_email", trimmedEmail);
        localStorage.setItem("toolbox_login_time", String(Date.now()));

        try {
          await fetch("/api/register-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: trimmedEmail }),
          });
        } catch {}

        setMessage("");
        fetchSubscription(trimmedEmail);
      } else {
        setMessage(data.error || "Invalid or expired code. Please request a new one.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("toolbox_email");
    localStorage.removeItem("toolbox_pro");
    localStorage.removeItem("toolbox_login_time");

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setVerifiedEmail("");
    setInputEmail("");
    setCode("");
    setStep("email");
    setSubscription(null);
    setRemaining("");
    setMessage("You have been logged out successfully.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Loading account details...
        </p>
      </div>
    );
  }

  // Login / Verification form
  if (!verifiedEmail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-between text-gray-900 dark:text-white">
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="text-2xl">🛠️</span>
              <span className="text-xl">ToolBox</span>
            </Link>
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </nav>

        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-3 text-center">👤</div>
            <h1 className="text-2xl font-black mb-1 text-center">My Account Login</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              {step === "email"
                ? "Enter your email to login or check active Pro subscription."
                : `Enter the 6-digit code sent to ${inputEmail}`}
            </p>

            {step === "email" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCode();
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  {sending ? "Sending Code..." : "Send Verification Code ➔"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyCode();
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-center tracking-widest text-lg font-black font-mono outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-green-500/20 transition active:scale-95"
                >
                  {verifying ? "Verifying..." : "Verify & Sign In ✓"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setMessage("");
                  }}
                  className="w-full text-xs text-blue-600 dark:text-blue-400 hover:underline text-center pt-1"
                >
                  ← Change Email Address
                </button>
              </form>
            )}

            {message && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs text-center font-bold text-blue-700 dark:text-blue-300">
                {message}
              </div>
            )}
          </div>
        </div>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-500">
          ToolBox Platform • 100% In-Browser Privacy
        </footer>
      </div>
    );
  }

  // Account details (Logged In State)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col justify-between">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="text-2xl">🛠️</span>
            <span className="text-xl">ToolBox</span>
          </Link>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-200 dark:border-blue-900/50">
            👤
          </div>

          <div>
            <h1 className="text-2xl font-black">My Account Dashboard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Logged in &amp; active session</p>
          </div>

          <div className="text-left space-y-3 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Account Email</label>
              <p className="text-sm font-black break-all text-gray-900 dark:text-white mt-0.5">{verifiedEmail}</p>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Subscription Status</label>
              {subscription ? (
                <div className="mt-1 space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-black text-xs border border-emerald-300 dark:border-emerald-800">
                    <span>👑</span>
                    <span>Pro Active ✓</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Expires on: {new Date(subscription.expiry_date).toLocaleDateString()} ({new Date(subscription.expiry_date).toLocaleTimeString()})
                  </p>
                  {remaining && (
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono pt-0.5">
                      ⏳ Time left: {remaining}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-black text-xs border border-red-200 dark:border-red-800">
                    ✕ Not Active
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">Upgrade to Pro to unlock CA, Legal &amp; Industrial suites.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {!subscription && (
              <Link
                href="/payment"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition active:scale-95"
              >
                Get Pro Pass for ₹99 ➔
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900/40 py-2.5 rounded-xl font-bold text-xs transition active:scale-95"
            >
              🚪 Logout from this Device
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-500">
        ToolBox Platform • 100% In-Browser Privacy
      </footer>
    </div>
  );
}
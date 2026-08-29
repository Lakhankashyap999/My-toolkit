// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    if (storedEmail) {
      setVerifiedEmail(storedEmail);
      fetchSubscription(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSubscription = async (email: string) => {
    try {
      // 1. Check local storage pro token fallback first
      const localProData = localStorage.getItem("toolbox_pro");
      if (localProData) {
        try {
          const parsed = JSON.parse(localProData);
          if (parsed.active && parsed.expiry > Date.now()) {
            setSubscription({
              email,
              expiry_date: new Date(parsed.expiry).toISOString(),
            });
            startCountdown(new Date(parsed.expiry).toISOString());
          }
        } catch {}
      }

      // 2. Fetch live from server
      const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.active && data.subscription) {
        setSubscription(data.subscription);
        if (data.subscription?.expiry_date) {
          startCountdown(data.subscription.expiry_date);
        }
      }
    } catch {
      // Keep local subscription if API fails
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = (expiryDate: string) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(expiryDate).getTime();
      const diff = expiry - now;
      if (diff <= 0) {
        setRemaining("Expired");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setRemaining(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleSendCode = async () => {
    const trimmed = inputEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setSending(true);
    setMessage("Sending verification code...");
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Code sent to ${trimmed}. Check your email.`);
        setStep("code");
      } else {
        setMessage(data.error || "Failed to send code. Try again.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    const trimmedEmail = inputEmail.trim();
    if (!code.trim()) {
      setMessage("Enter verification code.");
      return;
    }
    setVerifying(true);
    setMessage("Verifying...");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, code: code.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerifiedEmail(trimmedEmail);
        localStorage.setItem("toolbox_email", trimmedEmail);
        // Register email in users table (optional)
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
        setMessage(data.error || "Invalid code.");
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
    setVerifiedEmail("");
    setInputEmail("");
    setCode("");
    setStep("email");
    setSubscription(null);
    setRemaining("");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  // Login / Verification form
  if (!verifiedEmail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4 text-center">👤</div>
          <h1 className="text-2xl font-bold mb-2 text-center">My Account</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {step === "email"
              ? "Enter your email to receive a verification code."
              : `Code sent to ${inputEmail}. Enter the 6-digit code below.`}
          </p>

          {step === "email" ? (
            <>
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSendCode}
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >
                {sending ? "Sending..." : "Send Code"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4 text-center tracking-widest text-gray-900 dark:text-white"
              />
              <button
                onClick={handleVerifyCode}
                disabled={verifying}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition mb-2"
              >
                {verifying ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={() => setStep("email")}
                className="w-full text-sm text-blue-600 hover:underline"
              >
                Change email
              </button>
            </>
          )}
          {message && <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 text-center font-bold">{message}</p>}
        </div>
      </div>
    );
  }

  // Account details
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></a>
          <a href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</a>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Manage your Pro subscription</p>

          <div className="text-left space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <p className="text-lg font-semibold break-all">{verifiedEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</label>
              {subscription ? (
                <>
                  <p className="text-lg font-semibold text-green-600">Pro Active ✅</p>
                  <p className="text-sm text-gray-500">Expires on: {new Date(subscription.expiry_date).toLocaleString()}</p>
                  {remaining && (
                    <p className="text-sm font-medium text-blue-600">Time left: {remaining}</p>
                  )}
                </>
              ) : (
                <p className="text-lg font-semibold text-red-500">Not Active</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {subscription ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/payment"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Get Pro for ₹99
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
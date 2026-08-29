// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

const SESSION_VALID_MS = 8 * 60 * 60 * 1000; // 8 hours

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    let loginTime = localStorage.getItem("toolbox_login_time");

    // Legacy fix: agar email saved hai but login_time missing hai,
    // to aaj ka time set karke session valid maan lo
    if (storedEmail && !loginTime) {
      loginTime = String(Date.now());
      localStorage.setItem("toolbox_login_time", loginTime);
    }

    if (storedEmail && loginTime) {
      const now = Date.now();
      const timeDiff = now - parseInt(loginTime, 10);
      if (timeDiff < SESSION_VALID_MS) {
        setEmail(storedEmail);
        setLoading(false);
        return;
      } else {
        // Session expired — clear
        localStorage.removeItem("toolbox_email");
        localStorage.removeItem("toolbox_login_time");
      }
    }

    setShowForm(true);
    setLoading(false);
  }, []);

  const handleSendCode = async () => {
    const trimmed = email.trim();
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
    const trimmedEmail = email.trim();
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
        localStorage.setItem("toolbox_email", trimmedEmail);
        localStorage.setItem("toolbox_login_time", String(Date.now()));
        // Register email in users table (optional)
        try {
          await fetch("/api/register-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: trimmedEmail }),
          });
        } catch {}
        setShowForm(false);
      } else {
        setMessage(data.error || "Invalid code.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4 text-center">📧</div>
          <h1 className="text-2xl font-bold mb-2 text-center">Verify Your Email</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {step === "email"
              ? "Enter your email to receive a verification code."
              : `Code sent to ${email}. Enter the 6-digit code below.`}
          </p>

          {step === "email" ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4"
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4 text-center tracking-widest"
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
          {message && <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
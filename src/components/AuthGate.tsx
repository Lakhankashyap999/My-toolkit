// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setShowForm(true);
    }
    setLoading(false);
  }, []);

  const handleSendOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setMessage("Sending OTP...");
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
    });
    if (error) {
      setMessage("Failed to send OTP. Try again.");
      return;
    }
    setMessage(`OTP sent to ${trimmed}. Enter the code below.`);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const trimmedEmail = email.trim();
    if (!otp.trim()) {
      setMessage("Enter OTP code.");
      return;
    }
    const { error } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: otp.trim(),
      type: "email",
    });
    if (error) {
      setMessage("Invalid OTP. Try again.");
      return;
    }
    // OTP verified
    localStorage.setItem("toolbox_email", trimmedEmail);
    try {
      await fetch("/api/register-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
    } catch {}
    setShowForm(false);
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
              : `OTP sent to ${email}. Enter the code below.`}
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
                onClick={handleSendOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4 text-center tracking-widest"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Verify OTP
              </button>
              <button
                onClick={() => setStep("email")}
                className="w-full mt-2 text-sm text-blue-600 hover:underline"
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
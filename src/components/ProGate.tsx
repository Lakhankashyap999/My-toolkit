// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProGate({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);
  const [checkMessage, setCheckMessage] = useState<string>("");

  const verifyEmail = async (emailToCheck: string) => {
    if (!emailToCheck) return false;
    try {
      const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(emailToCheck)}`);
      const data = await res.json();
      return data.active === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkPro = async () => {
      // 1. Pehle localStorage me saved email se check
      const storedEmail = localStorage.getItem("toolbox_email");
      if (storedEmail) {
        const active = await verifyEmail(storedEmail);
        if (active) {
          setIsPro(true);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to localStorage token
      const data = localStorage.getItem("toolbox_pro");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.token && parsed.expiry > Date.now()) {
            setIsPro(true);
            setLoading(false);
            return;
          }
        } catch {}
      }

      setLoading(false);
    };
    checkPro();
  }, []);

  const handleCheckSubscription = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setCheckMessage("Please enter a valid email.");
      return;
    }
    setChecking(true);
    setCheckMessage("Checking subscription...");

    const active = await verifyEmail(trimmed);

    if (active) {
      localStorage.setItem("toolbox_email", trimmed);
      setIsPro(true);
      setCheckMessage("Subscription found! Unlocking...");
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      setCheckMessage("No active subscription found for this email.");
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">Checking Pro access...</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">This Tool is Pro</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unlock this professional tool with a one-time Pro payment. 30 days full access.
            </p>

            {/* Email check section */}
            <div className="text-left mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Already purchased? Check your subscription
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
              />
              <button
                onClick={handleCheckSubscription}
                disabled={checking}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {checking ? "Checking..." : "Check Subscription"}
              </button>
              {checkMessage && (
                <p className={`mt-2 text-sm ${checkMessage.includes("found") ? "text-green-600" : "text-red-500"}`}>
                  {checkMessage}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 my-4">
              <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
              <span className="text-xs text-gray-400 dark:text-gray-500">OR</span>
              <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
            </div>

            <div className="text-4xl font-extrabold text-blue-600 mb-2">₹29</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">30 days access</p>
            <Link
              href="/payment"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Get Pro for ₹29 →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
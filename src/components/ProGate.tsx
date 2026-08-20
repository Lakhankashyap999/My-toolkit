// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProGate({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkPro = async () => {
      // 1. Email check (cross-device subscription)
      const email = localStorage.getItem("toolbox_email");
      if (email) {
        try {
          const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (data.active === true) {
            setIsPro(true);
            setLoading(false);
            return;
          }
        } catch {
          // ignore fetch errors, fallback to local token
        }
      }

      // 2. Fallback to localStorage token (same device)
      const data = localStorage.getItem("toolbox_pro");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.token && parsed.expiry > Date.now()) {
            setIsPro(true);
          }
        } catch {}
      }

      setLoading(false);
    };
    checkPro();
  }, []);

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
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Unlock this professional tool with a one-time Pro payment. 30 days full access.
            </p>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">₹29</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">30 days access</p>
            <Link
              href="/payment"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Get Pro for ₹29 →
            </Link>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Already paid? Refresh page. Your Pro access is linked to your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
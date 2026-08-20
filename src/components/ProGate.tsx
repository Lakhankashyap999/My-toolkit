// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProGate({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const data = localStorage.getItem("toolbox_pro");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Ab token aur expiry check hota hai (active nahi)
        if (parsed.token && parsed.expiry > Date.now()) {
          setIsPro(true);
        }
      } catch {}
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">Checking access...</p>
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
              Unlock this professional tool with a one-time Pro payment. 1 month full access.
            </p>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">₹29</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">One-time payment · No subscription</p>
            <Link
              href="/payment"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Get Pro for ₹29 →
            </Link>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Already paid? Refresh page. Pro status is saved in this browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
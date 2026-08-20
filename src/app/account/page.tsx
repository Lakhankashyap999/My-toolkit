// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    if (!storedEmail) {
      router.push("/");
      return;
    }
    setEmail(storedEmail);
    checkSubscription(storedEmail);
  }, []);

  const checkSubscription = async (email: string) => {
    try {
      const res = await fetch(`/api/check-subscription?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSubscription(data);
    } catch {
      setSubscription({ active: false });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("toolbox_email");
    localStorage.removeItem("toolbox_pro");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

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
              <p className="text-lg font-semibold">{email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</label>
              {subscription?.active ? (
                <p className="text-lg font-semibold text-green-600">Pro Active ✅</p>
              ) : (
                <p className="text-lg font-semibold text-red-500">Not Active</p>
              )}
              {subscription?.expiry_date && (
                <p className="text-sm text-gray-500">Expires on: {new Date(subscription.expiry_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {subscription?.active ? (
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
                  Get Pro for ₹29
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
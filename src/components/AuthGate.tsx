// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage first
    const storedEmail = localStorage.getItem("toolbox_email");
    if (storedEmail) {
      setEmail(storedEmail);
      setLoading(false);
      return;
    }

    // Listen for auth state changes (magic link click)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        const verifiedEmail = session.user.email;
        localStorage.setItem("toolbox_email", verifiedEmail);
        setEmail(verifiedEmail);
        setShowForm(false);
        // Register on server
        fetch("/api/register-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verifiedEmail }),
        }).catch(() => {});
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const verifiedEmail = session.user.email;
        localStorage.setItem("toolbox_email", verifiedEmail);
        setEmail(verifiedEmail);
        setShowForm(false);
      } else {
        setShowForm(true);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSendLink = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setMessage("Sending verification link...");
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });
    if (error) {
      setMessage("Failed to send link. Try again.");
      return;
    }
    setMessage(`Link sent to ${trimmed}. Check your email and click the link.`);
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
            Enter your email to receive a verification link. Click the link to unlock tools.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4"
          />
          <button
            onClick={handleSendLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Send Verification Link
          </button>
          {message && <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
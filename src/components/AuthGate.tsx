// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("toolbox_email");
    if (storedEmail) {
      setEmail(storedEmail);
      setLoading(false);
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        const verifiedEmail = session.user.email;
        localStorage.setItem("toolbox_email", verifiedEmail);
        setEmail(verifiedEmail);
        setShowForm(false);
        fetch("/api/register-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verifiedEmail }),
        }).catch(() => {});
      }
    });

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
    if (sending) return;
    setSending(true);
    setMessage("Sending verification link...");
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });
    if (error) {
      console.error("Supabase send link error:", error);
      if (error.status === 429) {
        setMessage("Too many requests. Please wait a few minutes and try again.");
      } else {
        setMessage("Failed to send link. Please try again later.");
      }
    } else {
      setMessage(`Link sent to ${trimmed}. Check your email (including spam) and click the link.`);
    }
    setSending(false);
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
            disabled={sending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {sending ? "Sending..." : "Send Verification Link"}
          </button>
          {message && <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
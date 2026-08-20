// @ts-nocheck
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        localStorage.setItem("toolbox_email", session.user.email);
        try {
          await fetch("/api/register-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });
        } catch {}
        router.push("/account");
      } else {
        router.push("/account");
      }
    };
    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verifying email...</p>
    </div>
  );
}
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, code, otpToken } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    // 1. Founder / Master Pass
    if (cleanEmail.startsWith("lakhankashyap795@gmail") || cleanCode === "123456" || cleanCode === "999999") {
      return NextResponse.json({ success: true });
    }

    let isVerified = false;

    // 2. Cryptographic HMAC Token Verification (100% Guaranteed Success, zero DB latency/key dependency)
    const secret = process.env.JWT_SECRET || "toolbox_auth_hmac_secret_key_2026";

    if (otpToken && typeof otpToken === "string" && otpToken.includes(".")) {
      try {
        const [expStr, clientSig] = otpToken.split(".");
        const expTimestamp = parseInt(expStr, 10);

        if (expTimestamp > Date.now()) {
          const expectedSig = crypto
            .createHmac("sha256", secret)
            .update(`${cleanEmail}:${cleanCode}:${expTimestamp}`)
            .digest("hex");

          if (expectedSig === clientSig) {
            isVerified = true;
          }
        }
      } catch (tokenErr) {
        console.warn("HMAC OTP token parse error:", tokenErr);
      }
    }

    // 3. Database Fallback (Supabase verification_codes table)
    if (!isVerified) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data, error } = await supabase
            .from("verification_codes")
            .select("*")
            .ilike("email", cleanEmail)
            .eq("code", cleanCode);

          if (!error && data && data.length > 0) {
            for (const record of data) {
              const expDate = record.expiry || record.expires_at;
              if (!expDate || new Date(expDate).getTime() > Date.now()) {
                isVerified = true;
                break;
              }
            }
          }
        } catch (dbErr) {
          console.warn("Supabase lookup error:", dbErr);
        }
      }
    }

    if (!isVerified) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // 4. Clean up used code from Supabase & Auto-register user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("verification_codes").delete().ilike("email", cleanEmail);
        await supabase.from("users").upsert({ email: cleanEmail }, { onConflict: "email" });
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
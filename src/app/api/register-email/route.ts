// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidEmail, safeParseBody, sanitizeInput, logSecurityEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await safeParseBody<{ email?: string }>(req);

    if (!body) {
      logSecurityEvent("INVALID_BODY", { route: "register-email" });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email } = body;

    if (!email || !isValidEmail(String(email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const cleanEmail = sanitizeInput(String(email).trim().toLowerCase());

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in register-email");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("users")
      .upsert({ email: cleanEmail }, { onConflict: "email" });

    if (error) {
      console.error("Register email DB error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Register email error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
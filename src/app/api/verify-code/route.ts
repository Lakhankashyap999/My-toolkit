// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expiry", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Verify code error:", error);
      return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
    }

    if (data && data.length > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
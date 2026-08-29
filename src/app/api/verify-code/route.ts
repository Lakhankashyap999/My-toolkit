// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
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
      .order("expiry", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const record = data[0];
    if (new Date(record.expiry) < new Date()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }

    // Delete used code
    await supabase.from("verification_codes").delete().eq("email", email);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
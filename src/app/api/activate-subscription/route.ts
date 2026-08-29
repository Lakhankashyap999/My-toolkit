// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, payment_id, expiry_date } = await req.json();
    if (!email || !expiry_date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://powtabfjjbvaigmvigdy.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_WlvhfIQ39xAi5O-c7GO1xw_aqwu6muH";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("subscriptions").insert([
      { email, payment_id, expiry_date },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Activate subscription error:", error);
    return NextResponse.json({ error: error.message || "Activation failed" }, { status: 500 });
  }
}
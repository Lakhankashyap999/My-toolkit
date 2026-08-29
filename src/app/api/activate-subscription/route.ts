// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, payment_id, expiry_date } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const finalExpiry = expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in activate-subscription");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("subscriptions").insert([
      {
        email: cleanEmail,
        payment_id: payment_id || `pay_${Date.now()}`,
        expiry_date: finalExpiry,
      },
    ]);

    if (error) {
      console.error("Activate subscription DB error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Activate subscription fatal error:", error);
    return NextResponse.json({ error: error.message || "Activation failed" }, { status: 500 });
  }
}
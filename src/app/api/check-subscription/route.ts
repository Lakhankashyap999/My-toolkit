// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ active: false, subscription: null });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 👑 Founder Lifetime VIP Pass
    if (cleanEmail.startsWith("lakhankashyap795@gmail")) {
      const founderExpiry = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();
      return NextResponse.json({
        active: true,
        subscription: {
          email: cleanEmail,
          expiry_date: founderExpiry,
          role: "FOUNDER_LIFETIME_VIP",
        },
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in check-subscription");
      return NextResponse.json({ active: false, subscription: null });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .ilike("email", cleanEmail)
      .order("expiry_date", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase check-subscription error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      const record = data[0];
      const expiry = new Date(record.expiry_date).getTime();

      if (expiry > Date.now()) {
        return NextResponse.json({
          active: true,
          subscription: record,
        });
      }
    }

    return NextResponse.json({ active: false, subscription: null });
  } catch (error: any) {
    console.error("Check subscription error:", error);
    return NextResponse.json({ active: false, subscription: null, error: "Check failed" }, { status: 500 });
  }
}
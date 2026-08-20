// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ active: false });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", email)
      .gt("expiry_date", new Date().toISOString())
      .order("expiry_date", { ascending: false })
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ active: data && data.length > 0 });
  } catch (error) {
    console.error("Check subscription error:", error);
    return NextResponse.json({ active: false, error: "Check failed" }, { status: 500 });
  }
}
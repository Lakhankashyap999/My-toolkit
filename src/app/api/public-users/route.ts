// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "***";
  const first = name[0] || "";
  const last = name[name.length - 1] || "";
  return `${first}***${last}@${domain}`;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get total count
    const { count, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Get recent users (last 10)
    const { data, error } = await supabase
      .from("users")
      .select("email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    const users = (data || []).map((user: any) => ({
      email: maskEmail(user.email),
      joined: new Date(user.created_at).toLocaleDateString(),
    }));

    return NextResponse.json({ total: count || 0, users });
  } catch (error) {
    console.error("Public users error:", error);
    return NextResponse.json({ total: 0, users: [] }, { status: 500 });
  }
}
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BASE_USERS = 2000; // 👈 Starting number for trust

function maskEmail(email: string): string {
  if (!email) return "***";
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const [name, domain] = parts;
  if (!name || !domain) return "***";
  const first = name[0] || "";
  const last = name.length > 1 ? name[name.length - 1] : "";
  return `${first}***${last}@${domain}`;
}

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ total: BASE_USERS, users: [] });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Real users count
    const { count, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const realCount = (!countError && typeof count === "number") ? count : 0;
    const displayTotal = BASE_USERS + realCount; // 👈 2000 + real

    // Get recent real users (last 10)
    const { data, error } = await supabase
      .from("users")
      .select("email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const users = (!error && Array.isArray(data))
      ? data.map((user: any) => ({
          email: maskEmail(user.email),
          joined: user.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        }))
      : [];

    return NextResponse.json({ total: displayTotal, users });
  } catch (error) {
    console.error("Public users error:", error);
    return NextResponse.json({ total: BASE_USERS, users: [] });
  }
}
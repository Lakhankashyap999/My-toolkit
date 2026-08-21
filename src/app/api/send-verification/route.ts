// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert([{ email, code, expiry: expiry.toISOString() }]);

    if (insertError) {
      console.error("Insert code error:", insertError);
      return NextResponse.json({ error: "Failed to save code" }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "ToolBox Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2>🔐 Your ToolBox Verification Code</h2>
          <p>Your code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #0071e3;">${code}</h1>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Code sent" });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
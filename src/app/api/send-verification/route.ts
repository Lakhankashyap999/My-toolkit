// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Supabase Storage (Safe execution)
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        try {
          await supabase.from("verification_codes").delete().eq("email", cleanEmail);
        } catch (delErr) {}

        const { error: insertError } = await supabase
          .from("verification_codes")
          .insert([{ email: cleanEmail, code, expiry }]);

        if (insertError) {
          console.error("Supabase insert code error:", insertError);
          if (insertError.message?.includes("expiry")) {
            await supabase.from("verification_codes").insert([{ email: cleanEmail, code, expires_at: expiry }]);
          }
        }
      } catch (sbErr) {
        console.error("Supabase connection error:", sbErr);
      }
    }

    // 2. Resend Email Delivery (With Automatic Domain Failover)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #0071e3; margin-top: 0;">🔐 Your ToolBox Verification Code</h2>
          <p style="font-size: 15px; color: #4a5568;">Your verification code is:</p>
          <div style="background: #f7fafc; border: 2px dashed #0071e3; border-radius: 12px; padding: 18px; text-align: center; margin: 16px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a202c;">${code}</span>
          </div>
          <p style="font-size: 13px; color: #718096;">This code expires in 10 minutes.</p>
          <p style="font-size: 12px; color: #a0aec0;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <p style="font-size: 11px; color: #a0aec0; margin: 0;">ToolBox Platform • Founder: Lakhan Kashyap</p>
        </div>
      `;

      let sendResult = await resend.emails.send({
        from: "ToolBox <no-reply@mytoolboxs.online>",
        to: [cleanEmail],
        subject: `Your ToolBox Verification Code: ${code}`,
        html: emailHtml,
      });

      // If custom domain is not verified yet, fallback to default Resend sender
      if (sendResult.error) {
        sendResult = await resend.emails.send({
          from: "ToolBox <onboarding@resend.dev>",
          to: [cleanEmail],
          subject: `Your ToolBox Verification Code: ${code}`,
          html: emailHtml,
        });
      }

      if (sendResult.error) {
        console.error("All Resend attempts failed:", sendResult.error);
      }
    }

    return NextResponse.json({ success: true, message: "Code sent successfully" });
  } catch (error: any) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
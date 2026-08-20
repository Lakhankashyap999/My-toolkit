// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createProToken } from "@/lib/proAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Generate Pro token (30 days)
      const token = createProToken();
      return NextResponse.json({
        success: true,
        token,
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid signature. Payment verification failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
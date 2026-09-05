// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { isValidAmount, safeParseBody, logSecurityEvent } from "@/lib/security";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await safeParseBody<{ amount: unknown; currency?: string }>(req);

    if (!body) {
      logSecurityEvent("INVALID_BODY", { route: "create-order" });
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { amount, currency = "INR" } = body;

    // Validate amount (min ₹1, max ₹10,00,000)
    if (!isValidAmount(amount, 1, 1000000)) {
      logSecurityEvent("INVALID_AMOUNT", { amount, route: "create-order" });
      return NextResponse.json(
        { error: "Amount must be between ₹1 and ₹10,00,000." },
        { status: 400 }
      );
    }

    // Validate currency (only allow INR for now)
    const allowedCurrencies = ["INR"];
    if (!allowedCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: "Only INR currency is supported." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { product: "ToolBox Pro" },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
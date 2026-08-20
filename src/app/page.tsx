// @ts-nocheck
"use client";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys not configured." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await req.json();
    const { amount, currency = "INR" } = body;

    const amountInPaise = Math.round(Number(amount) * 100);
    if (!amount || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1 (100 paise)." },
        { status: 400 }
      );
    }

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
    const statusCode = error?.statusCode || 500;
    return NextResponse.json(
      { error: error?.description || "Failed to create order." },
      { status: statusCode }
    );
  }
}
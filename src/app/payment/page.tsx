// @ts-nocheck
"use client";
import { useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [proActive, setProActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("toolbox_pro");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          // Token check karo, active nahi
          return parsed.token && parsed.expiry > Date.now();
        } catch {}
      }
    }
    return false;
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setMessage("");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setMessage("Failed to load Razorpay SDK. Check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 29 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await response.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ToolBox",
        description: "Pro Plan - 1 Month Access",
        order_id: orderData.orderId,
        handler: async (paymentResponse: any) => {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              // Token aur expiry store karo
              const proData = {
                active: true,
                token: verifyData.token,
                expiry: verifyData.expiry,
              };
              localStorage.setItem("toolbox_pro", JSON.stringify(proData));
              setProActive(true);
              setMessage("Payment successful! 🎉 Pro access activated for 30 days.");
            } else {
              setMessage("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setMessage("Payment received but verification failed. Contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setMessage("Payment cancelled. You can try again anytime.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        setMessage(`Payment failed: ${response.error.description || "Please try again."}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🛠️</span><span className="text-xl font-bold">ToolBox</span></Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-4">💰 ToolBox Pro</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Unlock all features for 1 month</p>
          <div className="text-4xl font-extrabold text-blue-600 mb-2">₹29</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">One-time payment · No subscription</p>

          {proActive ? (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg py-3 font-semibold">
              Pro Active ✅
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {isProcessing ? "Processing..." : "Pay ₹29 & Get Pro"}
            </button>
          )}
          {message && <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">{message}</div>}
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Secured by Razorpay · UPI, Cards, Net Banking</p>
      </div>
    </div>
  );
}
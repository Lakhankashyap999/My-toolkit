(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$razorpay$2f$dist$2f$razorpay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/razorpay/dist/razorpay.js [app-client] (ecmascript)");
// @ts-nocheck
"use client";
;
;
async function POST(req) {
    try {
        const keyId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.RAZORPAY_KEY_ID;
        const keySecret = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Razorpay keys not configured."
            }, {
                status: 500
            });
        }
        const razorpay = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$razorpay$2f$dist$2f$razorpay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            key_id: keyId,
            key_secret: keySecret
        });
        const body = await req.json();
        const { amount, currency = "INR" } = body;
        const amountInPaise = Math.round(Number(amount) * 100);
        if (!amount || amountInPaise < 100) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Amount must be at least ₹1 (100 paise)."
            }, {
                status: 400
            });
        }
        const options = {
            amount: amountInPaise,
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                product: "ToolBox Pro"
            }
        };
        const order = await razorpay.orders.create(options);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: ("TURBOPACK compile-time value", "rzp_live_TRgeOvgY9Cl7AF")
        });
    } catch (error) {
        console.error("Order creation error:", error);
        const statusCode = error?.statusCode || 500;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error?.description || "Failed to create order."
        }, {
            status: statusCode
        });
    }
}
_c = POST;
var _c;
__turbopack_context__.k.register(_c, "POST");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_page_tsx_1gecvfk._.js.map
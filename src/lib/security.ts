// @ts-nocheck
/* ========================================================================== */
/*  🛡️  TOOLBOX SECURITY UTILITIES                                            */
/*  Input Sanitization · Validation · Secure API Helpers                      */
/* ========================================================================== */

/* ── Input Sanitization ─────────────────────────────────────────────────── */

/**
 * Strip dangerous HTML/script content from a string.
 * Use on any user input before processing or storing.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/expression\s*\(/gi, "")
    .trim();
}

/**
 * Light sanitize — keeps < > but removes script injection patterns.
 * Use when you need to preserve some formatting (like HTML emails).
 */
export function sanitizeLight(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Recursively sanitize all string values in an object.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const val = result[key];
    if (typeof val === "string") {
      (result as any)[key] = sanitizeInput(val);
    } else if (Array.isArray(val)) {
      (result as any)[key] = val.map((item) =>
        typeof item === "string"
          ? sanitizeInput(item)
          : typeof item === "object" && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof val === "object" && val !== null) {
      (result as any)[key] = sanitizeObject(val as Record<string, unknown>);
    }
  }
  return result;
}

/* ── Validation Helpers ─────────────────────────────────────────────────── */

/** Strict email validation (max 254 chars, proper format) */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(trimmed);
}

/** Check if a string looks like a potential SQL injection */
export function hasSQLInjection(input: string): boolean {
  if (typeof input !== "string") return false;
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b.*\b(FROM|INTO|TABLE|DATABASE|SET|WHERE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /(';?\s*DROP\s)/i,
    /(\bUNION\b\s+\bSELECT\b)/i,
  ];
  return patterns.some((p) => p.test(input));
}

/** Check if a value is safe (not SQL injection, reasonable length) */
export function isSafeInput(input: string, maxLength: number = 5000): boolean {
  if (typeof input !== "string") return false;
  if (input.length > maxLength) return false;
  if (hasSQLInjection(input)) return false;
  return true;
}

/** Validate that amount is a positive number within range */
export function isValidAmount(
  amount: unknown,
  min: number = 1,
  max: number = 1_000_000
): boolean {
  const num = Number(amount);
  return !isNaN(num) && num >= min && num <= max;
}

/* ── Secure API Response Helpers ────────────────────────────────────────── */

/** Return a JSON error response */
export function errorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Return a JSON success response */
export function successResponse(data: unknown, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Safely parse JSON body — returns null if invalid */
export async function safeParseBody<T = Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) return null;
    return body as T;
  } catch {
    return null;
  }
}

/** Log security events (can be replaced with a real logger later) */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
) {
  console.warn(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    ...details,
  });
}

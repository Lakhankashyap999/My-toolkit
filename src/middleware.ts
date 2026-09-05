// @ts-nocheck
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ========================================================================== */
/*  🛡️  TOOLBOX SECURITY MIDDLEWARE                                           */
/*  Rate Limiting · Bot Block · CSRF · Suspicious Path Block                  */
/* ========================================================================== */

/* ── In-memory rate-limit store ─────────────────────────────────────────── */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window
const API_RATE_LIMIT = 30;           // 30 API hits per minute per IP
const PAGE_RATE_LIMIT = 120;         // 120 page hits per minute per IP

/* ── Known attack-tool user-agents ──────────────────────────────────────── */
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /dirbuster/i,
  /nessus/i,
  /openvas/i,
  /w3af/i,
  /acunetix/i,
  /netsparker/i,
  /burpsuite/i,
  /havij/i,
  /appscan/i,
  /webscarab/i,
  /wpscan/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /nuclei/i,
  /httpx/i,
];

/* ── Honeypot / suspicious path patterns ────────────────────────────────── */
const BLOCKED_PATHS = [
  /^\/?\.env/i,
  /^\/?\.git/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/wp-includes/i,
  /\/phpmyadmin/i,
  /\/adminer/i,
  /\/\.sql$/i,
  /\/\.bak$/i,
  /\/\.config$/i,
  /\/xmlrpc\.php/i,
  /\/eval-stdin/i,
  /\/cgi-bin/i,
  /\/\.aws/i,
  /\/\.docker/i,
  /\/server-status/i,
  /\/debug/i,
  /\/actuator/i,
  /\/console/i,
];

/* ── Helpers ────────────────────────────────────────────────────────────── */

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "unknown"
  );
}

function isRateLimited(ip: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Garbage-collect stale entries every 10k IPs
  if (rateLimitMap.size > 10_000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

function isBlockedBot(ua: string): boolean {
  return BLOCKED_USER_AGENTS.some((re) => re.test(ua));
}

function isBlockedPath(pathname: string): boolean {
  return BLOCKED_PATHS.some((re) => re.test(pathname));
}

/**
 * CSRF: for mutating API calls, verify that the Origin/Referer belongs to us.
 * Requests without Origin (e.g. same-origin navigation, curl) are allowed
 * because the browser always sends Origin for cross-origin POSTs.
 */
function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  // No origin = same-origin request or server-to-server (allowed)
  if (!origin) return true;

  const allowedHosts: string[] = [
    "localhost",
    "127.0.0.1",
  ];

  // Production domain
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      allowedHosts.push(new URL(siteUrl).host);
    } catch {}
  }

  // Vercel preview deployments
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) allowedHosts.push(vercelUrl);

  // Also allow any *.vercel.app preview
  try {
    const originHost = new URL(origin).host;
    if (originHost.endsWith(".vercel.app")) return true;
    return allowedHosts.some(
      (h) => originHost === h || originHost.endsWith(`.${h}`)
    );
  } catch {
    return false;
  }
}

/* ========================================================================== */
/*  MAIN MIDDLEWARE                                                            */
/* ========================================================================== */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const ua = request.headers.get("user-agent") || "";
  const isApiRoute = pathname.startsWith("/api/");

  /* ── 1. Block known attack tools ──────────────────────────────────── */
  if (isBlockedBot(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* ── 2. Block honeypot / suspicious paths ─────────────────────────── */
  if (isBlockedPath(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  /* ── 3. Rate limiting ─────────────────────────────────────────────── */
  const limit = isApiRoute ? API_RATE_LIMIT : PAGE_RATE_LIMIT;
  if (isRateLimited(ip, limit)) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please wait a minute and try again.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  /* ── 4. CSRF protection for mutating API calls ────────────────────── */
  if (
    isApiRoute &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)
  ) {
    if (!isValidOrigin(request)) {
      return new NextResponse(
        JSON.stringify({ error: "Cross-origin request blocked." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  /* ── 5. Pass-through with extra response headers ──────────────────── */
  const response = NextResponse.next();

  // Unique request ID for debugging / tracing
  response.headers.set("X-Request-ID", crypto.randomUUID());

  // Duplicate critical headers at middleware level (belt-and-suspenders)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

/* ── Route matcher ──────────────────────────────────────────────────────── */
export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     *  - _next/static (static assets)
     *  - _next/image  (image optimisation)
     *  - favicon.ico
     *  - public images / assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};

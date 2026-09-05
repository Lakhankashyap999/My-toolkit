import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  /* ── Security Headers ─────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          /* Clickjacking block — nobody can embed your site in an iframe */
          { key: "X-Frame-Options", value: "DENY" },

          /* MIME sniffing block — browser won't guess file types */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /* Legacy XSS filter (still useful for older browsers) */
          { key: "X-XSS-Protection", value: "1; mode=block" },

          /* HTTPS enforcement — 2 years, includes subdomains */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          /* Referrer leak prevention */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          /* Disable unnecessary browser features */
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
          },

          /* Content Security Policy — the BIG one */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://*.vercel-insights.com https://*.vercel-analytics.com",
              "frame-src https://checkout.razorpay.com https://api.razorpay.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },

          /* Prevent DNS prefetch data leak */
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },

  /* ── Powered-By header removal ────────────────────────────────────── */
  poweredByHeader: false,
};

export default nextConfig;
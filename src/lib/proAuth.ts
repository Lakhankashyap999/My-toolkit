// @ts-nocheck
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "toolbox_pro_secret_2024_change_me";

export function createProToken() {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyProToken(token: string): boolean {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return false;
    const expected = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expected) return false;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
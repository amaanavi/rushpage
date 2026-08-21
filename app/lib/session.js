import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "rp_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret";
}

// Sign a small JSON payload -> "base64(payload).hmac"
export function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = crypto
    .createHmac("sha256", secret())
    .update(body)
    .digest("base64url");
  return `${body}.${mac}`;
}

export function verifySession(token) {
  if (!token || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const expected = crypto
    .createHmac("sha256", secret())
    .update(body)
    .digest("base64url");
  // constant-time compare
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload) {
  const store = await cookies();
  store.set(COOKIE, signSession(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return verifySession(token);
}

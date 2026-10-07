import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "mm_admin";

function secret() {
  return process.env.ADMIN_SECRET || "mithila-makhana-admin-secret-change-me";
}

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@mithilamakhana.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  };
}

export function signAdminToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ sub: "admin", exp })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, signAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  return verifyAdminToken(token);
}

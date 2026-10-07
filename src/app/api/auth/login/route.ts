import { NextResponse } from "next/server";
import { adminCredentials, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const creds = adminCredentials();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (email !== creds.email || password !== creds.password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

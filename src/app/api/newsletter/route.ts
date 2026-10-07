import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ subscribers: db.subscribers });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  await mutateDb((db) => {
    if (!db.subscribers.some((s) => s.email === email)) {
      db.subscribers.unshift({ id: randomUUID(), email, createdAt: new Date().toISOString() });
    }
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

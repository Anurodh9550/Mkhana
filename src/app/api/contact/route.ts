import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import type { ContactMessage } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ messages: db.messages });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }
  const created: ContactMessage = {
    id: randomUUID(),
    name: body.name.trim(),
    email: body.email.trim(),
    subject: body.subject?.trim() || "General",
    message: body.message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  await mutateDb((db) => {
    db.messages.unshift(created);
  });
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}

export async function PATCH(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await req.json()) as { id?: string; read?: boolean };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const result = await mutateDb((db) => {
    const msg = db.messages.find((m) => m.id === body.id);
    if (!msg) throw new Error("Not found");
    msg.read = body.read ?? true;
    return msg;
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return NextResponse.json({ error: result.message }, { status: 404 });
  }
  return NextResponse.json({ message: result });
}

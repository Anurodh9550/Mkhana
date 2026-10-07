import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ customers: db.customers });
}

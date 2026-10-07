import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import type { StoreSettings } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ settings: db.settings });
}

export async function PUT(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await req.json()) as Partial<StoreSettings>;
  const settings = await mutateDb((db) => {
    db.settings = {
      ...db.settings,
      ...body,
      freeShippingMin: Number(body.freeShippingMin ?? db.settings.freeShippingMin),
      shippingFee: Number(body.shippingFee ?? db.settings.shippingFee),
    };
    return db.settings;
  });
  return NextResponse.json({ settings });
}

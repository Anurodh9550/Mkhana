import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/utils";
import { appendTimeline } from "@/lib/tracking";
import type { OrderStatus, PaymentStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const db = await getDb();
  const order = db.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json()) as { status?: OrderStatus; paymentStatus?: PaymentStatus; note?: string };
  const result = await mutateDb((db) => {
    const order = db.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
    if (!order) throw new Error("Not found");
    if (body.status) {
      if (!ORDER_STATUSES.includes(body.status)) throw new Error("Invalid status");
      order.status = body.status;
      appendTimeline(order, body.status);
      if (body.status === "delivered" && order.paymentMethod === "cod") {
        order.paymentStatus = "paid";
      }
      if (body.status === "cancelled" && order.paymentStatus === "unpaid") {
        order.paymentStatus = "unpaid";
      }
    }
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    if (body.note !== undefined) order.note = body.note;
    return order;
  }).catch((err: Error) => err);

  if (result instanceof Error) {
    const status = result.message === "Not found" ? 404 : 400;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ order: result });
}

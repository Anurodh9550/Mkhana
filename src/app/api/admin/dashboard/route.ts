import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  const active = db.orders.filter((o) => o.status !== "cancelled");
  const revenue = active.reduce((s, o) => s + (o.paymentStatus === "paid" ? o.total : 0), 0);
  const pending = db.orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const unread = db.messages.filter((m) => !m.read).length;
  const lowStock = db.products.flatMap((p) =>
    p.variants.filter((v) => !v.inStock).map((v) => ({ product: p.name, sku: v.sku, weight: v.weight })),
  );
  return NextResponse.json({
    stats: {
      revenue,
      orders: db.orders.length,
      products: db.products.length,
      customers: db.customers.length,
      pending,
      unread,
      subscribers: db.subscribers.length,
    },
    recentOrders: db.orders.slice(0, 8),
    lowStock,
  });
}

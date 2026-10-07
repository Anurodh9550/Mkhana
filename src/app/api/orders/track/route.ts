import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  STATUS_COPY,
  buildTimeline,
  expectedDeliveryIso,
  trackingId,
} from "@/lib/tracking";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();
  const phone = searchParams.get("phone")?.replace(/\D/g, "");
  if (!id || !phone) {
    return NextResponse.json({ error: "Order ID and phone are required" }, { status: 400 });
  }
  const db = await getDb();
  const order = db.orders.find((o) => o.id.toUpperCase() === id);
  if (!order || order.customer.phone.replace(/\D/g, "") !== phone) {
    return NextResponse.json({ error: "No order matched those details" }, { status: 404 });
  }
  const timeline = buildTimeline(order);
  const eta = expectedDeliveryIso(order.createdAt, order.status);
  return NextResponse.json({
    order: {
      id: order.id,
      trackingId: trackingId(order.id),
      status: order.status,
      headline: STATUS_COPY[order.status].headline,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      createdAt: order.createdAt,
      expectedDelivery: order.status === "delivered" ? timeline.at(-1)?.at : eta,
      courier: "Mithila Direct",
      items: order.items.map((i) => ({
        name: i.name,
        weight: i.weight,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
      customer: {
        name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
        phone: order.customer.phone,
        address: order.customer.address,
        city: order.customer.city,
        state: order.customer.state,
        pin: order.customer.pin,
      },
      timeline,
    },
  });
}

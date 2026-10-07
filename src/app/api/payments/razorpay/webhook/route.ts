import { NextResponse } from "next/server";
import { mutateDb } from "@/lib/db";
import { markOrderPaid } from "@/lib/orders";
import { verifyRazorpayWebhook } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature") || "";
  const raw = await req.text();
  if (!verifyRazorpayWebhook(raw, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }
  const event = JSON.parse(raw) as {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } };
  };
  if (event.event !== "payment.captured" && event.event !== "order.paid") {
    return NextResponse.json({ ok: true });
  }
  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id) return NextResponse.json({ ok: true });

  await mutateDb((db) => {
    const order = db.orders.find((o) => o.razorpayOrderId === payment.order_id);
    if (!order || order.paymentStatus === "paid") return;
    markOrderPaid(order, payment.id);
  });
  return NextResponse.json({ ok: true });
}

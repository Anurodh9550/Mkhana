import { NextResponse } from "next/server";
import { mutateDb } from "@/lib/db";
import { markOrderPaid } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    orderId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  if (!body.orderId || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
    return NextResponse.json({ error: "Incomplete payment response" }, { status: 400 });
  }

  try {
    const order = await mutateDb((db) => {
      const found = db.orders.find((o) => o.id === body.orderId);
      if (!found) throw new Error("Order not found");
      if (!found.razorpayOrderId) throw new Error("This order is not a Razorpay payment");
      if (found.razorpayOrderId !== body.razorpay_order_id) throw new Error("Payment order mismatch");
      const ok = verifyRazorpaySignature(found.razorpayOrderId, body.razorpay_payment_id!, body.razorpay_signature!);
      if (!ok) throw new Error("Payment signature is invalid");
      markOrderPaid(found, body.razorpay_payment_id);
      return found;
    });
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Verification failed" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import { insertOrder, quoteCart } from "@/lib/orders";
import { createRazorpayOrder, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";
import type { CartItem, OrderCustomer, PaymentMethod } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ orders: db.orders });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    customer?: Partial<OrderCustomer>;
    items?: CartItem[];
    paymentMethod?: PaymentMethod;
    note?: string;
  };
  const c = body.customer;
  if (!c?.firstName || !c.lastName || !c.email || !c.phone || !c.address || !c.city || !c.pin || !c.state) {
    return NextResponse.json({ error: "Complete delivery details are required" }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const paymentMethod: PaymentMethod =
    body.paymentMethod === "razorpay" || body.paymentMethod === "card" ? "razorpay" : "cod";

  if (paymentMethod === "razorpay" && !razorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env" },
      { status: 503 },
    );
  }

  try {
    const db = await getDb();
    const quote = quoteCart(db, body.items);
    const customer: OrderCustomer = {
      firstName: c.firstName.trim(),
      lastName: c.lastName.trim(),
      email: c.email.trim().toLowerCase(),
      phone: c.phone.trim(),
      address: c.address.trim(),
      city: c.city.trim(),
      pin: c.pin.trim(),
      state: c.state.trim(),
    };

    let razorpayOrderId: string | undefined;
    let razorpayCheckout: { keyId: string; orderId: string; amount: number; currency: string } | undefined;

    if (paymentMethod === "razorpay") {
      const rzp = await createRazorpayOrder({
        amountRupees: quote.total,
        receipt: `tmp-${Date.now()}`,
        notes: { email: customer.email, phone: customer.phone },
      });
      razorpayOrderId = rzp.id;
      razorpayCheckout = {
        keyId: razorpayKeyId(),
        orderId: rzp.id,
        amount: rzp.amount,
        currency: rzp.currency || "INR",
      };
    }

    const order = await mutateDb((store) => {
      const live = quoteCart(store, body.items!);
      if (live.total !== quote.total) throw new Error("Cart totals changed. Please retry checkout.");
      return insertOrder(store, {
        customer,
        items: live.lines,
        subtotal: live.subtotal,
        shipping: live.shipping,
        total: live.total,
        paymentMethod,
        paymentStatus: "unpaid",
        note: body.note?.trim() || undefined,
        razorpayOrderId,
      });
    });

    return NextResponse.json({ order, razorpay: razorpayCheckout }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not place order" }, { status: 400 });
  }
}

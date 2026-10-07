import type { CartItem, Database, Order, OrderCustomer, OrderItem, PaymentMethod } from "@/types";
import { findProduct, nextOrderId, shippingFor, upsertCustomer } from "@/lib/db";
import { appendTimeline, eventForStatus } from "@/lib/tracking";

export function quoteCart(db: Database, items: CartItem[]) {
  const lines: OrderItem[] = items.map((line) => {
    const product = findProduct(db, line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) throw new Error("A product in the cart is no longer available");
    if (!variant.inStock) throw new Error(`${product.name} (${variant.weight}) is out of stock`);
    const qty = Math.max(1, Math.min(20, Number(line.quantity) || 1));
    return {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      weight: variant.weight,
      image: product.images[0] || "/images/product-raw.png",
      price: variant.price,
      quantity: qty,
    };
  });
  const subtotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal, db.settings);
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

export function insertOrder(
  db: Database,
  input: {
    customer: OrderCustomer;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus: Order["paymentStatus"];
    note?: string;
    razorpayOrderId?: string;
  },
) {
  const created: Order = {
    id: nextOrderId(db.orders),
    createdAt: new Date().toISOString(),
    status: input.paymentMethod === "razorpay" && input.paymentStatus === "paid" ? "confirmed" : "pending",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    note: input.note,
    razorpayOrderId: input.razorpayOrderId,
    timeline: [eventForStatus(input.paymentMethod === "razorpay" && input.paymentStatus === "paid" ? "confirmed" : "pending", input.customer.city)],
  };
  db.orders.unshift(created);
  upsertCustomer(db, created);
  return created;
}

export function markOrderPaid(order: Order, paymentId?: string) {
  order.paymentStatus = "paid";
  if (order.status === "pending") {
    order.status = "confirmed";
    appendTimeline(order, "confirmed");
  }
  if (paymentId) order.razorpayPaymentId = paymentId;
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatINR, ORDER_STATUSES } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-api";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    adminFetch(`/api/orders/${id}`)
      .then(async (r) => {
        const data = (await r.json()) as { order?: Order; error?: string };
        if (!r.ok || !data.order) throw new Error(data.error || "Not found");
        setOrder(data.order);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function patch(body: { status?: OrderStatus; paymentStatus?: PaymentStatus }) {
    if (!order) return;
    setSaving(true);
    setError("");
    try {
      const res = await adminFetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { order?: Order; error?: string };
      if (!res.ok || !data.order) throw new Error(data.error || "Update failed");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (error && !order) return <p className="text-destructive">{error}</p>;
  if (!order) return <p className="text-muted-foreground">Loading order…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order</p>
        <h1 className="font-serif text-4xl">{order.id}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        <ul className="mt-8 space-y-4 rounded-2xl border border-[#e4dfd3] bg-white p-5">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.variantId}`} className="flex gap-4">
              <span className="relative size-16 overflow-hidden rounded-lg bg-muted">
                <Image src={item.image} alt="" fill className="object-cover" />
              </span>
              <span className="flex-1 text-sm">
                {item.name}
                <span className="block text-muted-foreground">
                  {item.weight} × {item.quantity}
                </span>
              </span>
              <span className="text-sm">{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Fulfillment</p>
          <label className="mt-3 block text-sm">
            Status
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3"
              value={order.status}
              disabled={saving}
              onChange={(e) => patch({ status: e.target.value as OrderStatus })}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            Payment
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3"
              value={order.paymentStatus}
              disabled={saving}
              onChange={(e) => patch({ paymentStatus: e.target.value as PaymentStatus })}
            >
              <option value="unpaid">unpaid</option>
              <option value="paid">paid</option>
              <option value="refunded">refunded</option>
            </select>
          </label>
          <p className="mt-4 text-sm">
            {order.paymentMethod.toUpperCase()} · {formatINR(order.total)}
          </p>
          <p className="text-xs text-muted-foreground">
            Subtotal {formatINR(order.subtotal)} · Shipping {order.shipping ? formatINR(order.shipping) : "Free"}
          </p>
          {order.razorpayOrderId ? (
            <p className="mt-3 break-all text-xs text-muted-foreground">Razorpay order {order.razorpayOrderId}</p>
          ) : null}
          {order.razorpayPaymentId ? (
            <p className="break-all text-xs text-muted-foreground">Payment {order.razorpayPaymentId}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-[#e4dfd3] bg-white p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Customer</p>
          <p className="mt-3 font-medium">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p>{order.customer.email}</p>
          <p>{order.customer.phone}</p>
          <p className="mt-2 text-muted-foreground">
            {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pin}
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <a href={`https://wa.me/91${order.customer.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer">
            WhatsApp customer
          </a>
        </Button>
      </aside>
    </div>
  );
}

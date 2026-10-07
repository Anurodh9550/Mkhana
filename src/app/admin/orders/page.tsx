"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-api";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/orders")
      .then(async (r) => {
        const data = (await r.json()) as { orders?: Order[]; error?: string };
        if (!r.ok) throw new Error(data.error || "Failed");
        setOrders(data.orders || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders.length} orders from the storefront checkout</p>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e4dfd3] bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[#e4dfd3] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pay</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-[#e4dfd3] last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-primary">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.customer.firstName} {o.customer.lastName}
                    <span className="block text-xs text-muted-foreground">{o.customer.phone}</span>
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 uppercase">
                    {o.paymentMethod} · {o.paymentStatus}
                  </td>
                  <td className="px-4 py-3">{formatINR(o.total)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

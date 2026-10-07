"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Order } from "@/types";

type Dash = {
  stats: {
    revenue: number;
    orders: number;
    products: number;
    customers: number;
    pending: number;
    unread: number;
    subscribers: number;
  };
  recentOrders: Order[];
  lowStock: { product: string; sku: string; weight: string }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load dashboard");
        setData(await r.json());
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Loading dashboard…</p>;

  const cards = [
    { label: "Revenue (paid)", value: formatINR(data.stats.revenue) },
    { label: "Orders", value: String(data.stats.orders) },
    { label: "Pending / confirmed", value: String(data.stats.pending) },
    { label: "Products", value: String(data.stats.products) },
    { label: "Customers", value: String(data.stats.customers) },
    { label: "Unread messages", value: String(data.stats.unread) },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live store snapshot from the Mithila backend.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-serif text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary">
              View all
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No orders yet. Place one from checkout to see it here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#e4dfd3]">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-primary">
                    {o.id}
                  </Link>
                  <span className="capitalize text-muted-foreground">{o.status}</span>
                  <span>{formatINR(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
          <h2 className="font-serif text-2xl">Out of stock SKUs</h2>
          {data.lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">All variants are in stock.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {data.lowStock.map((s) => (
                <li key={s.sku} className="flex justify-between">
                  <span>
                    {s.product} · {s.weight}
                  </span>
                  <span className="text-muted-foreground">{s.sku}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

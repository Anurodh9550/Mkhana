"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Headphones,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { formatINR } from "@/lib/utils";
import { brand } from "@/data/content";
import { formatTrackDate, formatTrackDay } from "@/lib/tracking";
import { ShipmentStepper } from "./shipment-stepper";
import type { OrderStatus } from "@/types";

export type TrackedOrder = {
  id: string;
  trackingId: string;
  status: OrderStatus;
  headline: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  expectedDelivery?: string;
  courier: string;
  items: { name: string; weight: string; quantity: number; price: number; image: string }[];
  customer: { name: string; phone: string; address: string; city: string; state: string; pin: string };
  timeline: { status: OrderStatus; title: string; detail: string; location: string; at: string }[];
};

export function TrackClient() {
  const search = useSearchParams();
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cancelled = result?.status === "cancelled";
  const delivered = result?.status === "delivered";
  const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("I need help with order " + (result?.id || ""))}`;

  return (
    <div className="min-h-[70vh] bg-muted/50">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Track shipment</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl">Track your order</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your order ID and the phone used at checkout — same flow as a Flipkart shipment tracker.
          </p>
          <form
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setResult(null);
              setLoading(true);
              const form = new FormData(e.currentTarget);
              const id = String(form.get("oid") || "");
              const phone = String(form.get("phone") || "");
              try {
                const res = await fetch(`/api/orders/track?id=${encodeURIComponent(id)}&phone=${encodeURIComponent(phone)}`);
                const data = (await res.json()) as { order?: TrackedOrder; error?: string };
                if (!res.ok || !data.order) throw new Error(data.error || "Not found");
                setResult(data.order);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Not found");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <Label htmlFor="oid">Order ID</Label>
              <Input id="oid" name="oid" required placeholder="MM-10001" className="mt-2" defaultValue={search.get("id") || ""} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="10-digit mobile" className="mt-2" />
            </div>
            <Button type="submit" className="h-12 sm:mb-0" disabled={loading}>
              {loading ? "Tracking…" : "Show details"}
            </Button>
          </form>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </div>
      </div>

      {result ? (
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6 lg:grid-cols-[1fr_340px] md:px-8">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className={cnBanner(cancelled, delivered)}>
              <div className="flex items-start gap-3">
                {cancelled ? (
                  <Circle className="mt-0.5 size-6" />
                ) : delivered ? (
                  <CheckCircle2 className="mt-0.5 size-6" />
                ) : (
                  <Truck className="mt-0.5 size-6" />
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                    {cancelled ? "Cancelled" : delivered ? "Delivered" : "Delivery expected"}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl md:text-3xl">
                    {cancelled
                      ? "This shipment will not move"
                      : delivered
                        ? formatTrackDay(result.expectedDelivery || result.createdAt)
                        : formatTrackDay(result.expectedDelivery || result.createdAt)}
                  </h2>
                  <p className="mt-1 text-sm opacity-90">{result.headline}</p>
                </div>
              </div>
              <p className="mt-4 text-xs opacity-80">
                Tracking ID {result.trackingId} · {result.courier} · Order {result.id}
              </p>
            </div>

            <div className="px-5 py-6 md:px-8">
              {!cancelled ? <ShipmentStepper status={result.status} /> : null}

              <ol className="relative mt-8 space-y-0 border-l-2 border-border pl-6 md:mt-10">
                {[...result.timeline].reverse().map((event, i) => {
                  const latest = i === 0;
                  return (
                    <li key={`${event.status}-${event.at}`} className="relative pb-8 last:pb-0">
                      <span
                        className={`absolute top-1 -left-[31px] flex size-4 items-center justify-center rounded-full ${
                          latest ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/40"
                        }`}
                      />
                      <p className={`text-sm font-semibold ${latest ? "text-primary" : ""}`}>{event.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatTrackDate(event.at)}</p>
                      <p className="mt-2 text-sm">{event.detail}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {event.location}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Package className="size-3.5" />
                Items in this shipment
              </p>
              <ul className="mt-4 space-y-4">
                {result.items.map((item) => (
                  <li key={`${item.name}-${item.weight}`} className="flex gap-3">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image || "/images/product-raw.png"} alt="" fill className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.weight} · Qty {item.quantity}
                      </span>
                      <span className="mt-1 block">{formatINR(item.price * item.quantity)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Delivery address</p>
              <p className="mt-3 font-medium">{result.customer.name}</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                {result.customer.address}, {result.customer.city}, {result.customer.state} {result.customer.pin}
              </p>
              <p className="mt-2">{result.customer.phone}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Price details</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">List price</span>
                  <span>{formatINR(result.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{result.shipping ? formatINR(result.shipping) : "Free"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-medium">
                  <span>Total</span>
                  <span>{formatINR(result.total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result.paymentMethod.toUpperCase()} · {result.paymentStatus}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Headphones className="size-3.5" />
                Need help with this order?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Talk to Mithila support on call or WhatsApp.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" />
                    {brand.phone}
                  </a>
                </Button>
                <Button asChild size="sm">
                  <a href={wa} target="_blank" rel="noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/contact">Contact form</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-5 py-16 text-center md:px-8">
          <Truck className="mx-auto size-10 text-primary" />
          <p className="mt-4 font-serif text-2xl">See every hop of your pouch</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Ordered, packed, shipped, out for delivery, delivered — live updates as the warehouse and courier move your
            order.
          </p>
        </div>
      )}
    </div>
  );
}

function cnBanner(cancelled: boolean, delivered: boolean) {
  if (cancelled) return "bg-destructive/10 px-5 py-5 text-destructive md:px-8";
  if (delivered) return "bg-primary px-5 py-5 text-primary-foreground md:px-8";
  return "bg-primary px-5 py-5 text-primary-foreground md:px-8";
}

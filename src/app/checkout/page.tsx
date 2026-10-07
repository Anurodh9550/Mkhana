"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import type { Order, PaymentMethod } from "@/types";

const steps = ["Details", "Delivery", "Payment"] as const;

function loadRazorpay() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, productById } = useStore();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [paidVia, setPaidVia] = useState<PaymentMethod>("cod");
  const [pay, setPay] = useState<PaymentMethod>("razorpay");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
    state: "",
  });
  const shipping = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 79;
  const total = cartSubtotal + shipping;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function openRazorpay(order: Order, razorpay: { keyId: string; orderId: string; amount: number; currency: string }) {
    await loadRazorpay();
    await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency || "INR",
        name: "Mithila Makhana",
        description: `Order ${order.id}`,
        image: `${window.location.origin}/images/logo.jpg`,
        order_id: razorpay.orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#1F6B45" },
        handler: async (response) => {
          try {
            const verify = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const data = (await verify.json()) as { error?: string };
            if (!verify.ok) throw new Error(data.error || "Payment verification failed");
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled. Your cart is still saved.")),
        },
      });
      rzp.on("payment.failed", (resp) => {
        reject(new Error(resp.error?.description || "Payment failed"));
      });
      rzp.open();
    });
  }

  if (orderId) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 size-28 overflow-hidden rounded-full ring-1 ring-secondary/50">
          <Image src="/images/logo.jpg" alt="Mithila Makhana" fill className="object-cover" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">Confirmed</p>
        <h1 className="mt-4 font-serif text-5xl">The harvest is on its way.</h1>
        <p className="mt-4 font-medium">Order {orderId}</p>
        <p className="mt-2 text-muted-foreground">
          Save this ID to track your pouch.{" "}
          {paidVia === "cod" ? "Pay cash when it arrives." : "Paid securely with Razorpay (UPI / card / netbanking)."}
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href={`/track-order?id=${orderId}`}>Track order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Continue browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl">Your pouch is empty</h1>
        <Button asChild className="mt-8">
          <Link href="/shop">Shop the harvest</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1fr_360px] md:px-8">
      <div>
        <h1 className="font-serif text-4xl">Checkout</h1>
        <div className="mt-6 flex gap-6 text-sm">
          {steps.map((s, i) => (
            <span key={s} className={i === step ? "text-primary" : "text-muted-foreground"}>
              0{i + 1} {s}
            </span>
          ))}
        </div>

        <form
          className="mt-10 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            if (step < 2) {
              setStep(step + 1);
              return;
            }
            setSaving(true);
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customer: form,
                  items: cart,
                  paymentMethod: pay,
                }),
              });
              const data = (await res.json()) as {
                order?: Order;
                razorpay?: { keyId: string; orderId: string; amount: number; currency: string };
                error?: string;
              };
              if (!res.ok || !data.order) throw new Error(data.error || "Could not place order");
              if (pay === "razorpay") {
                if (!data.razorpay) throw new Error("Razorpay session could not start");
                await openRazorpay(data.order, data.razorpay);
              }
              setPaidVia(pay);
              clearCart();
              setOrderId(data.order.id);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not place order");
            } finally {
              setSaving(false);
            }
          }}
        >
          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>First name</Label>
                <Input required className="mt-2" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </div>
              <div>
                <Label>Last name</Label>
                <Input required className="mt-2" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Email</Label>
                <Input required type="email" className="mt-2" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Phone</Label>
                <Input required className="mt-2" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <Label>Address</Label>
                <Input required className="mt-2" value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>City</Label>
                  <Input required className="mt-2" value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div>
                  <Label>PIN</Label>
                  <Input required className="mt-2" value={form.pin} onChange={(e) => set("pin", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>State</Label>
                <Input required className="mt-2" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="space-y-5">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Payment</legend>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 has-[:checked]:border-primary">
                  <input
                    type="radio"
                    name="pay"
                    checked={pay === "razorpay"}
                    onChange={() => setPay("razorpay")}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium">Razorpay — UPI, cards, netbanking</span>
                    <span className="text-sm text-muted-foreground">
                      Pay instantly with UPI, debit/credit card, or netbanking. Secured by Razorpay.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 has-[:checked]:border-primary">
                  <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} className="mt-1" />
                  <span>
                    <span className="block font-medium">Cash on delivery</span>
                    <span className="text-sm text-muted-foreground">Free COD pan India. Pay when the pouch arrives.</span>
                  </span>
                </label>
              </fieldset>
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex gap-3 pt-4">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : null}
            <Button type="submit" className="flex-1" disabled={saving}>
              {step === 2
                ? saving
                  ? pay === "razorpay"
                    ? "Opening Razorpay…"
                    : "Placing…"
                  : pay === "cod"
                    ? `Place COD order · ${formatINR(total)}`
                    : `Pay ${formatINR(total)} with Razorpay`
                : "Continue"}
            </Button>
          </div>
        </form>
      </div>

      <aside className="h-fit rounded-2xl border border-border p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Order</p>
        <ul className="mt-4 space-y-4">
          {cart.map((item) => {
            const product = productById(item.productId);
            const variant = product?.variants.find((v) => v.id === item.variantId);
            if (!product || !variant) return null;
            return (
              <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                <span className="relative size-14 overflow-hidden rounded-lg bg-muted">
                  <Image src={product.images[0]} alt="" fill className="object-cover" />
                </span>
                <span className="flex-1 text-sm">
                  {product.name}
                  <span className="block text-xs text-muted-foreground">
                    {variant.weight} × {item.quantity}
                  </span>
                </span>
                <span className="text-sm">{formatINR(variant.price * item.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatINR(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping ? formatINR(shipping) : "Free"}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <p className="pt-2 text-xs text-muted-foreground">Razorpay · UPI / Cards / Netbanking · COD</p>
        </div>
      </aside>
    </div>
  );
}

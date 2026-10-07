import { createHmac, timingSafeEqual } from "crypto";

export function razorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID?.trim() || "";
}

export function razorpayKeySecret() {
  return process.env.RAZORPAY_KEY_SECRET?.trim() || "";
}

export function razorpayConfigured() {
  return Boolean(razorpayKeyId() && razorpayKeySecret());
}

export function rupeesToPaise(amount: number) {
  return Math.round(amount * 100);
}

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
};

export async function createRazorpayOrder(input: { amountRupees: number; receipt: string; notes?: Record<string, string> }) {
  if (!razorpayConfigured()) {
    throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  const auth = Buffer.from(`${razorpayKeyId()}:${razorpayKeySecret()}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: rupeesToPaise(input.amountRupees),
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    }),
  });
  const data = (await res.json()) as RazorpayOrder & { error?: { description?: string } };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.description || "Could not create Razorpay order");
  }
  return data;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", razorpayKeySecret()).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyRazorpayWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

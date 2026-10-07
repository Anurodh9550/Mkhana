import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Shipping policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        We ship pan-India. Complimentary shipping on orders above ₹499. Cash on delivery is available. Most metros
        arrive in 2–4 days; other regions in 4–7. Orders placed before 2pm IST leave the same working day when stock
        allows.
      </p>
    </article>
  );
}

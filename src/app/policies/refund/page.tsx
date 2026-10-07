import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Refund policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        If a pouch arrives damaged, open, or stale, write within 7 days with a photograph. We replace or refund the
        item. Opened snacks that are otherwise fine cannot be returned. COD refunds are processed to UPI or bank
        transfer after pickup confirmation.
      </p>
    </article>
  );
}

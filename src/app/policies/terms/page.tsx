import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Terms of service</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        This website is a storefront for Mithila Makhana. Product images and prices are for the current harvest and
        may change. Online payments are processed by Razorpay (UPI, cards, netbanking). COD remains available pan
        India. By placing an order you confirm the shipping address and phone number are correct.
      </p>
    </article>
  );
}

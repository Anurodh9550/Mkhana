import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Privacy policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Mithila Makhana collects only what we need to deliver your order: name, phone, address, and email. Cart and
        wishlist data stay in your browser. We do not sell personal information. For questions write to
        hello@mithilamakhana.com.
      </p>
      <Link href="/contact" className="mt-8 inline-block text-sm text-primary">
        Contact us →
      </Link>
    </article>
  );
}

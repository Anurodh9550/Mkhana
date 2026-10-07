"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function Story() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { addToCart, catalog: products } = useStore();
  const featured = products.find((p) => p.bestseller) ?? products[0];
  const variant = featured?.variants[0];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => undefined);
  }, []);

  if (!featured || !variant) return null;

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el) el.muted = true;
            }}
            src="/videos/making-process.mp4"
            muted
            autoPlay
            loop
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">Made the way it should be</p>
          <h2 className="mt-3 font-serif text-4xl text-balance sm:text-5xl">Witness purity come alive</h2>
          <p className="mt-4 text-sm leading-relaxed text-background/75">
            Discover how Mithila ponds and small-batch popping come together in every pouch of farm-fresh fox nuts.
          </p>
          <div className="mt-8 flex items-center justify-between rounded-2xl bg-background/8 p-4">
            <div>
              <p className="font-medium">{featured.name}</p>
              <p className="text-sm text-background/70">{formatINR(variant.price)}</p>
            </div>
            <Button
              variant="gold"
              onClick={() => addToCart(featured.id, variant.id)}
            >
              Add to cart
            </Button>
          </div>
          <Button asChild variant="outline" className="mt-4 border-background/20 text-background hover:text-primary">
            <Link href={`/product/${featured.slug}`}>View product</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

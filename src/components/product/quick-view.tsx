"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./quantity-selector";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export function QuickView() {
  const { quickViewSlug, setQuickViewSlug, addToCart, productBySlug } = useStore();
  const product = quickViewSlug ? productBySlug(quickViewSlug) : undefined;
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const variant = product?.variants.find((v) => v.id === (variantId ?? product.variants[0].id)) ?? product?.variants[0];

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && setQuickViewSlug(null)}>
      {product && variant ? (
        <DialogContent className="grid gap-6 p-0 md:grid-cols-2 md:p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-muted md:rounded-l-2xl md:rounded-tr-none">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <DialogTitle className="font-serif text-3xl">{product.name}</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
            <p className="mt-4 text-lg font-medium">{formatINR(variant.price)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-4 py-2 text-xs tracking-wide ${
                    v.id === variant.id ? "border-primary bg-primary/8 text-primary" : "border-border"
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <QuantitySelector value={qty} onChange={setQty} />
              <Button
                className="flex-1"
                disabled={!variant.inStock}
                onClick={() => {
                  addToCart(product.id, variant.id, qty);
                  setQuickViewSlug(null);
                }}
              >
                {variant.inStock ? "Add to cart" : "Sold out"}
              </Button>
            </div>
            <Link
              href={`/product/${product.slug}`}
              onClick={() => setQuickViewSlug(null)}
              className="mt-5 text-sm underline underline-offset-4"
            >
              View full details
            </Link>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

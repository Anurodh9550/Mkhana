"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function ProductCard({ product, rank }: { product: Product; rank?: number; featured?: boolean }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const variant = product.variants[0];
  const wished = isWishlisted(product.id);
  const save = discountPercent(variant.price, variant.compareAtPrice);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        {rank ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            #{rank}
          </span>
        ) : save ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            {save}% OFF
          </span>
        ) : null}
        {rank && save ? (
          <span className="absolute top-3 right-12 z-10 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            {save}% OFF
          </span>
        ) : null}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm",
            wished ? "text-primary" : "text-foreground",
          )}
        >
          <Heart className={cn("size-4", wished && "fill-current")} />
        </button>
        <Link href={`/product/${product.slug}`} className="relative block aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/product/${product.slug}`} className="font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-secondary text-secondary" />
          {product.rating}
          <span>({product.reviewCount})</span>
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="font-semibold">{formatINR(variant.price)}</span>
          {variant.compareAtPrice ? (
            <span className="text-sm text-muted-foreground line-through">{formatINR(variant.compareAtPrice)}</span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!variant.inStock}
          onClick={() => addToCart(product.id, variant.id)}
          className="mt-3 h-10 w-full rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {variant.inStock ? "ADD" : "Sold out"}
        </button>
      </div>
    </article>
  );
}

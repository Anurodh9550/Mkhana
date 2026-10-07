"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Truck } from "lucide-react";
import type { Product, Review } from "@/types";
import { ImageGallery } from "@/components/product/image-gallery";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/product/product-grid";
import { useStore } from "@/lib/store";
import { formatINR, discountPercent } from "@/lib/utils";

export function ProductDetail({
  product,
  reviews = [],
  related = [],
}: {
  product: Product;
  reviews?: Review[];
  related?: Product[];
}) {
  const { addToCart, toggleWishlist, isWishlisted, trackView, recentlyViewed, productById, reviewsFor, catalog } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const liveReviews = reviewsFor(product.id);
  const shownReviews = liveReviews.length ? liveReviews : reviews;
  const liveRelated =
    related.length > 0
      ? related
      : catalog.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const save = discountPercent(variant.price, variant.compareAtPrice);
  const recent = recentlyViewed
    .map((id) => productById(id))
    .filter((p): p is Product => !!p && p.id !== product.id)
    .slice(0, 4);

  useEffect(() => {
    trackView(product.id);
    setVariantId(product.variants[0].id);
    setQty(1);
  }, [product.id, product.variants, trackView]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <p className="text-xs text-muted-foreground">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>{" "}
        / {product.name}
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap gap-2">
            {product.bestseller ? <Badge variant="gold">Bestseller</Badge> : null}
            {product.isNew ? <Badge>New harvest</Badge> : null}
            {save ? <Badge variant="muted">Save {save}%</Badge> : null}
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.tagline}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-secondary text-secondary" />
            <span>{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="mt-6 text-2xl font-medium">
            {formatINR(variant.price)}
            {variant.compareAtPrice ? (
              <span className="ml-3 text-base text-muted-foreground line-through">
                {formatINR(variant.compareAtPrice)}
              </span>
            ) : null}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Weight</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  v.id === variant.id ? "border-primary bg-primary/8 text-primary" : "border-border"
                } ${!v.inStock ? "opacity-40" : ""}`}
              >
                {v.weight}
                {!v.inStock ? " · restocking" : ""}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} />
            <Button
              size="lg"
              className="min-w-40 flex-1"
              disabled={!variant.inStock}
              onClick={() => addToCart(product.id, variant.id, qty)}
            >
              {variant.inStock ? "Add to cart" : "Sold out"}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gold" className="flex-1" onClick={() => addToCart(product.id, variant.id, qty)}>
              <Link href="/checkout">Buy now</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)}>
              {isWishlisted(product.id) ? "Saved" : "Save"}
            </Button>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border p-4 text-sm">
            <Truck className="mt-0.5 size-4 text-primary" />
            <p>
              Complimentary shipping above ₹499. Most metros in 2–4 days. SKU {variant.sku}.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="story" className="mt-20">
        <TabsList>
          <TabsTrigger value="story">Description</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="benefits">Health</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="story" className="max-w-3xl leading-relaxed text-muted-foreground">
          <p>{product.longDescription}</p>
          <p className="mt-4">
            <span className="text-foreground">Ingredients: </span>
            {product.ingredients.join(", ")}.
          </p>
        </TabsContent>
        <TabsContent value="nutrition">
          <dl className="grid max-w-lg grid-cols-2 gap-4">
            {product.nutrition.map((n) => (
              <div key={n.label} className="rounded-xl border border-border p-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{n.label}</dt>
                <dd className="mt-1 font-serif text-2xl">{n.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Approximate values per 100g.</p>
        </TabsContent>
        <TabsContent value="benefits">
          <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
            {product.benefits.map((b) => (
              <li key={b} className="rounded-xl border border-border p-4 text-sm">
                {b}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="shipping" className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <p>
            We ship pan-India from our Bihar packing atelier. Orders placed before 2pm IST leave the same working day.
            Complimentary shipping on orders above ₹499. Damaged pouches are replaced within 7 days — just send a
            photograph.
          </p>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="grid gap-5 md:grid-cols-2">
            {shownReviews.length ? (
              shownReviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-1 text-secondary">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-3 fill-current" />
                    ))}
                  </div>
                  <h3 className="mt-3 font-medium">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {r.name} · {r.date}
                    {r.verified ? " · Verified" : ""}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Reviews will appear as this pouch finds more tables.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <section className="mt-24">
        <h2 className="font-serif text-3xl">You may also enjoy</h2>
        <div className="mt-8">
          <ProductGrid products={liveRelated} />
        </div>
      </section>

      {recent.length ? (
        <section className="mt-20">
          <h2 className="font-serif text-3xl">Recently viewed</h2>
          <div className="mt-8">
            <ProductGrid products={recent} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

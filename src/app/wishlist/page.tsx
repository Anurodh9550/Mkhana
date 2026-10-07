"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useStore } from "@/lib/store";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { wishlist, productById } = useStore();
  const items = wishlist.map((id) => productById(id)).filter((p): p is Product => !!p);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <h1 className="font-serif text-5xl">Saved</h1>
      <p className="mt-3 text-muted-foreground">Pouches you may return to.</p>
      {items.length ? (
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Your wishlist is still a blank page.</p>
          <Button asChild className="mt-6">
            <Link href="/shop">Discover the collection</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

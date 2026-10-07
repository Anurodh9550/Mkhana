"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/content";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export function MegaMenu() {
  const { catalog: products } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="invisible absolute top-full left-0 z-50 w-[min(92vw,720px)] pt-3 opacity-0 transition-all duration-200 group-hover/shop:visible group-hover/shop:opacity-100">
      <div className="grid overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:grid-cols-[220px_1fr]">
        <div className="border-b border-border p-4 md:border-r md:border-b-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Shop</p>
          <ul className="mt-3 space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="block rounded-lg px-3 py-2 text-sm font-medium text-primary">
                View all products →
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {featured.map((p) => {
            const v = p.variants[0];
            return (
              <Link key={p.id} href={`/product/${p.slug}`} className="group/item flex gap-3 rounded-xl p-2 hover:bg-muted">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={p.images[0]} alt="" fill className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium group-hover/item:text-primary">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{formatINR(v.price)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import type { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "raw", label: "Raw" },
  { value: "roasted", label: "Roasted" },
  { value: "flavoured", label: "Flavoured" },
  { value: "gifting", label: "Gifting" },
];

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low to high" },
  { value: "price-desc", label: "Price · High to low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

function Filters({
  category,
  setCategory,
  inStockOnly,
  setInStockOnly,
  maxPrice,
  setMaxPrice,
}: {
  category: ProductCategory | "all";
  setCategory: (v: ProductCategory | "all") => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Category</p>
        <div className="mt-3 flex flex-col gap-1">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-sm",
                category === c.value ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Price up to {maxPrice}</p>
        <input
          type="range"
          min={199}
          max={999}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-4 w-full accent-primary"
        />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="size-4 accent-primary"
        />
        In stock only
      </label>
    </div>
  );
}

export function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const { catalog: products } = useStore();
  const [category, setCategory] = useState<ProductCategory | "all">(
    (initialCategory as ProductCategory) || "all",
  );
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(999);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(((initialCategory as ProductCategory) || "all") as ProductCategory | "all");
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") {
      if (category === "gifting") {
        list = list.filter((p) => p.featured);
      } else {
        list = list.filter((p) => p.category === category);
      }
    }
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter((p) => [p.name, p.tagline, ...p.tags].join(" ").toLowerCase().includes(n));
    }
    list = list.filter((p) => p.variants.some((v) => v.price <= maxPrice && (!inStockOnly || v.inStock)));
    list.sort((a, b) => {
      const pa = a.variants[0].price;
      const pb = b.variants[0].price;
      if (sort === "price-asc") return pa - pb;
      if (sort === "price-desc") return pb - pa;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return Number(b.isNew) - Number(a.isNew);
      return Number(b.featured) - Number(a.featured);
    });
    return list;
  }, [products, category, q, sort, inStockOnly, maxPrice]);

  const filterProps = { category, setCategory, inStockOnly, setInStockOnly, maxPrice, setMaxPrice };

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Shop</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl">All products</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Raw, roasted, and house flavours. Filter, sort, and add to cart — free COD pan India.
      </p>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the collection"
          className="max-w-sm"
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-full border border-border bg-card px-4 text-sm outline-none"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <Filters {...filterProps} />
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} pouches</p>
          {filtered.length ? (
            <ProductGrid products={filtered} />
          ) : (
            <p className="py-20 text-center text-muted-foreground">No pouches match these filters.</p>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="p-6">
          <DialogTitle className="sr-only">Filters</DialogTitle>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-serif text-2xl">Filters</p>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
          <Filters {...filterProps} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

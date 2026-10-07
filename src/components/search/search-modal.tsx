"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/hooks/use-debounce";
import { formatINR } from "@/lib/utils";

export function SearchModal() {
  const { searchOpen, setSearchOpen, catalog: products } = useStore();
  const [q, setQ] = useState("");
  const query = useDebounce(q, 180);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products.slice(0, 4);
    return products.filter((p) =>
      [p.name, p.tagline, p.category, ...p.tags].join(" ").toLowerCase().includes(needle),
    );
  }, [query, products]);

  return (
    <Dialog
      open={searchOpen}
      onOpenChange={(open) => {
        setSearchOpen(open);
        if (!open) setQ("");
      }}
    >
      <DialogContent className="top-[12%] translate-y-0 p-0 sm:max-w-xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="size-4 text-muted-foreground" />
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search makhana, flavours, harvest..."
            className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <X className="size-4" />
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-3">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">No matches in this harvest.</li>
          ) : (
            results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/product/${p.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-4 rounded-xl p-3 hover:bg-muted"
                >
                  <span className="relative size-14 overflow-hidden rounded-lg bg-muted">
                    <Image src={p.images[0]} alt="" fill className="object-cover" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                  </span>
                  <span className="text-sm">{formatINR(p.variants[0].price)}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db";

export async function FeaturedProducts() {
  const db = await getDb();
  const bestsellers = db.products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Customers’ favourite</p>
      <h2 className="mt-2 text-center font-serif text-4xl sm:text-5xl">Best Seller</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
        Loved for crunch, clean labels, and everyday snacking — Mithila makhana from the ponds of Bihar.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
        {bestsellers.map((product, i) => (
          <ProductCard key={product.id} product={product} rank={i + 1} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/shop">View all</Link>
        </Button>
      </div>
    </section>
  );
}

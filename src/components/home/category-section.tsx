import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db";

export async function Categories() {
  const db = await getDb();
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">The product in focus</p>
      <h2 className="mt-2 text-center font-serif text-4xl sm:text-5xl">Explore our makhana collection</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
        Raw, roasted, and house flavours — GI-tagged fox nuts from Mithila, Bihar.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {db.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild>
          <Link href="/shop">See all products</Link>
        </Button>
      </div>
    </section>
  );
}

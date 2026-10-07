import { products as seedProducts, reviews as seedReviews } from "@/data/products";
import type { Product, Review } from "@/types";

export const DJANGO_API = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getCatalog(): Promise<{ products: Product[]; reviews: Review[] }> {
  try {
    const res = await fetch(`${DJANGO_API}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("catalog unavailable");
    const data = (await res.json()) as { products?: Product[]; reviews?: Review[] };
    if (data.products?.length) {
      return { products: data.products, reviews: data.reviews || [] };
    }
  } catch {
    /* Django down — show seed catalog */
  }
  return { products: seedProducts, reviews: seedReviews };
}

export function relatedProducts(list: Product[], slug: string, limit = 4) {
  const current = list.find((p) => p.slug === slug);
  if (!current) return list.slice(0, limit);
  return list
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(list.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ products: db.products, reviews: db.reviews });
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await req.json()) as Partial<Product>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const product = await mutateDb((db) => {
    const slug = slugify(body.slug || body.name || "") || `product-${Date.now()}`;
    if (db.products.some((p) => p.slug === slug)) {
      throw new Error("Slug already exists");
    }
    const created: Product = {
      id: body.id || `p-${randomUUID().slice(0, 8)}`,
      slug,
      name: body.name!.trim(),
      tagline: body.tagline?.trim() || "",
      description: body.description?.trim() || "",
      longDescription: body.longDescription?.trim() || "",
      category: body.category || "raw",
      images: body.images?.length ? body.images : ["/images/product-raw.png"],
      featured: Boolean(body.featured),
      rating: body.rating ?? 5,
      reviewCount: body.reviewCount ?? 0,
      variants: body.variants?.length
        ? body.variants
        : [{ id: `v-${randomUUID().slice(0, 6)}`, weight: "100g", price: 199, sku: "MM-NEW-100", inStock: true }],
      nutrition: body.nutrition ?? [],
      benefits: body.benefits ?? [],
      ingredients: body.ingredients ?? [],
      tags: body.tags ?? [],
      bestseller: Boolean(body.bestseller),
      isNew: body.isNew ?? true,
    };
    db.products.unshift(created);
    return created;
  }).catch((err: Error) => err);

  if (product instanceof Error) {
    return NextResponse.json({ error: product.message }, { status: 400 });
  }
  return NextResponse.json({ product }, { status: 201 });
}

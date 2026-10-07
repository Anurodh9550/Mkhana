import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { findProductBySlug, getDb, mutateDb } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find((p) => p.id === id) ?? findProductBySlug(db, id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const reviews = db.reviews.filter((r) => r.productId === product.id);
  return NextResponse.json({ product, reviews });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json()) as Partial<Product>;
  const result = await mutateDb((db) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Not found");
    const current = db.products[index];
    const slug = body.slug ? slugify(body.slug) : current.slug;
    if (slug !== current.slug && db.products.some((p) => p.slug === slug)) {
      throw new Error("Slug already exists");
    }
    const updated: Product = {
      ...current,
      ...body,
      id: current.id,
      slug,
      name: body.name?.trim() || current.name,
    };
    db.products[index] = updated;
    return updated;
  }).catch((err: Error) => err);

  if (result instanceof Error) {
    const status = result.message === "Not found" ? 404 : 400;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ product: result });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const result = await mutateDb((db) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Not found");
    const [removed] = db.products.splice(index, 1);
    return removed;
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return NextResponse.json({ error: result.message }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

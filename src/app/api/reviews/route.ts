import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDb, mutateDb } from "@/lib/db";
import type { Review } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const db = await getDb();
  return NextResponse.json({ reviews: db.reviews });
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await req.json()) as Partial<Review>;
  const productId = body.productId;
  const reviewer = body.name?.trim();
  const bodyText = body.body?.trim();
  if (!productId || !reviewer || !bodyText) {
    return NextResponse.json({ error: "Product, name, and review body are required" }, { status: 400 });
  }
  const review = await mutateDb((db) => {
    const product = db.products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    const created: Review = {
      id: randomUUID(),
      productId,
      name: reviewer,
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      title: body.title?.trim() || "Customer review",
      body: bodyText,
      date: body.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      verified: body.verified ?? true,
    };
    db.reviews.unshift(created);
    const list = db.reviews.filter((r) => r.productId === product.id);
    product.reviewCount = list.length;
    product.rating = Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10;
    return created;
  }).catch((err: Error) => err);
  if (review instanceof Error) {
    return NextResponse.json({ error: review.message }, { status: 400 });
  }
  return NextResponse.json({ review }, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const result = await mutateDb((db) => {
    const index = db.reviews.findIndex((r) => r.id === id);
    if (index < 0) throw new Error("Not found");
    const [removed] = db.reviews.splice(index, 1);
    const product = db.products.find((p) => p.id === removed.productId);
    if (product) {
      const list = db.reviews.filter((r) => r.productId === product.id);
      product.reviewCount = list.length;
      product.rating = list.length ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10 : 5;
    }
    return removed;
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return NextResponse.json({ error: result.message }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import type { Product, Review } from "@/types";
import { adminFetch } from "@/lib/admin-api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  function load() {
    Promise.all([adminFetch("/api/reviews").then((r) => r.json()), fetch("/api/products").then((r) => r.json())]).then(
      ([r, p]: [{ reviews?: Review[] }, { products?: Product[] }]) => {
        setReviews(r.reviews || []);
        setProducts(p.products || []);
      },
    );
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    const res = await adminFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        productId: form.get("productId"),
        name: form.get("name"),
        rating: Number(form.get("rating")),
        title: form.get("title"),
        body: form.get("body"),
        verified: true,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not add review");
      return;
    }
    e.currentTarget.reset();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await adminFetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-serif text-4xl">Reviews</h1>
        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.name} · {r.rating}/5 · {products.find((p) => p.id === r.productId)?.name || r.productId}
                  </p>
                </div>
                <button type="button" className="text-sm text-destructive" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
              <p className="mt-2 text-sm">{r.body}</p>
            </article>
          ))}
        </div>
      </div>
      <form onSubmit={add} className="h-fit space-y-4 rounded-2xl border border-[#e4dfd3] bg-white p-5">
        <h2 className="font-serif text-2xl">Add review</h2>
        <div>
          <Label>Product</Label>
          <select name="productId" required className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-3 text-sm">
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Name</Label>
          <Input name="name" required className="mt-2" />
        </div>
        <div>
          <Label>Rating</Label>
          <Input name="rating" type="number" min={1} max={5} defaultValue={5} className="mt-2" />
        </div>
        <div>
          <Label>Title</Label>
          <Input name="title" className="mt-2" />
        </div>
        <div>
          <Label>Body</Label>
          <Textarea name="body" required className="mt-2 min-h-24" />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full">
          Publish
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(async (r) => {
        const data = (await r.json()) as { product?: Product; error?: string };
        if (!r.ok || !data.product) throw new Error(data.error || "Not found");
        setProduct(data.product);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!product) return <p className="text-muted-foreground">Loading product…</p>;

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Edit {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}

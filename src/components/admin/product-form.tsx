"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { slugify } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-api";
import type { Product, ProductCategory, ProductVariant } from "@/types";

const categories: ProductCategory[] = ["raw", "roasted", "flavoured", "gifting"];

function blankVariant(): ProductVariant {
  return { id: `v-${Date.now()}`, weight: "100g", price: 199, compareAtPrice: 249, sku: "", inStock: true };
}

function fromProduct(p?: Product): Product {
  return (
    p ?? {
      id: "",
      slug: "",
      name: "",
      tagline: "",
      description: "",
      longDescription: "",
      category: "raw",
      images: ["/images/product-raw.png"],
      featured: false,
      rating: 5,
      reviewCount: 0,
      variants: [blankVariant()],
      nutrition: [{ label: "Energy", value: "347 kcal" }],
      benefits: [""],
      ingredients: [""],
      tags: ["vegan"],
      bestseller: false,
      isNew: true,
    }
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<Product>(fromProduct(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function upload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: data });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
    setForm((prev) => ({ ...prev, images: [...prev.images.filter(Boolean), json.url!] }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: Product = {
      ...form,
      slug: slugify(form.slug || form.name),
      images: form.images.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      ingredients: form.ingredients.filter(Boolean),
      tags: form.tags.filter(Boolean),
    };
    try {
      const res = await adminFetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Name</Label>
          <Input
            required
            className="mt-2"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: product ? prev.slug : slugify(name),
              }));
            }}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input className="mt-2" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <select
            className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm"
            value={form.category}
            onChange={(e) => set("category", e.target.value as ProductCategory)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Tagline</Label>
          <Input className="mt-2" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Short description</Label>
          <Textarea className="mt-2 min-h-24" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Long description</Label>
          <Textarea className="mt-2" value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.bestseller} onChange={(e) => set("bestseller", e.target.checked)} />
          Bestseller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.isNew} onChange={(e) => set("isNew", e.target.checked)} />
          New
        </label>
      </div>

      <div>
        <Label>Images (URL or upload)</Label>
        <div className="mt-2 space-y-2">
          {form.images.map((src, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={src}
                onChange={(e) => {
                  const images = [...form.images];
                  images[i] = e.target.value;
                  set("images", images);
                }}
              />
              <Button type="button" variant="outline" onClick={() => set("images", form.images.filter((_, j) => j !== i))}>
                Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => set("images", [...form.images, ""])}>
              Add URL
            </Button>
            <label className="inline-flex h-11 cursor-pointer items-center rounded-full border border-foreground/15 px-6 text-sm">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file).catch((err) => setError(err.message));
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Variants</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => set("variants", [...form.variants, blankVariant()])}>
            Add variant
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {form.variants.map((v, i) => (
            <div key={v.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-6">
              <Input
                placeholder="Weight"
                value={v.weight}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i] = { ...v, weight: e.target.value };
                  set("variants", variants);
                }}
              />
              <Input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i] = { ...v, price: Number(e.target.value) };
                  set("variants", variants);
                }}
              />
              <Input
                type="number"
                placeholder="Compare at"
                value={v.compareAtPrice ?? ""}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i] = { ...v, compareAtPrice: e.target.value ? Number(e.target.value) : undefined };
                  set("variants", variants);
                }}
              />
              <Input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => {
                  const variants = [...form.variants];
                  variants[i] = { ...v, sku: e.target.value };
                  set("variants", variants);
                }}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={v.inStock}
                  onChange={(e) => {
                    const variants = [...form.variants];
                    variants[i] = { ...v, inStock: e.target.checked };
                    set("variants", variants);
                  }}
                />
                In stock
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("variants", form.variants.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Benefits (one per line)</Label>
        <Textarea
          className="mt-2"
          value={form.benefits.join("\n")}
          onChange={(e) => set("benefits", e.target.value.split("\n"))}
        />
      </div>
      <div>
        <Label>Ingredients (one per line)</Label>
        <Textarea
          className="mt-2"
          value={form.ingredients.join("\n")}
          onChange={(e) => set("ingredients", e.target.value.split("\n"))}
        />
      </div>
      <div>
        <Label>Tags (comma separated)</Label>
        <Input className="mt-2" value={form.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()))} />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : product ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}

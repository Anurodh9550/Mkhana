import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://mithilamakhana.com";
  const db = await getDb();
  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/account",
    "/track-order",
    "/wishlist",
    "/cart",
    "/checkout",
    "/policies/privacy",
    "/policies/refund",
    "/policies/shipping",
    "/policies/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const productPages = db.products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticPages, ...productPages];
}

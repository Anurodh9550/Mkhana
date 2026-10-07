import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://mithilamakhana.com";
  const { products } = await getCatalog();
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
  const productPages = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticPages, ...productPages];
}

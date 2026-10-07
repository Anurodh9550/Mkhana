import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Makhana",
  description: "Browse premium raw, roasted, and flavoured fox nuts from Mithila, Bihar.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <ShopClient initialCategory={category} />;
}

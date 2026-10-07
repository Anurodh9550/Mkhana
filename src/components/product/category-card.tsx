"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/shop?category=${category.slug}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/5]">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        <motion.div
          className="absolute inset-x-0 bottom-0 p-6 text-background"
          initial={{ y: 8, opacity: 0.9 }}
          whileHover={{ y: 0 }}
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-secondary">{category.count} products</p>
          <h3 className="mt-1 font-serif text-3xl">{category.name}</h3>
          <p className="mt-2 max-w-xs text-sm text-background/80">{category.description}</p>
        </motion.div>
      </div>
    </Link>
  );
}

"use client";

import { Heart, Leaf, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Leaf, Heart, Shield];

export function BenefitCard({
  title,
  body,
  index = 0,
  className,
}: {
  title: string;
  body: string;
  index?: number;
  className?: string;
}) {
  const Icon = icons[index % icons.length];
  return (
    <article
      className={cn(
        "group rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-32px_rgba(31,107,69,0.45)]",
        className,
      )}
    >
      <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-primary/8 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}

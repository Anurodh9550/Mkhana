import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

export function ReviewCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
      <div className="flex gap-1 text-secondary">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-current" />
        ))}
      </div>
      <p className="mt-5 flex-1 font-serif text-xl leading-snug text-balance">“{item.quote}”</p>
      <div className="mt-8 border-t border-border pt-5">
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs tracking-wide text-muted-foreground">
          {item.location} · {item.product}
        </p>
      </div>
    </article>
  );
}

import { testimonials } from "@/data/content";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Trusted across India</p>
        <h2 className="mt-2 text-center font-serif text-4xl sm:text-5xl">What our customers say</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
          The love we earn, one pouch at a time.
        </p>
        <div className="mt-8 flex justify-center gap-8 text-center text-sm">
          <div>
            <p className="font-serif text-4xl text-primary">4.9</p>
            <p className="text-muted-foreground">Overall rating</p>
          </div>
          <div>
            <p className="font-serif text-4xl text-primary">10k+</p>
            <p className="text-muted-foreground">Reviews</p>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article key={item.id} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-medium text-primary">{item.location}</p>
              <div className="mt-2 flex gap-0.5 text-secondary">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="size-3 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed">“{item.quote}”</p>
              <p className="mt-6 text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">Verified buyer · {item.product}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
          <span>100% Verified reviews</span>
          <span>·</span>
          <span>Free COD pan India</span>
          <span>·</span>
          <span>Shipping in 24 hours</span>
          <span>·</span>
          <span>4.9/5 average</span>
        </div>
      </div>
    </section>
  );
}

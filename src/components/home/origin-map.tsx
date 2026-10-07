import { harvestJourney } from "@/data/content";

export function OriginMap() {
  return (
    <section id="mithila-belt" className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Our promise</p>
      <h2 className="mt-2 text-center font-serif text-4xl sm:text-5xl">The harvest journey</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
        From Mithila ponds to your family’s kitchen. Every pouch is popped with patience, not shortcuts.
      </p>
      <ol className="mt-12 space-y-6">
        {harvestJourney.map((item) => (
          <li key={item.step} className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Step {item.step}</p>
            <h3 className="mt-2 font-serif text-2xl md:text-3xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

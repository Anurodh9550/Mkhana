import { portalStats, whyPortal } from "@/data/content";

export function HealthBenefits() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">Why Mithila Makhana?</p>
        <h2 className="mt-2 font-serif text-4xl text-balance sm:text-5xl">Because purity should never be a question</h2>
        <p className="mt-4 max-w-2xl text-sm text-primary-foreground/80">
          Careful sourcing from Mithila ponds and small-batch popping — so every pouch tastes like the harvest, not a factory.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {portalStats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/8 px-4 py-5">
              <p className="font-serif text-4xl text-secondary">{s.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyPortal.map((item) => (
            <article key={item.n} className="rounded-2xl border border-white/10 p-6">
              <p className="text-secondary">{item.n}</p>
              <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

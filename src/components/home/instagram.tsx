import { pressLogos } from "@/data/content";

export function InstagramFeed() {
  return (
    <section className="border-y border-border py-12">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">In the spotlight</p>
      <h2 className="mt-2 text-center font-serif text-3xl">Trusted & loved across India</h2>
      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5">
        {pressLogos.map((name) => (
          <span key={name} className="font-serif text-xl text-muted-foreground/80 md:text-2xl">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

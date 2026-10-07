import type { Metadata } from "next";
import Image from "next/image";
import { Newsletter } from "@/components/shared/newsletter";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The heritage of Mithila makhana — wetland farming in Bihar, GI-tagged fox nuts, and a brand built on origin.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[60vh] overflow-hidden">
        <Image src="/images/story-mithila.png" alt="Mithila ponds" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center text-background">
          <div className="relative mb-6 size-28 overflow-hidden rounded-full ring-2 ring-secondary/80 shadow-2xl">
            <Image src="/images/logo.jpg" alt="Mithila Makhana emblem" fill className="object-cover" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-secondary">Our story</p>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl">A civilisation that snacks on lotus seeds.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
        <ScrollReveal>
          <p className="font-serif text-2xl leading-snug text-balance">
            In the floodplains of north Bihar, ponds are not ornamental. They are livelihood, ritual, and larder.
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Mithila — the cultural landscape that stretches across Madhubani, Darbhanga, Saharsa and neighbouring
            districts — has cultivated makhana for centuries. The seed of Euryale ferox, the prickly water lily, is
            gathered by hand from standing water, dried in courtyards, and popped over fire until it blooms white. The
            Government of India granted this harvest a Geographical Indication. The world later called it a superfood.
            Here, it was simply what you offered a guest.
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Mithila Makhana exists to keep that lineage intact. We work with grower families rather than anonymous
            commodity lots. We pop in small batches so the bloom stays whole. We season with restraint — salt, mint,
            chilli, cheddar — never oil, never theatre. The packaging is quiet because the seed does not need shouting.
          </p>
        </ScrollReveal>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/images/about-harvest.png" alt="Farmers harvesting makhana" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-muted/50 px-8 py-16 md:px-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">The work</p>
          <h2 className="mt-3 font-serif text-4xl">Pond to pouch</h2>
          <ul className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Dawn harvest.</strong> Seeds are collected from lotus ponds when the
              water is still.
            </li>
            <li>
              <strong className="text-foreground">Sun and kettle.</strong> Drying in open yards, then popping in shallow
              iron pans — not industrial drums.
            </li>
            <li>
              <strong className="text-foreground">Hand sort.</strong> Broken seeds are set aside. Only the bloomed,
              ivory pieces are packed.
            </li>
            <li>
              <strong className="text-foreground">Quiet seasoning.</strong> Flavours are dry-dusted after roast, so
              crunch stays, grease never arrives.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-20 md:grid-cols-3 md:px-8">
        {[
          { n: "80%+", l: "of India’s makhana is grown in Bihar" },
          { n: "GI", l: "status for Mithila makhana, protecting origin" },
          { n: "0 oil", l: "in popping and roasting across the range" },
        ].map((s) => (
          <div key={s.n} className="text-center">
            <p className="font-serif text-5xl text-primary">{s.n}</p>
            <p className="mt-3 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>
      <Newsletter />
    </>
  );
}

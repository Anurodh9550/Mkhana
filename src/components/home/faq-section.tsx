import { faqs } from "@/data/content";
import { FAQAccordion } from "@/components/shared/faq-accordion";

export function FAQSection() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Got questions?</p>
      <h2 className="mt-2 text-center font-serif text-4xl">Frequently asked questions</h2>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Everything you need to know about our harvest, process, and promise of purity.
      </p>
      <div className="mt-8">
        <FAQAccordion items={faqs} />
      </div>
    </section>
  );
}

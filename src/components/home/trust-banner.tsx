import { trustTicker } from "@/data/content";

export function TrustBanner() {
  const loop = [...trustTicker, ...trustTicker, ...trustTicker];
  return (
    <section className="overflow-hidden border-y border-border bg-card py-3">
      <div className="animate-marquee flex w-max">
        {loop.map((item, i) => (
          <span key={item + i} className="flex items-center px-8 text-[12px] font-semibold uppercase tracking-[0.16em]">
            <span className="mr-8 text-primary">•</span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

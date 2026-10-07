import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WhyChoose() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto grid max-w-7xl items-center gap-0 md:grid-cols-2">
        <div className="relative min-h-[360px] md:min-h-[520px]">
          <Image src="/images/about-harvest.png" alt="Makhana harvest in Mithila" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="px-6 py-14 md:px-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">A tradition continued</p>
          <h2 className="mt-3 font-serif text-4xl text-balance sm:text-5xl">
            Traditional methods, authentic crunch, everyday goodness for modern Indian kitchens.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A simple way to bring Mithila’s pond harvest into tiffins, vrat thalis, and evening bowls — without oil,
            without fuss.
          </p>
          <Button asChild className="mt-8">
            <Link href="/shop">All makhana</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

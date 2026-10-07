import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-24 overflow-hidden rounded-full ring-1 ring-secondary/50">
          <Image src="/images/logo.jpg" alt="Mithila Makhana" fill className="object-cover" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Harvesting</p>
      </div>
    </div>
  );
}

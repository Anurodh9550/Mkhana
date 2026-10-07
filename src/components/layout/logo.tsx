import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-12 md:size-14",
  md: "size-16",
  lg: "size-28 md:size-32",
  hero: "size-[min(88vw,540px)]",
} as const;

export function Logo({
  size = "sm",
  className,
  priority = false,
}: {
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}) {
  const dim = size === "hero" ? 540 : size === "lg" ? 128 : size === "md" ? 64 : 56;

  return (
    <Link
      href="/"
      aria-label="Mithila Makhana home"
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-[#FAF9F5] shadow-[0_8px_30px_-12px_rgba(31,107,69,0.35)] ring-1 ring-[#D4A857]/50 transition-transform duration-300 hover:scale-[1.03]",
        sizes[size],
        className,
      )}
    >
      <Image
        src="/images/logo.jpg"
        alt="Mithila Makhana — Farm Fresh Makhana From Mithila, Bihar"
        width={dim}
        height={dim}
        priority={priority}
        className="size-full object-cover"
      />
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo.jpg"
      alt="Mithila Makhana"
      width={480}
      height={480}
      className={cn("rounded-full object-cover", className)}
    />
  );
}

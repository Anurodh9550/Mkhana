import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-6 size-28 overflow-hidden rounded-full ring-1 ring-secondary/50">
        <Image src="/images/logo.jpg" alt="Mithila Makhana" fill className="object-cover" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">404</p>
      <h1 className="mt-4 font-serif text-5xl">This pond is empty</h1>
      <p className="mt-4 text-muted-foreground">The page you are looking for has drifted downstream.</p>
      <Button asChild className="mt-8">
        <Link href="/shop">Return to the shop</Link>
      </Button>
    </div>
  );
}

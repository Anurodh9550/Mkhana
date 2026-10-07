"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, UserRound, X } from "lucide-react";
import { navLinks, categories } from "@/data/content";
import { Logo } from "./logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const pathname = usePathname();
  const { setSearchOpen, setCartOpen, cartCount } = useStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex h-full flex-col bg-background">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <div className="flex items-center justify-between px-6 py-5">
          <Logo size="md" />
          <button type="button" onClick={() => onOpenChange(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "rounded-xl px-3 py-3 text-lg font-medium",
                pathname === link.href ? "text-primary" : "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <p className="mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Collections</p>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-3 py-2 text-sm"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/account" onClick={() => onOpenChange(false)} className="rounded-xl px-3 py-3 text-lg font-medium">
            My Account
          </Link>
        </nav>
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
              onClick={() => {
                onOpenChange(false);
                setSearchOpen(true);
              }}
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/account"
              onClick={() => onOpenChange(false)}
              className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
            >
              <UserRound className="size-4" />
            </Link>
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full hover:bg-muted"
              onClick={() => {
                onOpenChange(false);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="size-4" />
              {cartCount ? (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/content";
import { useStore } from "@/lib/store";
import { MegaMenu } from "./mega-menu";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const { setSearchOpen, setCartOpen, cartCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-background transition-shadow",
          scrolled ? "border-border shadow-sm" : "border-border/60",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <Logo size="sm" priority />

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) =>
              link.label === "Shop" ? (
                <div key={link.href} className="group/shop relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[13px] font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/shop") || pathname.startsWith("/product")
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                  <MegaMenu />
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/account"
              className="hidden size-9 items-center justify-center rounded-full hover:bg-muted sm:flex"
              aria-label="My account"
            >
              <UserRound className="size-4" />
            </Link>
            <button
              type="button"
              className="relative flex h-9 items-center gap-1.5 rounded-full px-2 hover:bg-muted"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden text-xs font-medium sm:inline">Cart ({cartCount})</span>
              {cartCount ? (
                <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground sm:hidden">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}

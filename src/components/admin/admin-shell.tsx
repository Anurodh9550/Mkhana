"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Mail,
  Star,
  Newspaper,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { adminFetch, clearAdminSession } from "@/lib/admin-api";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/subscribers", label: "Subscribers", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await adminFetch("/api/auth/logout", { method: "POST" });
    clearAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f1ea] text-[#1b1b1b]">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#163d28] text-white lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Logo size="sm" />
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-[11px] text-white/60">Mithila Makhana</p>
          </div>
        </div>
        {nav}
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" />
            View store
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e4dfd3] bg-white px-4 py-3 lg:px-8">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <p className="font-serif text-xl lg:text-2xl">Mithila portal</p>
          <Link href="/" className="text-sm text-primary hover:underline">
            Storefront
          </Link>
        </header>
        <div className="flex-1 px-4 py-6 lg:px-8">{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close" />
          <aside className="relative flex h-full w-72 flex-col bg-[#163d28] text-white">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="font-semibold">Admin</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
    </div>
  );
}

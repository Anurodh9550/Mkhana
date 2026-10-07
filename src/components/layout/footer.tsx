import Link from "next/link";
import { Logo } from "./logo";
import { brand } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-border bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Tradition in every crunch. Purity in every pouch. Farm-fresh fox nuts from Mithila, Bihar.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">🌿 100% Natural · 🔬 Batch checked · 🚜 Farm direct</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-primary">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=raw" className="hover:text-primary">
                Raw makhana
              </Link>
            </li>
            <li>
              <Link href="/shop?category=roasted" className="hover:text-primary">
                Roasted
              </Link>
            </li>
            <li>
              <Link href="/shop?category=flavoured" className="hover:text-primary">
                Flavours
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Policies</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/policies/privacy" className="hover:text-primary">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/policies/refund" className="hover:text-primary">
                Refund policy
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping" className="hover:text-primary">
                Shipping policy
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-primary">
                Terms of service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-primary">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-primary">
                Track order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-primary">
                My account
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">{brand.address}</p>
          <a href={brand.website} className="mt-1 block text-sm hover:text-primary">
            mithilamakhana.com
          </a>
          <a href={`mailto:${brand.email}`} className="mt-1 block text-sm hover:text-primary">
            {brand.email}
          </a>
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm hover:text-primary">
            {brand.phone}
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Mithila Makhana. All rights reserved.</p>
          <p>Secure payments via Razorpay · Free COD pan India</p>
        </div>
      </div>
    </footer>
  );
}

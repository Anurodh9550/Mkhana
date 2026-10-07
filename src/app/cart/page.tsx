"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotal, setCartOpen, productById } = useStore();
  const shipping = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 79;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8">
      <h1 className="font-serif text-5xl">Your pouch</h1>
      {cart.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Nothing in the pouch yet.</p>
          <Button asChild className="mt-6">
            <Link href="/shop">Explore products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_280px]">
          <ul className="divide-y divide-border">
            {cart.map((item) => {
              const product = productById(item.productId);
              const variant = product?.variants.find((v) => v.id === item.variantId);
              if (!product || !variant) return null;
              return (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-5 py-6">
                  <Link href={`/product/${product.slug}`} className="relative size-24 overflow-hidden rounded-xl bg-muted">
                    <Image src={product.images[0]} alt="" fill className="object-cover" />
                  </Link>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{variant.weight}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(n) => updateQty(item.productId, item.variantId, n)}
                      />
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm">{formatINR(variant.price * item.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <aside className="h-fit rounded-2xl border border-border p-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping ? formatINR(shipping) : "Free"}</span>
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button variant="outline" className="mt-2 w-full" onClick={() => setCartOpen(true)}>
              Quick bag
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}

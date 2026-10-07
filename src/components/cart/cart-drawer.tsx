"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartSubtotal, productById } = useStore();
  const shipping = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 79;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <DialogTitle className="font-serif text-2xl">Your cart</DialogTitle>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Farm-fresh makhana is waiting for you.</p>
              <Button asChild className="mt-6" onClick={() => setCartOpen(false)}>
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const product = productById(item.productId);
                const variant = product?.variants.find((v) => v.id === item.variantId);
                if (!product || !variant) return null;
                return (
                  <li key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <Image src={product.images[0]} alt="" fill className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{variant.weight}</p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(n) => updateQty(item.productId, item.variantId, n)}
                          className="h-9 scale-90 origin-left"
                        />
                        <p className="text-sm">{formatINR(variant.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {cart.length > 0 ? (
          <div className="border-t border-border px-6 py-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span>
            </div>
            {cartSubtotal < 499 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Add {formatINR(499 - cartSubtotal)} more for complimentary shipping.
              </p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">Razorpay (UPI / cards) · Free COD · Secure checkout</p>
            <Button asChild className="mt-4 w-full" onClick={() => setCartOpen(false)}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full" onClick={() => setCartOpen(false)}>
              <Link href="/cart">View cart</Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

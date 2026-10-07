"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, Review } from "@/types";
import { products as seedProducts, reviews as seedReviews } from "@/data/products";

type StoreContextValue = {
  catalog: Product[];
  reviews: Review[];
  productById: (id: string) => Product | undefined;
  productBySlug: (slug: string) => Product | undefined;
  reviewsFor: (productId: string) => Review[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  searchOpen: boolean;
  cartOpen: boolean;
  quickViewSlug: string | null;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setQuickViewSlug: (slug: string | null) => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQty: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  trackView: (productId: string) => void;
  cartCount: number;
  cartSubtotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Product[]>(seedProducts);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  useEffect(() => {
    setCart(readJSON<CartItem[]>("mm-cart", []));
    setWishlist(readJSON<string[]>("mm-wishlist", []));
    setRecentlyViewed(readJSON<string[]>("mm-recent", []));
    setHydrated(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((d: { products?: Product[]; reviews?: Review[] }) => {
        if (d.products?.length) setCatalog(d.products);
        if (d.reviews) setReviews(d.reviews);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("mm-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("mm-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("mm-recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, hydrated]);

  const productById = useCallback((id: string) => catalog.find((p) => p.id === id), [catalog]);
  const productBySlug = useCallback((slug: string) => catalog.find((p) => p.slug === slug), [catalog]);
  const reviewsFor = useCallback((productId: string) => reviews.filter((r) => r.productId === productId), [reviews]);

  const addToCart = useCallback((productId: string, variantId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variantId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, variantId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
        : prev.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i,
          ),
    );
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const trackView = useCallback((productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = catalog.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      return sum + (variant?.price ?? 0) * item.quantity;
    }, 0);
  }, [cart, catalog]);

  const value = useMemo(
    () => ({
      catalog,
      reviews,
      productById,
      productBySlug,
      reviewsFor,
      cart,
      wishlist,
      recentlyViewed,
      searchOpen,
      cartOpen,
      quickViewSlug,
      setSearchOpen,
      setCartOpen,
      setQuickViewSlug,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      trackView,
      cartCount,
      cartSubtotal,
    }),
    [
      catalog,
      reviews,
      productById,
      productBySlug,
      reviewsFor,
      cart,
      wishlist,
      recentlyViewed,
      searchOpen,
      cartOpen,
      quickViewSlug,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      trackView,
      cartCount,
      cartSubtotal,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

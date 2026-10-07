"use client";

import { useStore } from "@/lib/store";

export function useWishlist() {
  const { wishlist, toggleWishlist, isWishlisted } = useStore();
  return { wishlist, toggleWishlist, isWishlisted };
}

"use client";

import { useStore } from "@/lib/store";

export function useRecentlyViewed() {
  const { recentlyViewed, trackView } = useStore();
  return { recentlyViewed, trackView };
}

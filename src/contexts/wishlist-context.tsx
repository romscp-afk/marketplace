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
import type { Product } from "@/types";
import { analytics } from "@/lib/analytics";

const WISHLIST_STORAGE_KEY = "marketplace_wishlist";

interface WishlistContextValue {
  productIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        // Hydrate from localStorage after mount to avoid SSR mismatch
        // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only hydration
        setProductIds(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
    } catch {
      // Ignore storage errors
    }
  }, [productIds]);

  const isInWishlist = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const toggleWishlist = useCallback((product: Product) => {
    setProductIds((prev) => {
      const exists = prev.includes(product.id);
      analytics.wishlistAction(product.id, exists ? "remove" : "add");
      return exists
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setProductIds((prev) => prev.filter((id) => id !== productId));
    analytics.wishlistAction(productId, "remove");
  }, []);

  const clearWishlist = useCallback(() => {
    setProductIds([]);
  }, []);

  const value = useMemo(
    () => ({
      productIds,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [productIds, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

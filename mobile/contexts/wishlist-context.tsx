import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { WISHLIST_STORAGE_KEY } from "@/lib/storage-keys";

interface WishlistContextValue {
  productIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(WISHLIST_STORAGE_KEY)
      .then((stored) => {
        if (stored) setProductIds(JSON.parse(stored));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds)).catch(
      () => undefined,
    );
  }, [productIds]);

  const isInWishlist = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const toggleWishlist = useCallback((product: Product) => {
    setProductIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id],
    );
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setProductIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const value = useMemo(
    () => ({ productIds, isInWishlist, toggleWishlist, removeFromWishlist }),
    [productIds, isInWishlist, toggleWishlist, removeFromWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

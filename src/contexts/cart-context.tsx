"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductVariant } from "@/types";
import { generateId } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const CART_STORAGE_KEY = "marketplace_cart";
const RECENT_SEARCHES_KEY = "marketplace_recent_searches";
const RECENTLY_VIEWED_KEY = "marketplace_recently_viewed";

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant?: ProductVariant; quantity: number }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UPDATE_QUANTITY"; itemId: string; quantity: number }
  | { type: "SAVE_FOR_LATER"; itemId: string }
  | { type: "MOVE_TO_CART"; itemId: string }
  | { type: "UNDO_REMOVE"; item: CartItem }
  | { type: "APPLY_COUPON"; code: string; discount: number }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; state: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.product.id &&
          item.variantId === action.variant?.id,
      );

      if (existingIndex >= 0) {
        const items = [...state.items];
        const existing = items[existingIndex]!;
        items[existingIndex] = {
          ...existing,
          quantity: existing.quantity + action.quantity,
        };
        return { ...state, items };
      }

      const newItem: CartItem = {
        id: generateId(),
        productId: action.product.id,
        variantId: action.variant?.id,
        quantity: action.quantity,
        product: action.product,
        selectedVariant: action.variant,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.itemId),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };

    case "SAVE_FOR_LATER":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, savedForLater: true } : item,
        ),
      };

    case "MOVE_TO_CART":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, savedForLater: false } : item,
        ),
      };

    case "UNDO_REMOVE":
      return { ...state, items: [...state.items, action.item] };

    case "APPLY_COUPON":
      return {
        ...state,
        couponCode: action.code,
        discount: action.discount,
      };

    case "REMOVE_COUPON":
      return { ...state, couponCode: undefined, discount: 0 };

    case "CLEAR_CART":
      return { items: [], discount: 0 };

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  activeItems: CartItem[];
  savedItems: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => CartItem | undefined;
  undoRemove: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  saveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 0.1,
  SAVE15: 0.15,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", state: JSON.parse(stored) });
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const activeItems = useMemo(
    () => state.items.filter((item) => !item.savedForLater),
    [state.items],
  );

  const savedItems = useMemo(
    () => state.items.filter((item) => item.savedForLater),
    [state.items],
  );

  const itemCount = useMemo(
    () => activeItems.reduce((sum, item) => sum + item.quantity, 0),
    [activeItems],
  );

  const subtotal = useMemo(
    () =>
      activeItems.reduce((sum, item) => {
        const price =
          item.selectedVariant?.price ?? item.product.price;
        return sum + price * item.quantity;
      }, 0),
    [activeItems],
  );

  const addItem = useCallback(
    (product: Product, variant?: ProductVariant, quantity = 1) => {
      dispatch({ type: "ADD_ITEM", product, variant, quantity });
      analytics.addToCart(product.id, quantity);
    },
    [],
  );

  const removeItem = useCallback((itemId: string) => {
    const item = state.items.find((i) => i.id === itemId);
    dispatch({ type: "REMOVE_ITEM", itemId });
    if (item) analytics.removeFromCart(item.productId);
    return item;
  }, [state.items]);

  const undoRemove = useCallback((item: CartItem) => {
    dispatch({ type: "UNDO_REMOVE", item });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) return;
    dispatch({ type: "UPDATE_QUANTITY", itemId, quantity });
  }, []);

  const saveForLater = useCallback((itemId: string) => {
    dispatch({ type: "SAVE_FOR_LATER", itemId });
  }, []);

  const moveToCart = useCallback((itemId: string) => {
    dispatch({ type: "MOVE_TO_CART", itemId });
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const rate = VALID_COUPONS[code.toUpperCase()];
      if (!rate) return false;
      dispatch({
        type: "APPLY_COUPON",
        code: code.toUpperCase(),
        discount: subtotal * rate,
      });
      return true;
    },
    [subtotal],
  );

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo(
    () => ({
      items: state.items,
      activeItems,
      savedItems,
      itemCount,
      subtotal,
      discount: state.discount,
      couponCode: state.couponCode,
      addItem,
      removeItem,
      undoRemove,
      updateQuantity,
      saveForLater,
      moveToCart,
      applyCoupon,
      removeCoupon,
      clearCart,
    }),
    [
      state,
      activeItems,
      savedItems,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      undoRemove,
      updateQuantity,
      saveForLater,
      moveToCart,
      applyCoupon,
      removeCoupon,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useRecentSearches() {
  const getRecent = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);

  const addRecent = useCallback((query: string) => {
    if (!query.trim()) return;
    const recent = getRecent().filter((q) => q !== query);
    recent.unshift(query);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, 5)),
    );
  }, [getRecent]);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  return { getRecent, addRecent, clearRecent };
}

export function useRecentlyViewed() {
  const getRecentlyViewed = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);

  const addRecentlyViewed = useCallback(
    (productId: string) => {
      const recent = getRecentlyViewed().filter((id) => id !== productId);
      recent.unshift(productId);
      localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(recent.slice(0, 10)),
      );
    },
    [getRecentlyViewed],
  );

  return { getRecentlyViewed, addRecentlyViewed };
}

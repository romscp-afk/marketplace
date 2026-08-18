import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductVariant } from "@/lib/types";
import { generateId } from "@/lib/format";
import { CART_STORAGE_KEY } from "@/lib/storage-keys";

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant?: ProductVariant; quantity: number }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UPDATE_QUANTITY"; itemId: string; quantity: number }
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

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: generateId(),
            productId: action.product.id,
            variantId: action.variant?.id,
            quantity: action.quantity,
            product: action.product,
            selectedVariant: action.variant,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.id !== action.itemId) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, quantity: action.quantity } : item,
        ),
      };
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
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], discount: 0 });

  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY)
      .then((stored) => {
        if (stored) dispatch({ type: "HYDRATE", state: JSON.parse(stored) });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state]);

  const activeItems = useMemo(
    () => state.items.filter((item) => !item.savedForLater),
    [state.items],
  );

  const itemCount = useMemo(
    () => activeItems.reduce((sum, item) => sum + item.quantity, 0),
    [activeItems],
  );

  const subtotal = useMemo(
    () =>
      activeItems.reduce((sum, item) => {
        const price = item.selectedVariant?.price ?? item.product.price;
        return sum + price * item.quantity;
      }, 0),
    [activeItems],
  );

  const addItem = useCallback(
    (product: Product, variant?: ProductVariant, quantity = 1) => {
      dispatch({ type: "ADD_ITEM", product, variant, quantity });
    },
    [],
  );

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) return;
    dispatch({ type: "UPDATE_QUANTITY", itemId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo(
    () => ({
      items: activeItems,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [activeItems, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

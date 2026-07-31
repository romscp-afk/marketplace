"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartFeedback {
  message: string;
  productTitle: string;
}

interface CartFeedbackContextValue {
  showAddedToCart: (productTitle: string) => void;
}

const CartFeedbackContext = createContext<CartFeedbackContextValue | null>(null);

export function CartFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<CartFeedback | null>(null);

  const showAddedToCart = useCallback((productTitle: string) => {
    setFeedback({
      message: "Added to cart",
      productTitle,
    });
    window.setTimeout(() => setFeedback(null), 4000);
  }, []);

  return (
    <CartFeedbackContext.Provider value={{ showAddedToCart }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed right-4 bottom-20 z-50 md:bottom-6"
      >
        {feedback ? (
          <div
            role="status"
            className={cn(
              "pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border border-border",
              "bg-surface p-4 shadow-lg",
            )}
          >
            <div className="bg-success/10 text-success flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Check className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{feedback.message}</p>
              <p className="text-muted line-clamp-2 text-xs">{feedback.productTitle}</p>
              <Link
                href="/cart"
                className="text-primary mt-2 inline-block text-xs font-medium hover:underline"
              >
                View cart
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-muted hover:text-foreground shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </CartFeedbackContext.Provider>
  );
}

export function useCartFeedback() {
  const ctx = useContext(CartFeedbackContext);
  if (!ctx) {
    throw new Error("useCartFeedback must be used within CartFeedbackProvider");
  }
  return ctx;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductVariant } from "@/types";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCartFeedback } from "@/components/commerce/cart-feedback";
import { Button } from "@/components/ui/button";
import { trackPwaEngagement } from "@/components/pwa/install-prompt";
import { clamp } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showAddedToCart } = useCartFeedback();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const availableStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = availableStock === 0;
  const needsVariantSelection = hasVariants && !selectedVariant;
  const canPurchase = !isOutOfStock && !needsVariantSelection;

  const variantAttributes = hasVariants
    ? [...new Set(product.variants!.flatMap((v) => Object.keys(v.attributes)))]
    : [];

  const handleAddToCart = () => {
    if (!canPurchase || adding) return;
    setAdding(true);
    addItem(product, selectedVariant, quantity);
    showAddedToCart(product.title);
    trackPwaEngagement();
    window.setTimeout(() => setAdding(false), 600);
  };

  const handleBuyNow = () => {
    if (!canPurchase) return;
    addItem(product, selectedVariant, quantity);
    trackPwaEngagement();
    router.push("/checkout");
  };

  return (
    <div className="mt-6 space-y-4">
      {hasVariants
        ? variantAttributes.map((attr) => {
            const values = [
              ...new Set(
                product.variants!.map((v) => v.attributes[attr]).filter(Boolean),
              ),
            ];
            return (
              <div key={attr}>
                <p className="mb-2 text-sm font-medium capitalize">{attr}</p>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const matchingVariant = product.variants!.find(
                      (v) => v.attributes[attr] === value,
                    );
                    const isSelected =
                      selectedVariant?.attributes[attr] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedVariant(matchingVariant)}
                        disabled={matchingVariant?.stock === 0}
                        className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        } ${matchingVariant?.stock === 0 ? "cursor-not-allowed opacity-50 line-through" : ""}`}
                        aria-pressed={isSelected}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        : null}

      <div>
        <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => clamp(q - 1, 1, availableStock))}
            disabled={quantity <= 1}
            className="border-border flex h-11 w-11 items-center justify-center rounded-lg border text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            max={availableStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(clamp(Number(e.target.value), 1, availableStock))
            }
            className="border-border h-11 w-16 rounded-lg border text-center text-sm"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => clamp(q + 1, 1, availableStock))}
            disabled={quantity >= availableStock}
            className="border-border flex h-11 w-11 items-center justify-center rounded-lg border text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          fullWidth
          variant="accent"
          onClick={handleAddToCart}
          disabled={!canPurchase || adding}
          isLoading={adding}
        >
          Add to Cart
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={handleBuyNow}
          disabled={!canPurchase}
        >
          Buy Now
        </Button>
        <Button
          variant="secondary"
          onClick={() => toggleWishlist(product)}
          aria-label={
            isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isInWishlist(product.id)}
        >
          {isInWishlist(product.id) ? "♥ Saved" : "♡ Save"}
        </Button>
      </div>

      {needsVariantSelection ? (
        <p className="text-warning text-sm" role="status">
          Please select all options before adding to cart.
        </p>
      ) : null}
    </div>
  );
}

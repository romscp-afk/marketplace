"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { brand } from "@/config/brand";
import { formatCurrency, clamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MobileCartView } from "@/components/marketplace/mobile-cart-view";

export default function CartPage() {
  const {
    activeItems,
    savedItems,
    subtotal,
    discount,
    couponCode,
    itemCount,
    updateQuantity,
    removeItem,
    undoRemove,
    saveForLater,
    moveToCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [removedItem, setRemovedItem] = useState<ReturnType<typeof removeItem>>(undefined);

  const deliveryFee =
    subtotal >= brand.delivery.freeShippingThreshold ? 0 : brand.delivery.defaultFee;
  const total = subtotal - discount + deliveryFee;

  const groupedBySeller = activeItems.reduce(
    (acc, item) => {
      const sellerId = item.product.sellerId;
      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId]!.push(item);
      return acc;
    },
    {} as Record<string, typeof activeItems>,
  );

  const handleRemove = (itemId: string) => {
    const item = removeItem(itemId);
    setRemovedItem(item);
    setTimeout(() => setRemovedItem(undefined), 5000);
  };

  const handleCoupon = () => {
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  if (itemCount === 0 && savedItems.length === 0) {
    return (
      <>
        <MobileCartView />
        <div className="hidden md:block">
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="Your cart is empty"
            description="Browse our products and add items to your cart."
            action={{ label: "Continue shopping", href: "/search" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <MobileCartView />
      <div className="mx-auto hidden max-w-7xl px-4 py-8 md:block">
      <h1 className="font-display mb-8 text-2xl font-semibold">
        Shopping cart ({itemCount})
      </h1>

      {removedItem ? (
        <div
          className="bg-primary/5 mb-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm"
          role="status"
        >
          <span>Item removed from cart</span>
          <button
            type="button"
            onClick={() => {
              undoRemove(removedItem);
              setRemovedItem(undefined);
            }}
            className="text-primary font-medium hover:underline"
          >
            Undo
          </button>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {Object.entries(groupedBySeller).map(([sellerId, items]) => (
            <div key={sellerId} className="bg-surface rounded-xl border border-border p-4">
              <p className="mb-4 text-sm font-semibold">
                Sold by {items[0]!.product.seller.storeName}
              </p>
              <div className="space-y-4">
                {items.map((item) => {
                  const price =
                    item.selectedVariant?.price ?? item.product.price;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                      >
                        <Image
                          src={item.product.images[0] ?? "/images/placeholder-product.svg"}
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {item.product.title}
                        </Link>
                        {item.selectedVariant ? (
                          <p className="text-muted text-xs">
                            {item.selectedVariant.name}
                          </p>
                        ) : null}
                        <p className="mt-auto text-sm font-semibold">
                          {formatCurrency(price * item.quantity)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, clamp(item.quantity - 1, 1, 99))
                            }
                            className="border-border flex h-8 w-8 items-center justify-center rounded border"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, clamp(item.quantity + 1, 1, 99))
                            }
                            className="border-border flex h-8 w-8 items-center justify-center rounded border"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => saveForLater(item.id)}
                            className="text-muted ml-auto text-xs hover:text-primary"
                          >
                            Save for later
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-muted hover:text-error"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {savedItems.length > 0 ? (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h2 className="mb-4 text-sm font-semibold">Saved for later</h2>
              {savedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <span className="text-sm">{item.product.title}</span>
                  <button
                    type="button"
                    onClick={() => moveToCart(item.id)}
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Move to cart
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Order summary */}
        <div className="bg-surface h-fit rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-success">
                <span>Discount ({couponCode})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span>
                {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="border-border flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium">
              Coupon code
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter code"
                className="border-border h-10 flex-1 rounded-lg border px-3 text-sm"
              />
              <Button size="sm" variant="secondary" onClick={handleCoupon}>
                Apply
              </Button>
            </div>
            {couponError ? (
              <p className="text-error mt-1 text-xs" role="alert">
                {couponError}
              </p>
            ) : null}
            {couponCode ? (
              <button
                type="button"
                onClick={removeCoupon}
                className="text-muted mt-1 text-xs hover:text-primary"
              >
                Remove coupon
              </button>
            ) : null}
            <p className="text-muted mt-1 text-xs">
              Try: WELCOME10 or SAVE15
            </p>
          </div>

          <Link
            href="/checkout"
            className="bg-cart hover:bg-cart/90 mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg text-base font-medium text-white transition-colors"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/search"
            className="text-primary mt-3 block text-center text-sm font-medium hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

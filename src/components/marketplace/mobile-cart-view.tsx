"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckSquare, ChevronRight, ShoppingCart, Store, Ticket, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { brand } from "@/config/brand";
import { formatCurrency, clamp } from "@/lib/utils";

export function MobileCartView() {
  const { activeItems, itemCount, subtotal, updateQuantity, removeItem } = useCart();

  const groupedBySeller = activeItems.reduce(
    (acc, item) => {
      const sellerId = item.product.sellerId;
      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId]!.push(item);
      return acc;
    },
    {} as Record<string, typeof activeItems>,
  );

  if (itemCount === 0) {
    return (
      <div className="bg-background flex min-h-[60vh] flex-col items-center justify-center px-6 md:hidden">
        <ShoppingCart className="text-border h-16 w-16" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-foreground">Your cart is empty</p>
        <p className="text-muted mt-2 text-center text-sm">
          Add items to enjoy free shipping deals!
        </p>
        <Link
          href="/"
          className="bg-header mt-5 rounded px-8 py-3 text-sm font-bold text-white"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  const deliveryFee =
    subtotal >= brand.delivery.freeShippingThreshold ? 0 : brand.delivery.defaultFee;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-background pb-36 md:hidden">
      <div className="bg-header px-3 py-3 md:hidden">
        <h1 className="text-base font-bold text-white">Shopping Cart</h1>
      </div>

      <div className="bg-surface border-border flex items-center gap-2 border-b px-3.5 py-3.5">
        <Ticket className="text-primary h-[18px] w-[18px]" aria-hidden="true" />
        <span className="flex-1 text-sm text-foreground">Select or enter voucher</span>
        <ChevronRight className="text-muted h-4 w-4" aria-hidden="true" />
      </div>

      {Object.entries(groupedBySeller).map(([sellerId, items]) => (
        <div key={sellerId} className="bg-surface mt-2">
          <div className="border-border flex items-center gap-2 border-b px-3 py-3">
            <Store className="text-foreground h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-bold text-foreground">
              {items[0]!.product.seller.storeName}
            </span>
          </div>
          {items.map((item) => {
            const price = item.selectedVariant?.price ?? item.product.price;
            return (
              <div
                key={item.id}
                className="border-border flex border-b px-3 py-3 last:border-b-0"
              >
                <CheckSquare className="text-primary mt-7 mr-2 h-5 w-5 shrink-0" aria-hidden="true" />
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded"
                >
                  <Image
                    src={item.product.images[0] ?? "/images/placeholder-product.svg"}
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="ml-2.5 flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="line-clamp-2 text-[13px] leading-snug text-foreground"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-price mt-1.5 text-base font-bold">
                    {formatCurrency(price, item.product.currency)}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, clamp(item.quantity - 1, 1, 99))
                      }
                      className="border-border flex h-7 w-7 items-center justify-center rounded-sm border text-base"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, clamp(item.quantity + 1, 1, 99))
                      }
                      className="border-border flex h-7 w-7 items-center justify-center rounded-sm border text-base"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted ml-auto"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="bg-surface border-border fixed right-0 bottom-14 left-0 z-30 border-t p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-primary h-5 w-5" aria-hidden="true" />
            <span className="text-[13px] text-foreground">Select All ({itemCount})</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] text-muted">Total:</span>
            <span className="text-price text-xl font-extrabold">{formatCurrency(total)}</span>
          </div>
        </div>
        {deliveryFee === 0 ? (
          <p className="text-success mt-1.5 text-xs">🎉 You qualify for free shipping!</p>
        ) : (
          <p className="text-success mt-1.5 text-xs">
            Add {formatCurrency(brand.delivery.freeShippingThreshold - subtotal)} more for free
            shipping
          </p>
        )}
        <Link
          href="/checkout"
          className="bg-cart mt-2.5 flex h-12 items-center justify-center rounded text-base font-extrabold text-white"
        >
          Check Out ({itemCount})
        </Link>
      </div>
    </div>
  );
}

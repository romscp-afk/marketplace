"use client";

import Link from "next/link";
import { Heart, XCircle } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { MobilePageHeader } from "@/components/marketplace/mobile-page-header";

interface MobileWishlistViewProps {
  products: Product[];
  isInWishlist: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export function MobileWishlistView({
  products,
  isInWishlist,
  onToggleWishlist,
  onRemove,
}: MobileWishlistViewProps) {
  if (products.length === 0) {
    return (
      <div className="bg-background md:hidden">
        <MobilePageHeader title="My Likes" />
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
          <Heart className="text-border h-16 w-16" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold text-foreground">No liked items yet</p>
          <p className="text-muted mt-2 text-center text-sm">
            Tap ♡ on products to save them here
          </p>
          <Link
            href="/"
            className="bg-header mt-5 rounded px-6 py-3 text-sm font-bold text-white"
          >
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background md:hidden">
      <MobilePageHeader title="My Likes" />
      <div className="grid grid-cols-2 gap-0 px-1 py-1 pb-4">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              isInWishlist={isInWishlist(product.id)}
              onAddToWishlist={() => onToggleWishlist(product)}
            />
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="absolute top-2 right-3 z-10"
              aria-label="Remove from wishlist"
            >
              <XCircle className="text-muted h-[22px] w-[22px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

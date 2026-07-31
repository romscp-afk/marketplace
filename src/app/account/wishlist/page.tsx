"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { seedProducts } from "@/data/seed";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";

export default function WishlistPage() {
  const { productIds, isInWishlist, toggleWishlist } = useWishlist();

  const wishlistProducts = seedProducts.filter((p) => productIds.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-12 w-12" />}
        title="Your wishlist is empty"
        description="Save items you love and come back to them later."
        action={{ label: "Browse products", href: "/search" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display mb-8 text-2xl font-semibold">
        Wishlist ({wishlistProducts.length})
      </h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isInWishlist={isInWishlist(product.id)}
            onAddToWishlist={() => toggleWishlist(product)}
          />
        ))}
      </div>
    </div>
  );
}

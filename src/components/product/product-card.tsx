import Link from "next/link";
import type { Product } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";
import {
  discountPercent,
  formatSoldCount,
  showFreeShippingBadge,
} from "@/lib/marketplace/helpers";

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  className?: string;
  priority?: boolean;
  variant?: "grid" | "flash";
  featured?: boolean;
}

export function ProductCard({
  product,
  onAddToWishlist,
  isInWishlist = false,
  className,
  priority = false,
  variant = "grid",
  featured = false,
}: ProductCardProps) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const isFlash = variant === "flash";
  const currencyPrefix = product.currency === "SGD" ? "S$" : "$";

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-surface",
        isFlash ? "overflow-hidden rounded border border-border" : "m-1",
        className,
      )}
      aria-label={product.title}
    >
      <div className="relative aspect-square bg-background">
        <Link href={`/products/${product.slug}`} className="block h-full" aria-label={product.title}>
          <SafeImage
            src={product.images[0] ?? "/images/placeholder-product.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
            priority={priority}
          />
        </Link>

        {discount ? (
          <span className="absolute top-0 right-0 bg-discount px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        ) : null}

        {featured || product.seller.isVerified ? (
          <span className="absolute bottom-0 left-0 bg-featured px-1.5 py-0.5 text-[9px] font-bold text-white">
            Featured
          </span>
        ) : null}

        {onAddToWishlist ? (
          <button
            type="button"
            onClick={() => onAddToWishlist(product.id)}
            className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-xs"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
          >
            <span className={isInWishlist ? "text-discount" : undefined} aria-hidden="true">
              {isInWishlist ? "♥" : "♡"}
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-2">
        {!isFlash ? (
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 min-h-[34px] text-[13px] leading-snug text-product-title"
          >
            {product.title}
          </Link>
        ) : null}

        <div className="mt-1 flex items-start gap-0.5">
          <span className="mt-0.5 text-xs font-semibold text-price">{currencyPrefix}</span>
          <span className="text-lg font-bold text-price">
            {product.price.toFixed(product.price % 1 === 0 ? 0 : 2)}
          </span>
        </div>

        {!isFlash && product.compareAtPrice && product.compareAtPrice > product.price ? (
          <span className="text-[11px] text-discount line-through">
            {formatCurrency(product.compareAtPrice, product.currency)}
          </span>
        ) : null}

        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
          <span className="text-muted">★ {product.rating.toFixed(1)}</span>
          <span className="text-muted/80">{formatSoldCount(product.reviewCount)}</span>
        </div>

        {showFreeShippingBadge(product.price, product.deliveryFee) ? (
          <span className="mt-1.5 self-start rounded border border-success/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
            Free Shipping
          </span>
        ) : null}
      </div>
    </article>
  );
}

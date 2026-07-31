import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  onAddToWishlist,
  isInWishlist = false,
  className,
  priority = false,
}: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100,
      )
    : 0;

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      aria-label={product.title}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full"
          aria-label={`View ${product.title}`}
        >
          <SafeImage
            src={product.images[0] ?? "/images/placeholder-product.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </Link>

        {hasDiscount ? (
          <Badge variant="promotional" className="absolute top-2 left-2">
            -{discountPercent}%
          </Badge>
        ) : null}

        {product.stock === 0 ? (
          <Badge variant="default" className="absolute top-2 right-2">
            Out of stock
          </Badge>
        ) : null}

        {onAddToWishlist ? (
          <button
            type="button"
            onClick={() => onAddToWishlist(product.id)}
            className={cn(
              "absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full",
              "bg-surface/90 shadow-sm backdrop-blur-sm transition-colors",
              "hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary",
              isInWishlist && "text-promotional",
            )}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={isInWishlist}
          >
            <span aria-hidden="true">{isInWishlist ? "♥" : "♡"}</span>
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm leading-snug font-medium text-foreground hover:text-primary"
        >
          {product.title}
        </Link>

        <Link
          href={`/sellers/${product.seller.slug}`}
          className="text-muted text-xs hover:text-primary"
        >
          {product.seller.storeName}
        </Link>

        <Rating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-foreground text-base font-semibold">
            {formatCurrency(product.price, product.currency)}
          </span>
          {hasDiscount ? (
            <span className="text-muted text-sm line-through">
              {formatCurrency(product.compareAtPrice!, product.currency)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

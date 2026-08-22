import Link from "next/link";
import type { Product } from "@/types";
import { SafeImage } from "@/components/ui/safe-image";
import { formatCurrency } from "@/lib/utils";

interface YouMayLikeProps {
  products: Product[];
}

export function YouMayLike({ products }: YouMayLikeProps) {
  const items = products.slice(0, 5);

  return (
    <aside
      className="bg-surface flex w-[220px] shrink-0 flex-col overflow-hidden rounded-sm border border-border"
      aria-label="You may like"
    >
      <div className="border-b border-border px-3 py-2.5">
        <h2 className="text-sm font-bold text-foreground">You May Like</h2>
      </div>

      <ul className="flex-1 divide-y divide-border">
        {items.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.slug}`}
              className="hover:bg-background flex gap-2.5 px-3 py-2.5 transition-colors"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-background">
                <SafeImage
                  src={product.images[0] ?? "/images/placeholder-product.svg"}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs leading-snug text-foreground">
                  {product.title}
                </p>
                <p className="text-price mt-1 text-xs font-semibold">
                  {formatCurrency(product.price, product.currency)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-border p-3">
        <p className="text-muted mb-2 text-[11px] leading-snug">
          Can&apos;t find what you need?
        </p>
        <Link
          href="/sell"
          className="bg-header hover:bg-primary-dark block rounded-sm py-2 text-center text-xs font-semibold text-white transition-colors"
        >
          Become a Supplier
        </Link>
      </div>
    </aside>
  );
}

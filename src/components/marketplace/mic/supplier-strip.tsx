import Link from "next/link";
import type { Seller } from "@/types";
import { SafeImage } from "@/components/ui/safe-image";
import { Star } from "lucide-react";

interface SupplierStripProps {
  sellers: Seller[];
}

export function SupplierStrip({ sellers }: SupplierStripProps) {
  if (sellers.length === 0) return null;

  return (
    <section
      className="bg-surface rounded-sm border border-border px-4 py-4"
      aria-label="Featured suppliers"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Featured Suppliers</h2>
        <Link href="/sellers" className="text-primary text-xs font-medium hover:underline">
          All suppliers ›
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {sellers.slice(0, 5).map((seller) => (
          <Link
            key={seller.id}
            href={`/sellers/${seller.slug}`}
            className="hover:border-primary/40 flex items-center gap-2.5 rounded-sm border border-border px-2.5 py-2 transition-colors"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-background">
              <SafeImage
                src={seller.logoUrl ?? "/images/placeholder-product.svg"}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {seller.storeName}
              </p>
              <p className="text-muted flex items-center gap-0.5 text-[10px]">
                <Star className="text-warning h-2.5 w-2.5 fill-current" aria-hidden="true" />
                {seller.rating.toFixed(1)} · {seller.productCount} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

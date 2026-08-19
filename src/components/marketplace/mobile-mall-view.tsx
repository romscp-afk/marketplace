"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { MarketplaceSearchBar } from "@/components/marketplace/search-bar";
import { marketplaceUi } from "@/config/marketplace-ui";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Top Sales", value: "popularity" },
  { label: "Latest", value: "newest" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  { label: "Rating", value: "rating" },
];

interface MobileMallViewProps {
  query: string;
  sort: string;
  total: number;
  products: Product[];
  isInWishlist: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
}

export function MobileMallView({
  query,
  sort,
  total,
  products,
  isInWishlist,
  onToggleWishlist,
}: MobileMallViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showTrending = !query.trim();

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  };

  const setQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-background min-h-full md:hidden">
      <div className="bg-header px-3 pt-2 pb-2.5">
        <MarketplaceSearchBar value={query} onChange={setQuery} />
      </div>

      {showTrending ? (
        <div className="bg-surface border-b border-border p-3">
          <p className="mb-2 text-[13px] font-bold text-foreground">Trending Searches</p>
          <div className="flex flex-wrap gap-2">
            {marketplaceUi.trendingSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="bg-primary/10 flex items-center gap-1 rounded px-2.5 py-1.5"
              >
                <TrendingUp className="text-primary h-3 w-3" aria-hidden="true" />
                <span className="text-xs text-foreground">{term}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="bg-surface flex items-center border-b border-border">
        <div className="flex flex-1 gap-1.5 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={cn(
                "shrink-0 rounded px-3 py-1.5 text-[13px]",
                sort === option.value
                  ? "bg-primary/10 font-bold text-primary"
                  : "bg-background text-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Link
          href={`/search/filters?${searchParams.toString()}`}
          className="border-border flex shrink-0 items-center gap-1 border-l px-3 py-2 text-[13px] text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filter
        </Link>
      </div>

      <p className="bg-surface text-muted px-3 py-2 text-xs">{total} results</p>

      {products.length === 0 ? (
        <p className="text-muted px-6 py-10 text-center text-sm">
          No products found. Try another search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-0 px-1 pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={isInWishlist(product.id)}
              onAddToWishlist={() => onToggleWishlist(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

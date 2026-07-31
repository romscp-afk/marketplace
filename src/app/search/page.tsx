"use client";

import { Suspense, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { searchProducts, getDeals } from "@/data/seed";
import { useWishlist } from "@/contexts/wishlist-context";
import { useRecentSearches } from "@/contexts/cart-context";
import { analytics } from "@/lib/analytics";

function SearchContent() {
  const searchParams = useSearchParams();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addRecent } = useRecentSearches();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? "relevance";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const minRating = searchParams.get("minRating")
    ? Number(searchParams.get("minRating"))
    : undefined;
  const inStock = searchParams.get("inStock") === "true";
  const page = Number(searchParams.get("page") ?? "1");

  const results = useMemo(() => {
    if (sort === "deals" && !query) {
      const deals = getDeals();
      return { data: deals, total: deals.length, page: 1, limit: 12, totalPages: 1 };
    }
    return searchProducts(query, {
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock: inStock || undefined,
      sort,
      page,
      limit: 12,
    });
  }, [query, category, sort, minPrice, maxPrice, minRating, inStock, page]);

  useEffect(() => {
    if (query) {
      analytics.searchSubmitted(query, results.total);
    }
  }, [query, results.total]);

  if (query) addRecent(query);

  const activeFilters = [
    category && { key: "category", label: `Category: ${category}` },
    minPrice && { key: "minPrice", label: `Min: $${minPrice}` },
    maxPrice && { key: "maxPrice", label: `Max: $${maxPrice}` },
    minRating && { key: "minRating", label: `${minRating}+ stars` },
    inStock && { key: "inStock", label: "In stock" },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {query ? `Results for "${query}"` : sort === "deals" ? "Deals" : "All products"}
          </h1>
          <p className="text-muted mt-1 text-sm">
            {results.total} {results.total === 1 ? "product" : "products"} found
          </p>
        </div>
        <Link
          href={`/search/filters?${searchParams.toString()}`}
          className="border-border hover:bg-background flex items-center gap-2 rounded-lg border px-3 py-2 text-sm md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Desktop filters sidebar */}
        <aside className="hidden w-56 shrink-0 md:block" aria-label="Filters">
          <FilterPanel searchParams={searchParams} />
        </aside>

        <div className="flex-1">
          {/* Active filter chips */}
          {activeFilters.length > 0 ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <Badge key={f.key} variant="default">
                  {f.label}
                </Badge>
              ))}
              <Link href="/search" className="text-primary text-xs font-medium">
                Clear all
              </Link>
            </div>
          ) : null}

          {/* Sort */}
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="sort-select" className="text-muted text-sm">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                window.location.href = `/search?${params.toString()}`;
              }}
              className="border-border rounded-lg border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="deals">Deals</option>
            </select>
          </div>

          {results.data.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
              action={{ label: "Browse all products", href: "/search" }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {results.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInWishlist={isInWishlist(product.id)}
                    onAddToWishlist={() => toggleWishlist(product)}
                  />
                ))}
              </div>

              {results.totalPages > 1 ? (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: results.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/search?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(p) }).toString()}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                          p === page
                            ? "bg-primary text-primary-foreground"
                            : "border-border hover:bg-background border"
                        }`}
                        aria-current={p === page ? "page" : undefined}
                      >
                        {p}
                      </Link>
                    ),
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ searchParams }: { searchParams: URLSearchParams }) {
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold">Filters</h2>

      <div>
        <label htmlFor="filter-min-price" className="mb-2 block text-sm font-medium">
          Min price
        </label>
        <input
          id="filter-min-price"
          type="number"
          defaultValue={params.get("minPrice") ?? ""}
          className="border-border h-10 w-full rounded-lg border px-3 text-sm"
          onBlur={(e) => {
            if (e.target.value) params.set("minPrice", e.target.value);
            else params.delete("minPrice");
            window.location.href = `/search?${params.toString()}`;
          }}
        />
      </div>

      <div>
        <label htmlFor="filter-max-price" className="mb-2 block text-sm font-medium">
          Max price
        </label>
        <input
          id="filter-max-price"
          type="number"
          defaultValue={params.get("maxPrice") ?? ""}
          className="border-border h-10 w-full rounded-lg border px-3 text-sm"
          onBlur={(e) => {
            if (e.target.value) params.set("maxPrice", e.target.value);
            else params.delete("maxPrice");
            window.location.href = `/search?${params.toString()}`;
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="filter-in-stock"
          type="checkbox"
          defaultChecked={params.get("inStock") === "true"}
          onChange={(e) => {
            if (e.target.checked) params.set("inStock", "true");
            else params.delete("inStock");
            window.location.href = `/search?${params.toString()}`;
          }}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="filter-in-stock" className="text-sm">
          In stock only
        </label>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

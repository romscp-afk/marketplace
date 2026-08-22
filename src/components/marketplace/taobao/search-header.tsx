"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Gift,
  Percent,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Ticket,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { marketplaceUi } from "@/config/marketplace-ui";
import { navigation } from "@/config/navigation";
import { useCart } from "@/contexts/cart-context";
import { BrandLogo } from "@/components/brand/brand-logo";

const promoIcons: { icon: LucideIcon; label: string; href: string; color: string }[] = [
  { icon: Zap, label: "Flash Sale", href: "/search?sort=deals", color: "text-primary" },
  { icon: Ticket, label: "Vouchers", href: "/search?sort=deals", color: "text-promotional" },
  { icon: Truck, label: "Free Ship", href: "/search", color: "text-cart" },
  { icon: Store, label: "Brand Mall", href: "/search", color: "text-featured" },
  { icon: Tag, label: "Deals", href: "/search?sort=deals", color: "text-warning" },
  { icon: Gift, label: "Gift Ideas", href: "/search", color: "text-primary" },
  { icon: Percent, label: "Clearance", href: "/search?sort=deals", color: "text-discount" },
  { icon: Sparkles, label: "New In", href: "/search?sort=newest", color: "text-cart" },
];

export function TaobaoSearchHeader() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header className="bg-surface border-b border-border">
      <div className="mx-auto max-w-[1200px] px-3 pt-3 pb-0">
        <div className="grid grid-cols-[200px_minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1.5">
          <BrandLogo height={68} priority className="col-start-1 row-start-1 shrink-0 self-center" />

          <form
            onSubmit={handleSearch}
            className="col-start-2 row-start-1 flex min-w-0 self-center"
            role="search"
          >
            <label htmlFor="mic-search" className="sr-only">
              Search products
            </label>
            <div className="border-header flex h-11 min-w-0 w-full overflow-hidden rounded-sm border-2">
              <input
                id="mic-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a keyword to search products"
                className="min-w-0 flex-1 bg-surface px-4 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-header hover:bg-primary-dark shrink-0 px-6 text-sm font-semibold text-white transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="col-start-3 row-start-1 flex shrink-0 items-center gap-4 self-center">
            <Link
              href="/sell"
              className="hover:text-primary flex flex-col items-center gap-0.5 text-foreground transition-colors"
            >
              <Store className="h-5 w-5" aria-hidden="true" />
              <span className="text-[11px]">Supplier</span>
            </Link>
            <Link
              href="/cart"
              className="hover:text-primary relative flex flex-col items-center gap-0.5 text-foreground transition-colors"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="text-[11px]">Cart</span>
              {itemCount > 0 ? (
                <span className="bg-promotional absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </div>

          <div className="col-start-2 row-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 pb-1 text-xs">
            <span className="text-muted">Hot:</span>
            {marketplaceUi.trendingSearches.slice(0, 6).map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="text-muted hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        <nav
          className="mt-2 flex items-center gap-0 border-t border-border"
          aria-label="Categories"
        >
          <Link
            href="/search"
            className="bg-header hover:bg-primary-dark mr-2 flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-semibold text-white transition-colors"
          >
            All Categories
          </Link>
          {navigation.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-muted hover:text-primary shrink-0 px-3 py-2 text-sm transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/sellers"
            className="text-muted hover:text-primary ml-auto shrink-0 px-3 py-2 text-sm transition-colors"
          >
            Suppliers
          </Link>
          <Link
            href="/account/login"
            className="text-muted hover:text-primary shrink-0 px-3 py-2 text-sm transition-colors"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function TaobaoPromoGrid() {
  return (
    <div className="bg-surface border-y border-border py-3">
      <div className="mx-auto grid max-w-[1200px] grid-cols-4 gap-1 px-3 sm:grid-cols-8">
        {promoIcons.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="hover:bg-background flex flex-col items-center gap-1 rounded px-2 py-2 transition-colors"
            >
              <Icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
              <span className="text-center text-[11px] text-foreground">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

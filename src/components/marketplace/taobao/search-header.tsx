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
    <header className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-3">
        <div className="flex items-center gap-6">
          <BrandLogo height={36} priority />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <form onSubmit={handleSearch} className="flex" role="search">
              <label htmlFor="taobao-search" className="sr-only">
                Search products
              </label>
              <input
                id="taobao-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="border-cart h-10 min-w-0 flex-1 rounded-l border-2 border-r-0 bg-surface px-4 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-cart hover:bg-cart/90 shrink-0 rounded-r px-6 text-sm font-semibold text-white transition-colors"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-muted">Hot:</span>
              {marketplaceUi.trendingSearches.slice(0, 6).map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="text-primary hover:underline"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/cart"
            className="hover:text-primary relative flex shrink-0 flex-col items-center gap-0.5 text-foreground transition-colors"
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs">Cart</span>
            {itemCount > 0 ? (
              <span className="bg-promotional absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </div>

        <nav
          className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Categories"
        >
          {navigation.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-muted hover:text-primary hover:bg-surface shrink-0 rounded px-3 py-1 text-sm transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-primary shrink-0 px-2 text-sm font-medium hover:underline"
          >
            All ›
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function TaobaoPromoGrid() {
  return (
    <div className="bg-surface border-y border-border py-4">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-2 px-4 sm:grid-cols-8">
        {promoIcons.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="hover:bg-background flex flex-col items-center gap-1.5 rounded px-2 py-2 transition-colors"
            >
              <Icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              <span className="text-center text-[11px] text-foreground">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

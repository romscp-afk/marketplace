"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  MapPin,
  X,
} from "lucide-react";
import { brand } from "@/config/brand";
import { navigation } from "@/config/navigation";
import { useCart } from "@/contexts/cart-context";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-surface sticky top-0 z-40 border-b border-border">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            className="touch-target flex items-center justify-center lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <BrandLogo height={44} className="shrink-0 self-center" />

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="mx-4 hidden max-w-xl flex-1 self-center lg:flex"
            role="search"
          >
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <div className="relative w-full">
              <Search
                className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, sellers..."
                className="border-border focus-visible:ring-primary h-11 w-full rounded-full border bg-background pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="touch-target flex items-center justify-center lg:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="text-muted hover:text-foreground hidden items-center gap-1 px-2 text-xs sm:flex"
              aria-label="Delivery location"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{brand.locale.countryName}</span>
            </button>

            <Link
              href="/account"
              className="touch-target flex items-center justify-center"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href="/account/wishlist"
              className="touch-target hidden items-center justify-center sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="touch-target relative flex items-center justify-center"
              aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="bg-promotional absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* Category nav - desktop */}
        <nav
          className="scrollbar-hide hidden items-center gap-1 overflow-x-auto border-t border-border py-2 lg:flex"
          aria-label="Categories"
        >
          {navigation.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-muted hover:text-primary hover:bg-background shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile search overlay */}
      {searchOpen ? (
        <div className="bg-surface fixed inset-0 z-50 p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1" role="search">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-search"
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="border-border h-11 w-full rounded-lg border px-4 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              />
            </form>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="touch-target flex items-center justify-center"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile menu drawer */}
      {mobileMenuOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="bg-surface fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto p-4 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo height={28} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              {navigation.categories.map((cat) => (
                <div key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:bg-background block rounded-lg px-3 py-2.5 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  {cat.children ? (
                    <div className="ml-3 space-y-0.5">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="text-muted hover:text-foreground block rounded-lg px-3 py-2 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}

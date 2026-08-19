"use client";

import Link from "next/link";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { MarketplaceSearchBar } from "@/components/marketplace/search-bar";
import { BrandLogo } from "@/components/brand/brand-logo";

export function MarketplaceHomeHeader() {
  const { itemCount } = useCart();

  return (
    <div className="bg-header px-3 pt-2 pb-2.5 md:hidden">
      <div className="mb-2.5 flex items-center justify-between">
        <BrandLogo onDark height={26} priority />
        <div className="flex items-center gap-4 text-white">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 ? (
              <span className="bg-promotional absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <MarketplaceSearchBar readOnly />
    </div>
  );
}

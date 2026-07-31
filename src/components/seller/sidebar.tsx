"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/config/brand";
import { sellerNavigation, type SellerNavItem } from "@/config/seller-navigation";
import { cn } from "@/lib/utils";

interface SellerSidebarProps {
  items?: SellerNavItem[];
  storeName?: string;
}

export function SellerSidebar({ items = sellerNavigation.main, storeName }: SellerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="space-y-6">
      <div>
        <Link
          href="/"
          className="text-muted hover:text-foreground mb-4 inline-flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to {brand.name}
        </Link>
        <p className="text-muted text-xs font-medium tracking-wide uppercase">Seller portal</p>
        {storeName ? (
          <p className="mt-1 truncate text-sm font-semibold">{storeName}</p>
        ) : null}
      </div>

      <nav aria-label="Seller navigation" className="space-y-0.5">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

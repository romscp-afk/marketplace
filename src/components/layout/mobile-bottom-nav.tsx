"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Bell, User } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { marketplaceUi } from "@/config/marketplace-ui";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  mall: ShoppingBag,
  cart: ShoppingCart,
  noti: Bell,
  me: User,
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const hiddenPaths = ["/checkout", "/seller", "/admin", "/products"];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="bg-surface fixed right-0 bottom-0 left-0 z-40 border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex h-14 items-stretch">
        {marketplaceUi.tabs.map((tab) => {
          const Icon = iconMap[tab.id as keyof typeof iconMap] ?? Home;
          const isActive =
            tab.path === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.path);

          return (
            <li key={tab.id} className="flex flex-1">
              <Link
                href={tab.path}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  isActive ? "text-primary" : "text-muted",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.id === "cart" && itemCount > 0 ? (
                  <span className="bg-primary absolute top-1 right-1/2 flex h-4 min-w-4 translate-x-3 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

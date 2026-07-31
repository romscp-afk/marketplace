"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart, showBadge: true },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const hiddenPaths = ["/checkout", "/seller", "/admin"];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="bg-surface fixed right-0 bottom-0 left-0 z-40 border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex items-stretch">
        {navItems.map(({ href, label, icon: Icon, showBadge }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
                {showBadge && itemCount > 0 ? (
                  <span className="bg-promotional absolute top-1 right-1/2 flex h-4 min-w-4 translate-x-3 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
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

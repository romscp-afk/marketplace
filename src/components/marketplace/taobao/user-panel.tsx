import Link from "next/link";
import {
  Heart,
  HelpCircle,
  Package,
  ShoppingBag,
  Ticket,
  User,
} from "lucide-react";

const tiles = [
  { icon: User, label: "Sign In", href: "/account/login", color: "text-primary" },
  { icon: Package, label: "Orders", href: "/account/orders", color: "text-primary" },
  { icon: Heart, label: "Favorites", href: "/account/wishlist", color: "text-promotional" },
  { icon: Ticket, label: "Vouchers", href: "/search?sort=deals", color: "text-featured" },
  { icon: ShoppingBag, label: "Cart", href: "/cart", color: "text-cart" },
  { icon: HelpCircle, label: "Help", href: "/help", color: "text-muted" },
];

export function UserPanel() {
  return (
    <aside
      className="bg-surface flex h-full w-[240px] shrink-0 flex-col rounded-sm border border-border p-3"
      aria-label="Quick links"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <User className="text-primary h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Hello!</p>
          <Link href="/account/login" className="text-primary text-xs hover:underline">
            Sign in / Register
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="hover:bg-background flex flex-col items-center gap-1 rounded px-1 py-2 text-center transition-colors"
            >
              <Icon className={`h-5 w-5 ${tile.color}`} aria-hidden="true" />
              <span className="text-[11px] text-foreground">{tile.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="bg-primary/5 mt-auto rounded p-3">
        <p className="text-primary text-xs font-semibold">Free delivery</p>
        <p className="text-muted mt-0.5 text-[11px]">On orders over S$70</p>
      </div>
    </aside>
  );
}

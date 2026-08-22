/**
 * Unified marketplace UI — mirrors src/config/marketplace-ui.ts (keep in sync).
 */
import { brand } from "./brand";

const c = brand.theme.colors;

export const marketplaceUi = {
  tabs: [
    { id: "home", label: "Home", path: "/" },
    { id: "mall", label: "Mall", path: "/search" },
    { id: "cart", label: "Cart", path: "/cart" },
    { id: "noti", label: "Noti", path: "/account/wishlist" },
    { id: "me", label: "Me", path: "/account" },
  ],

  quickActions: [
    { id: "flash", label: "Flash Sale", path: "/search?sort=deals", color: c.primary },
    { id: "voucher", label: "Vouchers", path: "/search?sort=deals", color: c.promotional },
    { id: "freeship", label: "Free Shipping", path: "/search", color: c.success },
    { id: "mall", label: "Mall", path: "/search", color: c.featured },
    { id: "deals", label: "Deals", path: "/search?sort=deals", color: c.warning },
  ],

  banners: [
    {
      id: "1",
      title: "Discover More, From A to Z",
      subtitle: "Curated finds from trusted sellers",
      color: c.primary,
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&h=600&q=80",
    },
    {
      id: "2",
      title: "Free Shipping Season",
      subtitle: `Orders over S$${brand.delivery.freeShippingThreshold}`,
      color: c.success,
      image:
        "https://images.unsplash.com/photo-1472851293808-aa7ad37808e7?auto=format&fit=crop&w=1200&h=600&q=80",
    },
    {
      id: "3",
      title: "Beauty & Wellness",
      subtitle: "Skincare, makeup & self-care essentials",
      color: c.featured,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&h=600&q=80",
    },
  ],

  trendingSearches: [
    "fashion",
    "beauty",
    "home",
    "electronics",
    "jewelry",
    "gourmet",
  ],

  colors: {
    primary: c.primary,
    primaryDark: c.primaryDark,
    primaryLight: `${c.primary}18`,
    background: c.background,
    surface: c.surface,
    header: c.header,
    text: c.text,
    productTitle: c.productTitle,
    textSecondary: c.textSecondary,
    textMuted: c.textSecondary,
    border: c.border,
    price: c.price,
    discount: c.discount,
    cartButton: c.cartButton,
    featured: c.featured,
    promotional: c.promotional,
    freeShip: c.success,
    mall: c.featured,
    star: c.warning,
    error: c.error,
  },
} as const;

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatSoldCount(reviewCount: number): string {
  const sold = Math.max(reviewCount * 4 + 12, 1);
  if (sold >= 1000) return `${(sold / 1000).toFixed(1)}k sold`;
  return `${sold} sold`;
}

export function flashSaleEndsAt(): Date {
  const now = new Date();
  const end = new Date(now);
  end.setHours(now.getHours() + 2, 0, 0, 0);
  if (end <= now) end.setHours(end.getHours() + 2);
  return end;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function showFreeShippingBadge(price: number, deliveryFee?: number): boolean {
  return price >= 25 || deliveryFee === 0 || deliveryFee === undefined;
}

/** @deprecated Use marketplaceUi */
export const shopee = marketplaceUi;

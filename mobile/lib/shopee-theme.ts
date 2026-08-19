/**
 * Shopee-inspired mobile marketplace theme.
 * Patterns: orange header, flash-sale countdown, category carousel,
 * discount badges, sold counts, seller-grouped cart, sticky buy bar.
 */
export const shopee = {
  colors: {
    primary: "#EE4D2D",
    primaryDark: "#D73211",
    primaryLight: "#FFF4F0",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#222222",
    textSecondary: "#757575",
    textMuted: "#999999",
    border: "#E8E8E8",
    flashSale: "#EE4D2D",
    voucher: "#FF424F",
    freeShip: "#26AA99",
    mall: "#D0011B",
    star: "#FFCE3D",
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    pill: 999,
  },
  quickActions: [
    { id: "flash", label: "Flash Sale", icon: "flash" as const, color: "#EE4D2D" },
    { id: "voucher", label: "Vouchers", icon: "ticket" as const, color: "#FF424F" },
    { id: "freeship", label: "Free Shipping", icon: "car" as const, color: "#26AA99" },
    { id: "mall", label: "Mall", icon: "storefront" as const, color: "#D0011B" },
    { id: "deals", label: "Deals", icon: "pricetag" as const, color: "#F69113" },
  ],
  trendingSearches: [
    "wireless earbuds",
    "skincare",
    "home decor",
    "running shoes",
    "phone case",
    "coffee beans",
  ],
  banners: [
    { id: "1", title: "9.9 Mega Sale", subtitle: "Up to 70% off", color: "#EE4D2D" },
    { id: "2", title: "Free Shipping", subtitle: "Orders over S$70", color: "#26AA99" },
    { id: "3", title: "Mall Brands", subtitle: "100% Authentic", color: "#D0011B" },
  ],
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

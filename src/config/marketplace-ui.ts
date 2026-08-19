/**
 * Unified marketplace UI — single source of truth for web + mobile.
 * Mobile mirrors this file in mobile/lib/marketplace-ui.ts (keep in sync).
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
    {
      id: "freeship",
      label: "Free Shipping",
      path: "/search",
      color: c.success,
    },
    { id: "mall", label: "Mall", path: "/search", color: c.featured },
    { id: "deals", label: "Deals", path: "/search?sort=deals", color: c.warning },
  ],

  banners: [
    { id: "1", title: "Welcome to Aromza", subtitle: "Shop curated finds", color: c.primary },
    {
      id: "2",
      title: "Free Shipping",
      subtitle: `Orders over S$${brand.delivery.freeShippingThreshold}`,
      color: c.success,
    },
    { id: "3", title: "Trusted Sellers", subtitle: "Quality you can count on", color: c.featured },
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

export type MarketplaceUi = typeof marketplaceUi;

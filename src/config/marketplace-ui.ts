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
    {
      id: "1",
      title: "Discover More, From A to Z",
      subtitle: "Curated finds from trusted Singapore sellers",
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
    {
      id: "4",
      title: "Home Essentials",
      subtitle: "Decor, kitchenware & living must-haves",
      color: c.primaryDark,
      image:
        "https://images.unsplash.com/photo-1615529328331-f9917597363d?auto=format&fit=crop&w=1200&h=600&q=80",
    },
  ],

  sideBanners: [
    {
      id: "side-1",
      title: "Flash Deals",
      subtitle: "Limited time offers",
      href: "/search?sort=deals",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=400&h=320&q=80",
    },
    {
      id: "side-2",
      title: "Electronics",
      subtitle: "Tech essentials",
      href: "/categories/electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=320&q=80",
    },
    {
      id: "side-3",
      title: "Fashion",
      subtitle: "New arrivals",
      href: "/categories/fashion",
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&h=320&q=80",
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

export type MarketplaceUi = typeof marketplaceUi;

import { brand } from "@/config/brand";

export const navigation = {
  categories: [
    {
      id: "fashion",
      name: "Fashion",
      slug: "fashion",
      children: [
        { id: "womens", name: "Women's", slug: "womens-fashion" },
        { id: "mens", name: "Men's", slug: "mens-fashion" },
        { id: "accessories", name: "Accessories", slug: "accessories" },
      ],
    },
    {
      id: "home",
      name: "Home & Living",
      slug: "home-living",
      children: [
        { id: "furniture", name: "Furniture", slug: "furniture" },
        { id: "decor", name: "Decor", slug: "decor" },
        { id: "kitchen", name: "Kitchen", slug: "kitchen" },
      ],
    },
    {
      id: "beauty",
      name: "Beauty",
      slug: "beauty",
      children: [
        { id: "skincare", name: "Skincare", slug: "skincare" },
        { id: "makeup", name: "Makeup", slug: "makeup" },
        { id: "fragrance", name: "Fragrance", slug: "fragrance" },
      ],
    },
    {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
      children: [
        { id: "audio", name: "Audio", slug: "audio" },
        { id: "wearables", name: "Wearables", slug: "wearables" },
        { id: "accessories-tech", name: "Accessories", slug: "tech-accessories" },
      ],
    },
    {
      id: "food",
      name: "Food & Gourmet",
      slug: "food-gourmet",
      children: [
        { id: "pantry", name: "Pantry", slug: "pantry" },
        { id: "beverages", name: "Beverages", slug: "beverages" },
        { id: "gifts", name: "Gift Sets", slug: "gift-sets" },
      ],
    },
  ],

  footer: {
    help: [
      { label: "Help Center", href: "/help" },
      { label: "Track Order", href: "/account/orders" },
      { label: "Returns & Refunds", href: "/help/returns" },
      { label: "Contact Us", href: "/help/contact" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Sustainability", href: "/sustainability" },
    ],
    sellers: [
      { label: "Sell on " + brand.name, href: "/sell" },
      { label: "Seller Portal", href: "/seller" },
      { label: "Seller Guidelines", href: "/sell/guidelines" },
      { label: "Seller Support", href: "/sell/support" },
    ],
    legal: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ],
  },

  account: [
    { label: "Dashboard", href: "/account", icon: "LayoutDashboard" },
    { label: "Orders", href: "/account/orders", icon: "Package" },
    { label: "Wishlist", href: "/account/wishlist", icon: "Heart" },
    { label: "Addresses", href: "/account/addresses", icon: "MapPin" },
    { label: "Reviews", href: "/account/reviews", icon: "Star" },
    { label: "Notifications", href: "/account/notifications", icon: "Bell" },
    { label: "Security", href: "/account/security", icon: "Shield" },
    { label: "Profile", href: "/account/profile", icon: "User" },
  ],
} as const;

export type Navigation = typeof navigation;

/** Mirrors src/config/brand.ts — keep in sync with web */
export const brand = {
  name: "Aromza",
  tagline: "Discover More, From A to Z",
  description:
    "Aromza — Discover More, From A to Z. Shop curated finds from trusted sellers in Singapore.",
  share: {
    title: "Aromza — Discover More, From A to Z",
    description: "Discover More, From A to Z. Shop curated finds on Aromza.",
    image: "https://aromza.store/brand/og-share.png",
  },
  locale: {
    default: "en-SG",
    currency: "SGD",
    country: "SG",
  },
  delivery: {
    freeShippingThreshold: 70,
    defaultFee: 7.99,
  },
  theme: {
    colors: {
      primary: "#064E3B",
      primaryDark: "#043326",
      background: "#FFFCF5",
      surface: "#FFFFFF",
      accent: "#047857",
      promotional: "#B91C1C",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#047857",
      warning: "#D4A017",
      error: "#B91C1C",
      header: "#064E3B",
      productTitle: "#1F2937",
      price: "#064E3B",
      discount: "#B91C1C",
      cartButton: "#047857",
      featured: "#D4A017",
    },
  },
  copyright: {
    holder: "UXguard",
    url: "https://uxguard.studio",
  },
} as const;

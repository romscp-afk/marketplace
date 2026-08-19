/**
 * Centralized brand configuration.
 * Update this file to rebrand the entire application.
 */
export const brand = {
  name: "Aromza",
  shortName: "Aromza",
  tagline: "Discover More, From A to Z",
  description:
    "Aromza — Discover More, From A to Z. Shop curated finds from trusted sellers in Singapore.",

  share: {
    title: "Aromza — Discover More, From A to Z",
    description: "Discover More, From A to Z. Shop curated finds on Aromza.",
    image: "/brand/og-share.png",
  },

  logo: {
    full: "/brand/aromza-logo.png",
    light: "/brand/aromza-logo-light.png",
    dark: "/brand/aromza-logo.png",
    icon: "/brand/aromza-logo.png",
  },

  favicon: {
    ico: "/icon",
    png16: "/icon",
    png32: "/icon",
    apple: "/apple-icon",
  },

  contact: {
    supportEmail: "hello@uxguard.studio",
    businessAddress: "1 Raffles Place, Singapore 048616",
  },

  copyright: {
    holder: "UXguard",
    url: "https://uxguard.studio",
  },

  social: {
    twitter: "https://twitter.com/example",
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    linkedin: "https://linkedin.com/company/example",
  },

  locale: {
    default: "en-SG",
    currency: "SGD",
    country: "SG",
    countryName: "Singapore",
    timezone: "Asia/Singapore",
    phoneCountryCode: "+65",
    /** Launch market — delivery available to these countries only */
    deliveryCountries: ["SG"] as const,
  },

  delivery: {
    defaultEstimateDays: { min: 3, max: 7 },
    freeShippingThreshold: 70,
    defaultFee: 7.99,
  },

  commission: {
    defaultRate: 0.1,
    minimumPayout: 25,
  },

  returns: {
    windowDays: 30,
  },

  /** Marketplace palette — emerald header · warm cream background */
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
      /** Semantic product UI tokens */
      header: "#064E3B",
      productTitle: "#1F2937",
      price: "#064E3B",
      discount: "#B91C1C",
      cartButton: "#047857",
      featured: "#D4A017",
    },
  },

  pwa: {
    themeColor: "#064E3B",
    backgroundColor: "#FFFCF5",
  },

  announcement: {
    enabled: false,
    message: "Free delivery on orders over S$70 — shop curated collections today",
    link: "/search?sort=deals",
    linkText: "Shop deals",
  },
} as const;

export type Brand = typeof brand;

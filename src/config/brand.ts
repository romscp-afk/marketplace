/**
 * Centralized brand configuration.
 * Update this file to rebrand the entire application.
 */
export const brand = {
  name: "Marketplace",
  shortName: "Market",
  tagline: "Discover premium products from trusted sellers",
  description:
    "A premium multi-vendor marketplace for discovering and buying quality products from independent sellers.",

  logo: {
    light: "/brand/logo-light.svg",
    dark: "/brand/logo-dark.svg",
    icon: "/brand/icon.svg",
  },

  favicon: {
    ico: "/icon",
    png16: "/icon",
    png32: "/icon",
    apple: "/apple-icon",
  },

  contact: {
    supportEmail: "support@example.com",
    businessAddress: "123 Commerce Street, Suite 100, Example City, EX 12345",
  },

  social: {
    twitter: "https://twitter.com/example",
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    linkedin: "https://linkedin.com/company/example",
  },

  locale: {
    default: "en-US",
    currency: "USD",
    country: "US",
    timezone: "America/New_York",
  },

  delivery: {
    defaultEstimateDays: { min: 3, max: 7 },
    freeShippingThreshold: 50,
    defaultFee: 5.99,
  },

  commission: {
    defaultRate: 0.1,
    minimumPayout: 25,
  },

  returns: {
    windowDays: 30,
  },

  theme: {
    colors: {
      primary: "#0B5D4B",
      primaryDark: "#073D33",
      background: "#FAF8F3",
      surface: "#FFFFFF",
      accent: "#C9A45C",
      promotional: "#DF654B",
      text: "#18201E",
      textSecondary: "#66736F",
      border: "#E6E2D9",
      success: "#16865C",
      warning: "#D68A18",
      error: "#C43D4B",
    },
  },

  pwa: {
    themeColor: "#0B5D4B",
    backgroundColor: "#FAF8F3",
  },

  announcement: {
    enabled: true,
    message: "Free delivery on orders over $50 — shop curated collections today",
    link: "/search?sort=deals",
    linkText: "Shop deals",
  },
} as const;

export type Brand = typeof brand;

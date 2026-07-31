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

  /** UXguard brand palette — teal #0eb5bd · navy #001334 */
  theme: {
    colors: {
      primary: "#0EB5BD",
      primaryDark: "#0C9AA1",
      background: "#F4F7FB",
      surface: "#FFFFFF",
      accent: "#3ECED4",
      promotional: "#DF654B",
      text: "#001334",
      textSecondary: "#5A7390",
      border: "#E8EEF6",
      success: "#0C9AA1",
      warning: "#D68A18",
      error: "#C43D4B",
    },
  },

  pwa: {
    themeColor: "#0EB5BD",
    backgroundColor: "#F4F7FB",
  },

  announcement: {
    enabled: true,
    message: "Free delivery on orders over S$70 — shop curated collections today",
    link: "/search?sort=deals",
    linkText: "Shop deals",
  },
} as const;

export type Brand = typeof brand;

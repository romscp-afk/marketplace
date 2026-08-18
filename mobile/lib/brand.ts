/** Mirrors src/config/brand.ts — keep in sync with web */
export const brand = {
  name: "Marketplace",
  tagline: "Discover premium products from trusted sellers",
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
      primary: "#0EB5BD",
      primaryDark: "#0C9AA1",
      background: "#F4F7FB",
      surface: "#FFFFFF",
      text: "#001334",
      textSecondary: "#5A7390",
      border: "#E8EEF6",
      error: "#C43D4B",
      promotional: "#DF654B",
    },
  },
  copyright: {
    holder: "UXguard",
    url: "https://uxguard.studio",
  },
} as const;

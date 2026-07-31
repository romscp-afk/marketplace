import { brand } from "@/config/brand";

export const manifest = {
  name: brand.name,
  short_name: brand.shortName,
  description: brand.description,
  start_url: "/",
  display: "standalone",
  background_color: brand.pwa.backgroundColor,
  theme_color: brand.pwa.themeColor,
  orientation: "portrait-primary",
  icons: [
    {
      src: "/icons/icon-192x192",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512x512",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512x512",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  categories: ["shopping", "marketplace"],
  lang: brand.locale.default.split("-")[0],
};

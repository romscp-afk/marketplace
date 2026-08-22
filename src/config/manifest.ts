import { brand } from "@/config/brand";

export const manifest = {
  name: brand.share.title,
  short_name: brand.shortName,
  description: brand.share.description,
  start_url: "/",
  display: "standalone",
  background_color: brand.pwa.backgroundColor,
  theme_color: brand.pwa.themeColor,
  orientation: "portrait-primary",
  icons: [
    {
      src: "/brand/aromza-icon.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/brand/aromza-icon.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
  ],
  categories: ["shopping", "marketplace"],
  lang: brand.locale.default.split("-")[0],
};

import type { Viewport } from "next";
import { brand } from "@/config/brand";

export const viewport: Viewport = {
  themeColor: brand.pwa.themeColor,
  width: "device-width",
  initialScale: 1,
};

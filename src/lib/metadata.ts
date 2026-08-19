import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://aromza.store";
}

export function getShareImageUrl(): string {
  return new URL(brand.share.image, getSiteUrl()).toString();
}

export function createSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  const siteUrl = getSiteUrl();
  const imageUrl = getShareImageUrl();

  const base: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: brand.share.title,
      template: `%s | ${brand.name}`,
    },
    description: brand.share.description,
    applicationName: brand.name,
    keywords: [
      brand.name,
      "marketplace",
      "Singapore",
      "online shopping",
      brand.tagline,
    ],
    openGraph: {
      type: "website",
      locale: brand.locale.default,
      url: siteUrl,
      siteName: brand.name,
      title: brand.share.title,
      description: brand.share.description,
      images: [
        {
          url: brand.share.image,
          width: 1200,
          height: 630,
          alt: brand.share.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.share.title,
      description: brand.share.description,
      images: [brand.share.image],
    },
    icons: {
      icon: [{ url: brand.favicon.png32, sizes: "32x32", type: "image/png" }],
      apple: [{ url: brand.favicon.apple, sizes: "180x180", type: "image/png" }],
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };

  return {
    ...base,
    ...overrides,
    openGraph: { ...base.openGraph, ...overrides?.openGraph },
    twitter: { ...base.twitter, ...overrides?.twitter },
  };
}

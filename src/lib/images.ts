/** Stable image URLs — local category assets, no random placeholders */

const categoryImagePaths: Record<string, string> = {
  fashion: "/images/categories/fashion.jpg",
  "home-living": "/images/categories/home-living.jpg",
  beauty: "/images/categories/beauty.jpg",
  electronics: "/images/categories/electronics.jpg",
  "food-gourmet": "/images/categories/food-gourmet.jpg",
  jewelry: "/images/categories/jewelry.jpg",
};

export function productImageUrl(slug: string, width = 600, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/${width}/${height}`;
}

export function categoryImageUrl(slug: string): string {
  return categoryImagePaths[slug] ?? `/images/categories/${slug}.jpg`;
}

export const PRODUCT_IMAGE_FALLBACK = "/images/placeholder-product.svg";

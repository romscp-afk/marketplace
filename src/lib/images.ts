/** Stable image URLs — no external CDN dependencies for core catalog assets */
export function productImageUrl(slug: string, width = 600, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/${width}/${height}`;
}

export function categoryImageUrl(slug: string, width = 400, height = 400): string {
  return `https://picsum.photos/seed/cat-${encodeURIComponent(slug)}/${width}/${height}`;
}

export const PRODUCT_IMAGE_FALLBACK = "/images/placeholder-product.svg";

/** Mirrors src/lib/images.ts — keep product photo mappings in sync */

const productPhotos: Record<string, string> = {
  "organic-cotton-linen-blend-shirt": "photo-1596755094514-f87e34085b2c",
  "handwoven-merino-wool-scarf": "photo-1601925260368-ae853277eb99",
  "leather-crossbody-bag": "photo-1548036328-c9fa89d128fa",
  "wide-leg-tailored-trousers": "photo-1594633312681-425c7b4ccd1d",
  "cashmere-blend-sweater": "photo-1576566588028-4147f3842f27",
  "silk-midi-dress": "photo-1595777457583-95b05905e12f",
  "minimalist-ceramic-vase-set": "photo-1615529328331-f9917597363d",
  "solid-oak-floating-shelf": "photo-1594620302202-9c782112bf48",
  "linen-throw-pillow-collection": "photo-1584100936592-45a2571a3b5a",
  "bamboo-bed-sheet-set": "photo-1631049307264-da0ec9d70304",
  "scented-soy-candle-collection": "photo-1602874801006-64f3239c8a2e",
  "marble-serving-board": "photo-1603199505876-62b22e0a4319",
  "essential-oil-diffuser": "photo-1608571423902-ee4d00594b8f",
  "woven-storage-basket-set": "photo-1558618666-fcd25c85cd64",
  "botanical-face-serum": "photo-1612817288484-6f916006177a",
  "hydrating-night-cream": "photo-1556228720-195a672e8a03",
  "natural-lip-tint-set": "photo-1586495777744-4416081470b3",
  "vitamin-c-brightening-mask": "photo-1570172619644-dfd955ed48a8",
  "retinol-renewal-serum": "photo-1570197788417-0e823725b924",
  "wireless-noise-cancelling-earbuds": "photo-1572569511254-d8f925fe2cbb",
  "portable-bluetooth-speaker": "photo-1608043152269-423dbba4e7e1",
  "smart-watch-band-collection": "photo-1523275335684-37898b6baf30",
  "usb-c-hub-adapter": "photo-1587825140708-dfafae829937",
  "mechanical-keyboard": "photo-1511467687858-23d96c934e3c",
  "artisan-olive-oil-trio": "photo-1474979266404-7eaacfb891fd",
  "single-origin-coffee-beans": "photo-1559056199-641a0ae5790b",
  "dark-chocolate-gift-box": "photo-1511381938452-a4b446c7a4b4",
  "herbal-tea-sampler": "photo-1564890369478-a83a44628769",
  "artisan-honey-jar": "photo-1587049351696-2485df7651f7",
  "sterling-silver-pendant-necklace": "photo-1599643478518-a784e5dc4c08",
  "hand-stamped-gold-ring": "photo-1605100804763-247f67b3557e",
  "pearl-drop-earrings": "photo-1535632066927-ab7c75443df4",
};

const categoryProductPhotos: Record<string, string> = {
  fashion: "photo-1489987707025-afc232f7ea0f",
  "home-living": "photo-1615529328331-f9917597363d",
  beauty: "photo-1596462502278-27bfdc403348",
  electronics: "photo-1505740420928-5e560c06d30e",
  "food-gourmet": "photo-1542838132-92c53300491e",
  jewelry: "photo-1515566444733-99e27e0a4b4b",
};

function unsplashUrl(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function productImageUrl(
  slug: string,
  width = 600,
  height = 600,
  categorySlug?: string,
): string {
  const photoId =
    productPhotos[slug] ??
    (categorySlug ? categoryProductPhotos[categorySlug] : undefined) ??
    categoryProductPhotos.fashion;
  return unsplashUrl(photoId!, width, height);
}

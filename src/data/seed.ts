import type { Category, Product, Review, Seller } from "@/types";

const IMAGE_BASE = "https://images.unsplash.com";

export const seedCategories: Category[] = [
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Curated apparel and accessories",
    imageUrl: `${IMAGE_BASE}/photo-1445205170230-053b83016050?w=400&h=400&fit=crop`,
  },
  {
    id: "cat-home",
    name: "Home & Living",
    slug: "home-living",
    description: "Elevate your living space",
    imageUrl: `${IMAGE_BASE}/photo-1616046220565-338952a68964?w=400&h=400&fit=crop`,
  },
  {
    id: "cat-beauty",
    name: "Beauty",
    slug: "beauty",
    description: "Premium skincare and cosmetics",
    imageUrl: `${IMAGE_BASE}/photo-1596462502278-27bfd4033486?w=400&h=400&fit=crop`,
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Modern tech essentials",
    imageUrl: `${IMAGE_BASE}/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop`,
  },
  {
    id: "cat-food",
    name: "Food & Gourmet",
    slug: "food-gourmet",
    description: "Artisan foods and beverages",
    imageUrl: `${IMAGE_BASE}/photo-1542838132-92c53300491e?w=400&h=400&fit=crop`,
  },
  {
    id: "cat-jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Handcrafted fine jewelry",
    imageUrl: `${IMAGE_BASE}/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop`,
  },
];

export const seedSellers: Seller[] = [
  {
    id: "seller-1",
    storeName: "Artisan Collective",
    slug: "artisan-collective",
    description: "Handcrafted goods from independent makers",
    logoUrl: `${IMAGE_BASE}/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop`,
    rating: 4.8,
    reviewCount: 342,
    productCount: 12,
    isVerified: true,
  },
  {
    id: "seller-2",
    storeName: "Modern Living Co.",
    slug: "modern-living-co",
    description: "Contemporary home essentials",
    logoUrl: `${IMAGE_BASE}/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop`,
    rating: 4.6,
    reviewCount: 218,
    productCount: 8,
    isVerified: true,
  },
  {
    id: "seller-3",
    storeName: "Pure Botanicals",
    slug: "pure-botanicals",
    description: "Natural beauty and wellness products",
    logoUrl: `${IMAGE_BASE}/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop`,
    rating: 4.9,
    reviewCount: 567,
    productCount: 10,
    isVerified: true,
  },
  {
    id: "seller-4",
    storeName: "Tech Haven",
    slug: "tech-haven",
    description: "Premium electronics and accessories",
    logoUrl: `${IMAGE_BASE}/photo-1563013547-824ae1b704d3?w=100&h=100&fit=crop`,
    rating: 4.5,
    reviewCount: 189,
    productCount: 6,
    isVerified: true,
  },
  {
    id: "seller-5",
    storeName: "Gourmet Pantry",
    slug: "gourmet-pantry",
    description: "Artisan foods from around the world",
    logoUrl: `${IMAGE_BASE}/photo-1556910103-1c02745aae4d?w=100&h=100&fit=crop`,
    rating: 4.7,
    reviewCount: 423,
    productCount: 8,
    isVerified: false,
  },
];

function createProduct(
  overrides: Partial<Product> & Pick<Product, "id" | "title" | "slug" | "price" | "sellerId" | "categoryId">,
): Product {
  const seller = seedSellers.find((s) => s.id === overrides.sellerId)!;
  const category = seedCategories.find((c) => c.id === overrides.categoryId)!;

  return {
    description: "Premium quality product crafted with care.",
    shortDescription: "Premium quality product",
    currency: "USD",
    images: [`${IMAGE_BASE}/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop`],
    categoryName: category.name,
    categorySlug: category.slug,
    seller: {
      id: seller.id,
      storeName: seller.storeName,
      slug: seller.slug,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
      isVerified: seller.isVerified,
    },
    rating: 4.5,
    reviewCount: 48,
    stock: 25,
    status: "active",
    isReturnEligible: true,
    deliveryEstimateDays: { min: 3, max: 7 },
    deliveryFee: 5.99,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
    ...overrides,
  };
}

export const seedProducts: Product[] = [
  createProduct({
    id: "prod-1",
    title: "Organic Cotton Linen Blend Shirt",
    slug: "organic-cotton-linen-blend-shirt",
    price: 89.0,
    compareAtPrice: 120.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 89,
    variants: [
      { id: "v1-s", productId: "prod-1", name: "Small / White", sku: "OCLS-WH-S", price: 89, stock: 10, attributes: { size: "S", color: "White" } },
      { id: "v1-m", productId: "prod-1", name: "Medium / White", sku: "OCLS-WH-M", price: 89, stock: 15, attributes: { size: "M", color: "White" } },
      { id: "v1-l", productId: "prod-1", name: "Large / Navy", sku: "OCLS-NV-L", price: 89, stock: 8, attributes: { size: "L", color: "Navy" } },
    ],
  }),
  createProduct({
    id: "prod-2",
    title: "Handwoven Merino Wool Scarf",
    slug: "handwoven-merino-wool-scarf",
    price: 65.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1520903920243-00d744a2ee11?w=600&h=600&fit=crop`],
    rating: 4.9,
    reviewCount: 124,
  }),
  createProduct({
    id: "prod-3",
    title: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 145.0,
    compareAtPrice: 180.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1548039257-85c1a5d0b0b0?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 67,
  }),
  createProduct({
    id: "prod-4",
    title: "Minimalist Ceramic Vase Set",
    slug: "minimalist-ceramic-vase-set",
    price: 78.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1578749552668-898577875e83?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 156,
  }),
  createProduct({
    id: "prod-5",
    title: "Solid Oak Floating Shelf",
    slug: "solid-oak-floating-shelf",
    price: 95.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop`],
    rating: 4.5,
    reviewCount: 43,
  }),
  createProduct({
    id: "prod-6",
    title: "Linen Throw Pillow Collection",
    slug: "linen-throw-pillow-collection",
    price: 42.0,
    compareAtPrice: 55.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1584100936595-0654a7754a4d?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 98,
  }),
  createProduct({
    id: "prod-7",
    title: "Botanical Face Serum",
    slug: "botanical-face-serum",
    price: 48.0,
    sellerId: "seller-3",
    categoryId: "cat-beauty",
    images: [`${IMAGE_BASE}/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop`],
    rating: 4.9,
    reviewCount: 312,
  }),
  createProduct({
    id: "prod-8",
    title: "Hydrating Night Cream",
    slug: "hydrating-night-cream",
    price: 56.0,
    compareAtPrice: 68.0,
    sellerId: "seller-3",
    categoryId: "cat-beauty",
    images: [`${IMAGE_BASE}/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 245,
  }),
  createProduct({
    id: "prod-9",
    title: "Natural Lip Tint Set",
    slug: "natural-lip-tint-set",
    price: 32.0,
    sellerId: "seller-3",
    categoryId: "cat-beauty",
    images: [`${IMAGE_BASE}/photo-1586495777740-567fb1f1358e?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 178,
  }),
  createProduct({
    id: "prod-10",
    title: "Wireless Noise-Cancelling Earbuds",
    slug: "wireless-noise-cancelling-earbuds",
    price: 129.0,
    compareAtPrice: 159.0,
    sellerId: "seller-4",
    categoryId: "cat-electronics",
    images: [`${IMAGE_BASE}/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop`],
    rating: 4.4,
    reviewCount: 89,
  }),
  createProduct({
    id: "prod-11",
    title: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    price: 79.0,
    sellerId: "seller-4",
    categoryId: "cat-electronics",
    images: [`${IMAGE_BASE}/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop`],
    rating: 4.5,
    reviewCount: 134,
  }),
  createProduct({
    id: "prod-12",
    title: "Smart Watch Band Collection",
    slug: "smart-watch-band-collection",
    price: 35.0,
    sellerId: "seller-4",
    categoryId: "cat-electronics",
    images: [`${IMAGE_BASE}/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop`],
    rating: 4.3,
    reviewCount: 56,
    stock: 0,
    status: "out_of_stock",
  }),
  createProduct({
    id: "prod-13",
    title: "Artisan Olive Oil Trio",
    slug: "artisan-olive-oil-trio",
    price: 45.0,
    sellerId: "seller-5",
    categoryId: "cat-food",
    images: [`${IMAGE_BASE}/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 201,
  }),
  createProduct({
    id: "prod-14",
    title: "Single Origin Coffee Beans",
    slug: "single-origin-coffee-beans",
    price: 22.0,
    compareAtPrice: 28.0,
    sellerId: "seller-5",
    categoryId: "cat-food",
    images: [`${IMAGE_BASE}/photo-1559056199-641a0ac8b55c?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 167,
  }),
  createProduct({
    id: "prod-15",
    title: "Dark Chocolate Gift Box",
    slug: "dark-chocolate-gift-box",
    price: 38.0,
    sellerId: "seller-5",
    categoryId: "cat-food",
    images: [`${IMAGE_BASE}/photo-1548904154-3d7a388731b8?w=600&h=600&fit=crop`],
    rating: 4.9,
    reviewCount: 289,
  }),
  createProduct({
    id: "prod-16",
    title: "Sterling Silver Pendant Necklace",
    slug: "sterling-silver-pendant-necklace",
    price: 125.0,
    sellerId: "seller-1",
    categoryId: "cat-jewelry",
    images: [`${IMAGE_BASE}/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 76,
  }),
  createProduct({
    id: "prod-17",
    title: "Hand-Stamped Gold Ring",
    slug: "hand-stamped-gold-ring",
    price: 185.0,
    compareAtPrice: 220.0,
    sellerId: "seller-1",
    categoryId: "cat-jewelry",
    images: [`${IMAGE_BASE}/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 54,
  }),
  createProduct({
    id: "prod-18",
    title: "Bamboo Bed Sheet Set",
    slug: "bamboo-bed-sheet-set",
    price: 110.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1631049307264-da0ec9d703b1?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 112,
  }),
  createProduct({
    id: "prod-19",
    title: "Scented Soy Candle Collection",
    slug: "scented-soy-candle-collection",
    price: 34.0,
    compareAtPrice: 42.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1602607240969-ec763c7d7f5f?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 198,
  }),
  createProduct({
    id: "prod-20",
    title: "Vitamin C Brightening Mask",
    slug: "vitamin-c-brightening-mask",
    price: 28.0,
    sellerId: "seller-3",
    categoryId: "cat-beauty",
    images: [`${IMAGE_BASE}/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop`],
    rating: 4.5,
    reviewCount: 87,
  }),
  createProduct({
    id: "prod-21",
    title: "Wide-Leg Tailored Trousers",
    slug: "wide-leg-tailored-trousers",
    price: 98.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop`],
    rating: 4.4,
    reviewCount: 63,
  }),
  createProduct({
    id: "prod-22",
    title: "Cashmere Blend Sweater",
    slug: "cashmere-blend-sweater",
    price: 135.0,
    compareAtPrice: 165.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 145,
  }),
  createProduct({
    id: "prod-23",
    title: "Marble Serving Board",
    slug: "marble-serving-board",
    price: 58.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1603199506016-2a69f0a7a7a8?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 72,
  }),
  createProduct({
    id: "prod-24",
    title: "Essential Oil Diffuser",
    slug: "essential-oil-diffuser",
    price: 49.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop`],
    rating: 4.5,
    reviewCount: 91,
  }),
  createProduct({
    id: "prod-25",
    title: "Retinol Renewal Serum",
    slug: "retinol-renewal-serum",
    price: 62.0,
    sellerId: "seller-3",
    categoryId: "cat-beauty",
    images: [`${IMAGE_BASE}/photo-1617897903246-719332784169?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 234,
  }),
  createProduct({
    id: "prod-26",
    title: "USB-C Hub Adapter",
    slug: "usb-c-hub-adapter",
    price: 45.0,
    compareAtPrice: 59.0,
    sellerId: "seller-4",
    categoryId: "cat-electronics",
    images: [`${IMAGE_BASE}/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop`],
    rating: 4.3,
    reviewCount: 78,
  }),
  createProduct({
    id: "prod-27",
    title: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    price: 149.0,
    sellerId: "seller-4",
    categoryId: "cat-electronics",
    images: [`${IMAGE_BASE}/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 102,
  }),
  createProduct({
    id: "prod-28",
    title: "Herbal Tea Sampler",
    slug: "herbal-tea-sampler",
    price: 24.0,
    sellerId: "seller-5",
    categoryId: "cat-food",
    images: [`${IMAGE_BASE}/photo-1564890369478-c89ca64d6772?w=600&h=600&fit=crop`],
    rating: 4.7,
    reviewCount: 156,
  }),
  createProduct({
    id: "prod-29",
    title: "Artisan Honey Jar",
    slug: "artisan-honey-jar",
    price: 18.0,
    sellerId: "seller-5",
    categoryId: "cat-food",
    images: [`${IMAGE_BASE}/photo-1587049352846-4a2227827928?w=600&h=600&fit=crop`],
    rating: 4.9,
    reviewCount: 312,
  }),
  createProduct({
    id: "prod-30",
    title: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    price: 78.0,
    compareAtPrice: 95.0,
    sellerId: "seller-1",
    categoryId: "cat-jewelry",
    images: [`${IMAGE_BASE}/photo-1535632066927-ab7c754de7f4?w=600&h=600&fit=crop`],
    rating: 4.8,
    reviewCount: 89,
  }),
  createProduct({
    id: "prod-31",
    title: "Silk Midi Dress",
    slug: "silk-midi-dress",
    price: 168.0,
    sellerId: "seller-1",
    categoryId: "cat-fashion",
    images: [`${IMAGE_BASE}/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop`],
    rating: 4.6,
    reviewCount: 47,
  }),
  createProduct({
    id: "prod-32",
    title: "Woven Storage Basket Set",
    slug: "woven-storage-basket-set",
    price: 52.0,
    sellerId: "seller-2",
    categoryId: "cat-home",
    images: [`${IMAGE_BASE}/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop`],
    rating: 4.5,
    reviewCount: 68,
  }),
];

export const seedReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    userId: "user-1",
    userName: "Sarah M.",
    rating: 5,
    title: "Beautiful quality",
    comment: "The fabric feels luxurious and the fit is perfect. Will definitely order again.",
    createdAt: "2025-05-12T00:00:00Z",
    isVerifiedPurchase: true,
  },
  {
    id: "rev-2",
    productId: "prod-7",
    userId: "user-2",
    userName: "James L.",
    rating: 5,
    title: "Game changer for my skin",
    comment: "Noticed visible improvement within two weeks. Lightweight and absorbs quickly.",
    createdAt: "2025-05-20T00:00:00Z",
    isVerifiedPurchase: true,
  },
  {
    id: "rev-3",
    productId: "prod-10",
    userId: "user-3",
    userName: "Emily R.",
    rating: 4,
    title: "Great sound, comfortable fit",
    comment: "Excellent noise cancellation. Battery life could be slightly better.",
    createdAt: "2025-06-01T00:00:00Z",
    isVerifiedPurchase: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return seedProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return seedProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return seedProducts.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySeller(sellerSlug: string): Product[] {
  const seller = seedSellers.find((s) => s.slug === sellerSlug);
  if (!seller) return [];
  return seedProducts.filter((p) => p.sellerId === seller.id);
}

export function searchProducts(
  query: string,
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  } = {},
): { data: Product[]; total: number; page: number; limit: number; totalPages: number } {
  let results = [...seedProducts];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.seller.storeName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    results = results.filter((p) => p.categorySlug === filters.category);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.minRating !== undefined) {
    results = results.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.inStock) {
    results = results.filter((p) => p.stock > 0);
  }

  switch (filters.sort) {
    case "newest":
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "popularity":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "deals":
      results = results.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
      results.sort(
        (a, b) =>
          (b.compareAtPrice! - b.price) / b.compareAtPrice! -
          (a.compareAtPrice! - a.price) / a.compareAtPrice!,
      );
      break;
    default:
      break;
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

export function getFeaturedProducts(): Product[] {
  return seedProducts.filter((p) => p.rating >= 4.7).slice(0, 8);
}

export function getTrendingProducts(): Product[] {
  return [...seedProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);
}

export function getNewArrivals(): Product[] {
  return [...seedProducts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);
}

export function getDeals(): Product[] {
  return seedProducts
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .slice(0, 8);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return seedProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId || p.sellerId === product.sellerId),
    )
    .slice(0, limit);
}

export function getReviewsForProduct(productId: string): Review[] {
  return seedReviews.filter((r) => r.productId === productId);
}

export function getSellerBySlug(slug: string): Seller | undefined {
  return seedSellers.find((s) => s.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return seedCategories.find((c) => c.slug === slug);
}

export function getSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const suggestions = new Set<string>();

  seedProducts.forEach((p) => {
    if (p.title.toLowerCase().includes(q)) suggestions.add(p.title);
    if (p.categoryName.toLowerCase().includes(q)) suggestions.add(p.categoryName);
  });

  seedCategories.forEach((c) => {
    if (c.name.toLowerCase().includes(q)) suggestions.add(c.name);
  });

  return Array.from(suggestions).slice(0, 6);
}

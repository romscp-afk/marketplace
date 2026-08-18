export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  imageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  sellerId: string;
  seller: {
    id: string;
    storeName: string;
    slug: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  variants?: ProductVariant[];
  isReturnEligible: boolean;
  deliveryEstimateDays: { min: number; max: number };
  deliveryFee?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Seller {
  id: string;
  storeName: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  selectedVariant?: ProductVariant;
  savedForLater?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HomeResponse {
  brand: {
    name: string;
    tagline: string;
    locale: { currency: string; default: string };
    delivery: { freeShippingThreshold: number; defaultFee: number };
    theme: { colors: Record<string, string> };
    announcement: { enabled: boolean; message: string };
  };
  sections: {
    featured: Product[];
    trending: Product[];
    newArrivals: Product[];
    deals: Product[];
  };
  categories: Category[];
  sellers: Seller[];
}

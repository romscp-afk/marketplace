export type UserRole =
  | "guest"
  | "customer"
  | "seller_applicant"
  | "seller_owner"
  | "seller_staff"
  | "marketplace_admin"
  | "super_admin"
  | "support_agent";

export type ProductStatus =
  | "draft"
  | "review"
  | "active"
  | "rejected"
  | "archived"
  | "out_of_stock";

export type SellerApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "more_info_required"
  | "approved"
  | "rejected"
  | "suspended";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "partially_shipped"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type SellerSubOrderStatus =
  | "pending"
  | "accepted"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: Category[];
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
  seller: Pick<Seller, "id" | "storeName" | "slug" | "rating" | "reviewCount" | "isVerified">;
  rating: number;
  reviewCount: number;
  stock: number;
  status: ProductStatus;
  variants?: ProductVariant[];
  attributes?: Record<string, string>;
  specifications?: Record<string, string>;
  weight?: number;
  isReturnEligible: boolean;
  deliveryEstimateDays: { min: number; max: number };
  deliveryFee?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
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

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

export interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface SellerSubOrder {
  id: string;
  sellerId: string;
  sellerName: string;
  status: SellerSubOrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  commission: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  sellerSubOrders: SellerSubOrder[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  seller?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: "relevance" | "newest" | "popularity" | "rating" | "price_asc" | "price_desc" | "deals";
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HomepageSection<T = unknown> {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  items: T[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export interface DeliveryLocation {
  country: string;
  region?: string;
  postalCode?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  expiresAt?: string;
}

export interface CheckoutStep {
  id: string;
  label: string;
  description?: string;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

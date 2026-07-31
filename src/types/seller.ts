import type { SellerApplicationStatus, ProductStatus, SellerSubOrderStatus } from "@/types";

export interface SellerApplication {
  id: string;
  userId: string;
  status: SellerApplicationStatus;
  storeName: string;
  storeDescription?: string;
  businessName?: string;
  businessRegistration?: string;
  categories: string[];
  adminNotes?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerRecord {
  id: string;
  ownerId: string;
  status: "pending" | "active" | "suspended" | "closed";
  commissionRate: number;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  store: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
  };
}

export interface SellerProduct {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency: string;
  sku?: string;
  stock: number;
  status: ProductStatus;
  categoryId: string;
  categoryName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  subOrderId: string;
  status: SellerSubOrderStatus;
  customerName: string;
  itemCount: number;
  subtotal: number;
  commission: number;
  createdAt: string;
}

export interface SellerOrderDetail extends SellerOrder {
  items: {
    id: string;
    title: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
  }[];
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface SellerStats {
  totalSales: number;
  ordersThisMonth: number;
  activeProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  rating: number;
}

export interface SellerPayout {
  id: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
}

export interface SellerPortalContext {
  userId: string;
  email: string;
  isSeller: boolean;
  isApprovedSeller: boolean;
  application?: SellerApplication;
  seller?: SellerRecord;
}

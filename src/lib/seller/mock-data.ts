/**
 * Development mock data for seller portal when Supabase is not configured.
 * Replace with live queries once credentials are added.
 */

import type {
  SellerApplication,
  SellerRecord,
  SellerProduct,
  SellerOrder,
  SellerOrderDetail,
  SellerStats,
  SellerPayout,
} from "@/types/seller";

export const MOCK_SELLER: SellerRecord = {
  id: "mock-seller-1",
  ownerId: "mock-user",
  status: "active",
  commissionRate: 0.1,
  isVerified: true,
  rating: 4.8,
  reviewCount: 342,
  productCount: 8,
  store: {
    id: "mock-store-1",
    name: "Artisan Collective",
    slug: "artisan-collective",
    description: "Handcrafted goods from independent makers",
    logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
  },
};

export const MOCK_APPLICATION: SellerApplication = {
  id: "mock-app-1",
  userId: "mock-user",
  status: "approved",
  storeName: "Artisan Collective",
  storeDescription: "Handcrafted goods from independent makers",
  businessName: "Artisan Collective LLC",
  categories: ["fashion", "jewelry"],
  submittedAt: "2025-06-01T00:00:00Z",
  createdAt: "2025-05-28T00:00:00Z",
  updatedAt: "2025-06-02T00:00:00Z",
};

let mockProducts: SellerProduct[] = [
  {
    id: "sp-1",
    sellerId: MOCK_SELLER.id,
    title: "Organic Cotton Linen Blend Shirt",
    slug: "organic-cotton-linen-blend-shirt",
    description: "Premium organic cotton blend shirt.",
    price: 89,
    compareAtPrice: 120,
    costPrice: 35,
    currency: "USD",
    sku: "OCLS-001",
    stock: 33,
    status: "active",
    categoryId: "cat-fashion",
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "sp-2",
    sellerId: MOCK_SELLER.id,
    title: "Handwoven Merino Wool Scarf",
    slug: "handwoven-merino-wool-scarf",
    price: 65,
    costPrice: 22,
    currency: "USD",
    sku: "HMW-002",
    stock: 3,
    status: "active",
    categoryId: "cat-fashion",
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1520903920243-00d744a2ee11?w=200&h=200&fit=crop",
    createdAt: "2025-05-05T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "sp-3",
    sellerId: MOCK_SELLER.id,
    title: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 145,
    compareAtPrice: 180,
    costPrice: 60,
    currency: "USD",
    sku: "LCB-003",
    stock: 0,
    status: "out_of_stock",
    categoryId: "cat-fashion",
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1548039257-85c1a5d0b0b0?w=200&h=200&fit=crop",
    createdAt: "2025-05-10T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "sp-4",
    sellerId: MOCK_SELLER.id,
    title: "Sterling Silver Pendant",
    slug: "sterling-silver-pendant",
    price: 125,
    currency: "USD",
    sku: "SSP-004",
    stock: 12,
    status: "review",
    categoryId: "cat-jewelry",
    categoryName: "Jewelry",
    createdAt: "2025-06-10T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
];

const MOCK_ORDERS: SellerOrder[] = [
  {
    id: "so-1",
    orderNumber: "ORD-2025-00142",
    subOrderId: "sso-1",
    status: "pending",
    customerName: "Sarah M.",
    itemCount: 2,
    subtotal: 154,
    commission: 15.4,
    createdAt: "2025-07-30T10:00:00Z",
  },
  {
    id: "so-2",
    orderNumber: "ORD-2025-00138",
    subOrderId: "sso-2",
    status: "processing",
    customerName: "James L.",
    itemCount: 1,
    subtotal: 89,
    commission: 8.9,
    createdAt: "2025-07-29T14:30:00Z",
  },
  {
    id: "so-3",
    orderNumber: "ORD-2025-00120",
    subOrderId: "sso-3",
    status: "shipped",
    customerName: "Emily R.",
    itemCount: 1,
    subtotal: 65,
    commission: 6.5,
    createdAt: "2025-07-27T09:15:00Z",
  },
];

const MOCK_PAYOUTS: SellerPayout[] = [
  {
    id: "pay-1",
    amount: 1240.5,
    status: "paid",
    periodStart: "2025-06-01",
    periodEnd: "2025-06-30",
    paidAt: "2025-07-05T00:00:00Z",
  },
  {
    id: "pay-2",
    amount: 890.25,
    status: "processing",
    periodStart: "2025-07-01",
    periodEnd: "2025-07-31",
  },
];

export function getMockSellerContext(userId: string) {
  return {
    userId,
    email: "seller@example.com",
    isSeller: true,
    isApprovedSeller: true,
    application: MOCK_APPLICATION,
    seller: { ...MOCK_SELLER, ownerId: userId },
  };
}

export function getMockStats(): SellerStats {
  const active = mockProducts.filter((p) => p.status === "active").length;
  const lowStock = mockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const pending = MOCK_ORDERS.filter((o) => o.status === "pending").length;

  return {
    totalSales: 12450,
    ordersThisMonth: 28,
    activeProducts: active,
    lowStockCount: lowStock,
    pendingOrders: pending,
    rating: MOCK_SELLER.rating,
  };
}

export function getMockProducts(): SellerProduct[] {
  return [...mockProducts];
}

export function getMockProduct(id: string): SellerProduct | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function saveMockProduct(product: SellerProduct): SellerProduct {
  const idx = mockProducts.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    mockProducts[idx] = product;
  } else {
    mockProducts.push(product);
  }
  return product;
}

export function deleteMockProduct(id: string): boolean {
  const len = mockProducts.length;
  mockProducts = mockProducts.filter((p) => p.id !== id);
  return mockProducts.length < len;
}

export function getMockOrders(): SellerOrder[] {
  return MOCK_ORDERS;
}

export function getMockOrder(subOrderId: string): SellerOrderDetail | undefined {
  const order = MOCK_ORDERS.find((o) => o.subOrderId === subOrderId);
  if (!order) return undefined;

  return {
    ...order,
    items: [
      {
        id: "oi-1",
        title: "Organic Cotton Linen Blend Shirt",
        variantName: "Medium / White",
        quantity: 1,
        unitPrice: 89,
        totalPrice: 89,
        imageUrl: mockProducts[0]?.imageUrl,
      },
    ],
    shippingAddress: {
      line1: "123 Main Street",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "US",
    },
  };
}

export function getMockPayouts(): SellerPayout[] {
  return MOCK_PAYOUTS;
}

export function getMockApplication(userId: string): SellerApplication | undefined {
  return { ...MOCK_APPLICATION, userId };
}

export function saveMockApplication(app: SellerApplication): SellerApplication {
  Object.assign(MOCK_APPLICATION, app);
  return app;
}

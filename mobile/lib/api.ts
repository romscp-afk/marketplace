import Constants from "expo-constants";
import type {
  Category,
  HomeResponse,
  PaginatedResult,
  Product,
  Seller,
} from "./types";

const DEFAULT_API_URL = "https://marketplace-mocha-three-78.vercel.app";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_APP_URL;
  const fromExtra = Constants.expoConfig?.extra?.appUrl as string | undefined;
  return (fromEnv ?? fromExtra ?? DEFAULT_API_URL).replace(/\/$/, "");
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function fetchHome(): Promise<HomeResponse> {
  return apiFetch("/api/home");
}

export async function fetchProducts(params: Record<string, string | number | undefined> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return apiFetch<PaginatedResult<Product>>(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProduct(slug: string) {
  return apiFetch<{ product: Product; related: Product[]; reviews: unknown[] }>(
    `/api/products/${slug}`,
  );
}

export async function fetchCategories() {
  return apiFetch<{ data: Category[] }>("/api/categories");
}

export async function fetchCategory(slug: string) {
  return apiFetch<{ category: Category; products: Product[] }>(`/api/categories/${slug}`);
}

export async function fetchSellers() {
  return apiFetch<{ data: Seller[] }>("/api/sellers");
}

export async function fetchHealth() {
  return apiFetch<{ status: string; platform: { supabase: string } }>("/api/health");
}

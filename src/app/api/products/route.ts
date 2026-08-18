import type { SearchFilters } from "@/types";
import { getProducts } from "@/lib/data/products";
import {
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

function parseFilters(searchParams: URLSearchParams): SearchFilters {
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  return {
    query: searchParams.get("q") ?? searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    seller: searchParams.get("seller") ?? undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    inStock: searchParams.get("inStock") === "true" ? true : undefined,
    sort: (searchParams.get("sort") as SearchFilters["sort"]) ?? undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };
}

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await getProducts(parseFilters(searchParams));
  return mobileJsonResponse(result);
}

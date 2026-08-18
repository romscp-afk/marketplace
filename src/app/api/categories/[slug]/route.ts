import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import {
  mobileErrorResponse,
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return mobileErrorResponse("Category not found", 404);
  }

  const products = await getProductsByCategory(slug);
  return mobileJsonResponse({ category, products });
}

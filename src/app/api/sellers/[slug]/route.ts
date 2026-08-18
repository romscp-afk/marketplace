import { getSellerBySlug, getProductsBySeller } from "@/data/seed";
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
  const seller = getSellerBySlug(slug);

  if (!seller) {
    return mobileErrorResponse("Seller not found", 404);
  }

  const products = getProductsBySeller(slug);
  return mobileJsonResponse({ seller, products });
}

import {
  getStorefrontProductsBySeller,
  getStorefrontSellerBySlug,
} from "@/lib/data/sellers";
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
  const seller = await getStorefrontSellerBySlug(slug);

  if (!seller) {
    return mobileErrorResponse("Seller not found", 404);
  }

  const products = await getStorefrontProductsBySeller(slug);
  return mobileJsonResponse({ seller, products });
}

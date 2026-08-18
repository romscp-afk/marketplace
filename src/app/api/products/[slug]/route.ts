import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { getReviewsForProduct } from "@/data/seed";
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
  const product = await getProductBySlug(slug);

  if (!product) {
    return mobileErrorResponse("Product not found", 404);
  }

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product),
    Promise.resolve(getReviewsForProduct(product.id)),
  ]);

  return mobileJsonResponse({ product, related, reviews });
}

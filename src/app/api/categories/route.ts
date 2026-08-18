import { getCategories } from "@/lib/data/categories";
import {
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET() {
  const categories = await getCategories();
  return mobileJsonResponse({ data: categories });
}

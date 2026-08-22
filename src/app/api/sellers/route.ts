import {
  getStorefrontSellers,
} from "@/lib/data/sellers";
import {
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET() {
  return mobileJsonResponse({ data: await getStorefrontSellers() });
}

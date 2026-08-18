import { seedSellers } from "@/data/seed";
import {
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET() {
  return mobileJsonResponse({ data: seedSellers });
}

import { manifest } from "@/config/manifest";

export async function GET() {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}

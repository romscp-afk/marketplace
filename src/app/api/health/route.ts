import { getPlatformStatus } from "@/lib/env";

export async function GET() {
  const status = getPlatformStatus();

  return Response.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      platform: status,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

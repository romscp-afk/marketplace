/** CORS + JSON helpers for mobile app API routes */

export const MOBILE_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

export function mobileJsonResponse(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: MOBILE_CORS_HEADERS,
  });
}

export function mobileErrorResponse(message: string, status = 400): Response {
  return mobileJsonResponse({ error: message }, status);
}

export function mobileOptionsResponse(): Response {
  return new Response(null, { status: 204, headers: MOBILE_CORS_HEADERS });
}

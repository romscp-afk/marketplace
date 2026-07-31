import { z } from "zod";

/** Public env vars — safe to expose to the browser */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: z
    .enum(["mock", "plausible", "google"])
    .default("mock"),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});

/** Server-only env vars — never import in client components */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  PAYMENT_PROVIDER: z.enum(["mock", "stripe", "paypal"]).default("mock"),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["mock", "sendgrid", "resend"]).default("mock"),
  EMAIL_API_KEY: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type Env = PublicEnv & ServerEnv;

/** Treat empty strings as undefined so blank .env entries don't fail validation */
function emptyToUndefined(value: string | undefined): string | undefined {
  return value === "" ? undefined : value;
}

function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined>,
): z.infer<T> {
  const parsed = schema.safeParse(source);
  if (parsed.success) return parsed.data;

  if (process.env.NODE_ENV === "production") {
    console.error("Invalid environment variables:", parsed.error.flatten());
    throw new Error("Invalid environment variables");
  }

  console.warn("Environment validation warnings:", parsed.error.flatten());
  return schema.parse({});
}

export const publicEnv = parseEnv(publicEnvSchema, {
  NEXT_PUBLIC_APP_URL: emptyToUndefined(process.env.NEXT_PUBLIC_APP_URL),
  NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: emptyToUndefined(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: emptyToUndefined(
    process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  ),
  NEXT_PUBLIC_ANALYTICS_ID: emptyToUndefined(process.env.NEXT_PUBLIC_ANALYTICS_ID),
});

export const serverEnv = parseEnv(serverEnvSchema, {
  NODE_ENV: emptyToUndefined(process.env.NODE_ENV),
  SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(process.env.SUPABASE_SERVICE_ROLE_KEY),
  PAYMENT_PROVIDER: emptyToUndefined(process.env.PAYMENT_PROVIDER),
  PAYMENT_WEBHOOK_SECRET: emptyToUndefined(process.env.PAYMENT_WEBHOOK_SECRET),
  EMAIL_PROVIDER: emptyToUndefined(process.env.EMAIL_PROVIDER),
  EMAIL_API_KEY: emptyToUndefined(process.env.EMAIL_API_KEY),
});

/** @deprecated Use publicEnv or serverEnv directly */
export const env: Env = { ...publicEnv, ...serverEnv };

export function isSupabaseConfigured(): boolean {
  return Boolean(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL &&
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}

export interface PlatformStatus {
  app: "ok";
  environment: string;
  supabase: "configured" | "not_configured";
  paymentProvider: string;
  emailProvider: string;
  analyticsProvider: string;
}

export function getPlatformStatus(): PlatformStatus {
  return {
    app: "ok",
    environment: serverEnv.NODE_ENV,
    supabase: isSupabaseConfigured() ? "configured" : "not_configured",
    paymentProvider: serverEnv.PAYMENT_PROVIDER,
    emailProvider: serverEnv.EMAIL_PROVIDER,
    analyticsProvider: publicEnv.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  };
}

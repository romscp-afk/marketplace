import Link from "next/link";
import { brand } from "@/config/brand";

export default function SellerRootPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold">Seller portal</h1>
      <p className="text-muted mt-3 text-sm">
        Manage your store, products, and orders on {brand.name}. Seller operations are available
        to approved accounts after sign-in.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/seller/apply"
          className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
        >
          Apply to sell
        </Link>
        <Link
          href="/account/login?redirect=/seller/dashboard"
          className="border-border hover:bg-background inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-medium"
        >
          Sign in to dashboard
        </Link>
      </div>
    </div>
  );
}

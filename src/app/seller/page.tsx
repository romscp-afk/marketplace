import Link from "next/link";
import { brand } from "@/config/brand";

export default function SellerRootPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold">Supplier dashboard</h1>
      <p className="text-muted mt-3 text-sm">
        Publish products, manage your store, and fulfil orders on {brand.name}.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/seller/register"
          className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
        >
          Create supplier account
        </Link>
        <Link
          href="/account/login?redirect=/seller/dashboard"
          className="border-border hover:bg-background inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-medium"
        >
          Sign in to dashboard
        </Link>
      </div>
      <p className="text-muted mt-6 text-xs">
        Need a full business review later? You can still{" "}
        <Link href="/seller/apply" className="text-primary hover:underline">
          submit a supplier application
        </Link>
        .
      </p>
    </div>
  );
}

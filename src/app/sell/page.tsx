import Link from "next/link";
import { brand } from "@/config/brand";

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">
        Supply on {brand.name}
      </h1>
      <p className="text-muted mt-4 text-lg">
        Give your catalogue a storefront. Suppliers publish products, manage stock, and sell to
        customers in Singapore.
      </p>

      <div className="mt-8 space-y-6">
        {[
          {
            step: "1",
            title: "Create a supplier account",
            desc: "Register your store name and sign in to the supplier dashboard.",
          },
          {
            step: "2",
            title: "Add products",
            desc: "Enter title, price, stock, category, and an image URL.",
          },
          {
            step: "3",
            title: "Publish",
            desc: "Set status to Active and the product appears on Aromza immediately.",
          },
          {
            step: "4",
            title: "Fulfil orders",
            desc: "Track sales and ship from the same dashboard.",
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4">
            <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {step}
            </span>
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/seller/register"
          className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-medium"
        >
          Create supplier account
        </Link>
        <Link
          href="/account/login?redirect=/seller/dashboard"
          className="border-border hover:bg-background inline-flex h-12 items-center justify-center rounded-lg border px-6 text-base font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

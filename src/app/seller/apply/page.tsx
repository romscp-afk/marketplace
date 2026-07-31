"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SellerSidebar } from "@/components/seller/sidebar";
import { sellerNavigation } from "@/config/seller-navigation";
import { navigation } from "@/config/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitSellerApplication, type ActionResult } from "@/lib/seller/actions";

const initialState: ActionResult | null = null;

export default function SellerApplyPage() {
  const [state, formAction, isPending] = useActionState(submitSellerApplication, initialState);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <SellerSidebar items={sellerNavigation.apply} />

        <div className="max-w-xl">
          <h1 className="font-display mb-2 text-2xl font-semibold">Seller application</h1>
          <p className="text-muted mb-8 text-sm">
            Tell us about your business. Our team will review your application within 3–5 business days.
          </p>

          <form action={formAction} className="space-y-5">
            <Input label="Store name" name="storeName" required placeholder="Your store name" />
            <Textarea
              label="Store description"
              name="storeDescription"
              required
              placeholder="Describe what you sell and what makes your store unique"
              rows={4}
            />
            <Input label="Business name" name="businessName" required />
            <Input
              label="Business registration number"
              name="businessRegistration"
              hint="Optional — required in some jurisdictions"
            />

            <fieldset>
              <legend className="mb-2 block text-sm font-medium">Product categories</legend>
              <div className="space-y-2">
                {navigation.categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat.slug}
                      className="h-4 w-4 rounded"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="termsAccepted"
                value="true"
                required
                className="mt-0.5 h-4 w-4 rounded"
              />
              <span>
                I agree to the seller terms and confirm all information is accurate.
              </span>
            </label>

            {state && !state.success ? (
              <p className="text-error text-sm" role="alert">{state.error}</p>
            ) : null}

            <div className="flex gap-3">
              <Button type="submit" isLoading={isPending}>
                Submit application
              </Button>
              <Link
                href="/seller/apply/status"
                className="border-border hover:bg-background inline-flex h-11 items-center rounded-lg border px-5 text-sm font-medium"
              >
                View status
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SellerSidebar } from "@/components/seller/sidebar";
import { sellerNavigation } from "@/config/seller-navigation";
import { navigation } from "@/config/navigation";
import { brand } from "@/config/brand";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { submitSellerApplication, type ActionResult } from "@/lib/seller/actions";
import { getCountrySelectOptions, getPhoneCodeSelectOptions } from "@/data/countries";
import { useForm } from "react-hook-form";

const initialState: ActionResult | null = null;
const TERMS_VERSION = "1.0";

export default function SellerApplyPage() {
  const [state, formAction, isPending] = useActionState(submitSellerApplication, initialState);
  const phoneForm = useForm<{ phoneCountryCode: string; phone: string }>({
    defaultValues: { phoneCountryCode: brand.locale.phoneCountryCode, phone: "" },
  });
  const countryOptions = getCountrySelectOptions(brand.locale.country, [
    ...brand.locale.deliveryCountries,
  ]);
  const phoneCodeOptions = getPhoneCodeSelectOptions(brand.locale.country);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <SellerSidebar items={sellerNavigation.apply} />

        <div className="max-w-xl">
          <h1 className="font-display mb-2 text-2xl font-semibold">Seller application</h1>
          <p className="text-muted mb-8 text-sm">
            Tell us about your business. Applications are reviewed within 3–5 business days.
            All fields marked with * are required.
          </p>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="termsVersion" value={TERMS_VERSION} />
            <input type="hidden" name="addressCountry" value={brand.locale.country} />

            <Input label="Store name" name="storeName" required placeholder="Your store name" />
            <Textarea
              label="Store description"
              name="storeDescription"
              required
              placeholder="Describe what you sell and what makes your store unique"
              rows={4}
            />
            <Input label="Business name" name="businessName" required />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Owner first name" name="ownerFirstName" required />
              <Input label="Owner last name" name="ownerLastName" required />
            </div>

            <Input
              label="Contact email"
              name="contactEmail"
              type="email"
              required
              defaultValue=""
            />

            <input
              type="hidden"
              name="contactPhoneCountryCode"
              value={phoneForm.watch("phoneCountryCode")}
            />
            <PhoneInput
              label="Contact phone"
              required
              countryCodeName="contactPhoneCountryCodeDisplay"
              countryCodeValue={phoneForm.watch("phoneCountryCode")}
              onCountryCodeChange={(value) => phoneForm.setValue("phoneCountryCode", value)}
              countryCodeOptions={phoneCodeOptions}
              name="contactPhone"
            />

            <Input
              label="Business registration number"
              name="businessRegistration"
              hint="Required for registered businesses in Singapore"
            />

            <Input label="Business address line 1" name="addressLine1" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" name="addressCity" required defaultValue="Singapore" />
              <Input label="Postal code" name="addressPostalCode" required />
            </div>

            <Select
              label="Business country"
              name="addressCountryReadonly"
              options={countryOptions}
              defaultValue={brand.locale.country}
              disabled
            />
            <p className="text-muted -mt-3 text-xs">Launch market: {brand.locale.countryName}</p>

            <Select
              label="Preferred payout method"
              name="payoutMethod"
              required
              options={[
                { value: "bank_transfer", label: "Bank transfer" },
                { value: "paynow", label: "PayNow" },
              ]}
              defaultValue="paynow"
            />
            <Input label="Payout account name" name="payoutAccountName" required />
            <Input
              label="Payout account reference"
              name="payoutAccountReference"
              required
              hint="Bank account number or PayNow mobile/NRIC (stored securely)"
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
                I agree to the{" "}
                <Link href="/legal/seller-policy" target="_blank" className="text-primary underline">
                  Seller Agreement
                </Link>{" "}
                (version {TERMS_VERSION}, updated 2026-07-31) and confirm all information is
                accurate.
              </span>
            </label>

            {state && !state.success ? (
              <p className="text-error text-sm" role="alert">
                {state.error}
              </p>
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

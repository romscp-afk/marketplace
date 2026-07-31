"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { brand } from "@/config/brand";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  getCountrySelectOptions,
  getCountryName,
  getPhoneCodeSelectOptions,
  formatPhoneNumber,
} from "@/data/countries";
import { analytics } from "@/lib/analytics";
import { placeOrder } from "@/lib/commerce/actions";

const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "address", label: "Delivery" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

const contactSchema = z.object({
  email: z.string().email("Valid email required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phoneCountryCode: z.string().min(1, "Country code required"),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  line1: z.string().min(1, "Address required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  postalCode: z.string().min(1, "Postal code required"),
  country: z.string().min(1, "Country required"),
});

type ContactForm = z.infer<typeof contactSchema>;
type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { activeItems, subtotal, discount, couponCode, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [contactData, setContactData] = useState<ContactForm | null>(null);
  const [addressData, setAddressData] = useState<AddressForm | null>(null);

  const deliveryFee =
    subtotal >= brand.delivery.freeShippingThreshold ? 0 : brand.delivery.defaultFee;
  const shippingCost = shippingMethod === "express" ? 12.99 : deliveryFee;
  const total = subtotal - discount + shippingCost;

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phoneCountryCode: brand.locale.phoneCountryCode,
    },
  });

  const countryOptions = getCountrySelectOptions(brand.locale.country, [
    ...brand.locale.deliveryCountries,
  ]);
  const phoneCodeOptions = getPhoneCodeSelectOptions(brand.locale.country);

  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: brand.locale.country },
  });

  useEffect(() => {
    if (activeItems.length > 0) {
      analytics.checkoutStarted(activeItems.length);
    }
  }, [activeItems.length]);

  if (activeItems.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-muted mt-2 text-sm">
          Add items to your cart before checking out.
        </p>
        <Link
          href="/search"
          className="bg-primary text-primary-foreground hover:bg-primary-dark mt-6 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleContactSubmit = contactForm.handleSubmit((data) => {
    setContactData(data);
    setCurrentStep(1);
    analytics.checkoutStepCompleted("contact");
  });

  const handleAddressSubmit = addressForm.handleSubmit((data) => {
    setAddressData(data);
    setCurrentStep(2);
    analytics.checkoutStepCompleted("address");
  });

  const handlePayment = () => {
    if (!contactData || !addressData) return;

    setCheckoutError(null);
    startTransition(async () => {
      analytics.checkoutStepCompleted("payment");

      const result = await placeOrder({
        items: activeItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.selectedVariant?.price ?? item.product.price,
          title: item.product.title,
          variantName: item.selectedVariant?.name,
          sellerId: item.product.sellerId,
          sellerName: item.product.seller.storeName,
          imageUrl: item.product.images[0],
          isReturnEligible: item.product.isReturnEligible,
        })),
        contact: contactData,
        address: {
          ...addressData,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone
            ? formatPhoneNumber(contactData.phoneCountryCode, contactData.phone)
            : undefined,
        },
        shippingMethod,
        subtotal,
        discount,
        deliveryFee: shippingCost,
        total,
        couponCode,
      });

      if (!result.success) {
        setCheckoutError(result.error);
        return;
      }

      analytics.paymentAttempted(result.orderId);
      analytics.purchaseCompleted(result.orderId, total);
      clearCart();
      router.push(`/checkout/confirmation?order=${result.orderNumber}`);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display mb-8 text-2xl font-semibold">Checkout</h1>

      <nav aria-label="Checkout progress" className="mb-8">
        <ol className="flex items-center gap-2 overflow-x-auto">
          {STEPS.map((step, i) => (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  i < currentStep
                    ? "bg-success text-white"
                    : i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-border text-muted"
                }`}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  i === currentStep ? "font-medium" : "text-muted"
                }`}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="text-border mx-1 hidden h-px w-6 sm:block" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {currentStep === 0 ? (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold">Contact information</h2>
              <p className="text-muted text-sm">
                Guest checkout supported. You can create an account after your order.
              </p>
              <Input
                label="Email address"
                type="email"
                required
                error={contactForm.formState.errors.email?.message}
                {...contactForm.register("email")}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  required
                  error={contactForm.formState.errors.firstName?.message}
                  {...contactForm.register("firstName")}
                />
                <Input
                  label="Last name"
                  required
                  error={contactForm.formState.errors.lastName?.message}
                  {...contactForm.register("lastName")}
                />
              </div>
              <PhoneInput
                label="Phone number"
                hint="Optional — for delivery updates"
                countryCodeName="phoneCountryCode"
                countryCodeValue={contactForm.watch("phoneCountryCode")}
                onCountryCodeChange={(value) =>
                  contactForm.setValue("phoneCountryCode", value, { shouldValidate: true })
                }
                countryCodeOptions={phoneCodeOptions}
                countryCodeError={contactForm.formState.errors.phoneCountryCode?.message}
                error={contactForm.formState.errors.phone?.message}
                {...contactForm.register("phone")}
              />
              <Button type="submit" fullWidth>
                Continue to delivery
              </Button>
            </form>
          ) : null}

          {currentStep === 1 ? (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold">Delivery address</h2>
              <p className="text-muted text-sm">
                Delivery is currently available within {brand.locale.countryName} only. All prices
                are shown in {brand.locale.currency}.
              </p>
              <Input
                label="Address line 1"
                required
                error={addressForm.formState.errors.line1?.message}
                {...addressForm.register("line1")}
              />
              <Input
                label="Address line 2"
                hint="Apartment, suite, etc."
                {...addressForm.register("line2")}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  required
                  error={addressForm.formState.errors.city?.message}
                  {...addressForm.register("city")}
                />
                <Input
                  label="State / Province"
                  required
                  error={addressForm.formState.errors.state?.message}
                  {...addressForm.register("state")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Postal code"
                  required
                  error={addressForm.formState.errors.postalCode?.message}
                  {...addressForm.register("postalCode")}
                />
              <Controller
                name="country"
                control={addressForm.control}
                render={({ field }) => (
                  <Select
                    label="Country"
                    required
                    options={countryOptions}
                    error={addressForm.formState.errors.country?.message}
                    {...field}
                  />
                )}
              />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button type="submit" fullWidth>
                  Continue to shipping
                </Button>
              </div>
            </form>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Delivery option</h2>
              {[
                {
                  id: "standard" as const,
                  label: "Standard delivery",
                  desc: `${brand.delivery.defaultEstimateDays.min}–${brand.delivery.defaultEstimateDays.max} business days`,
                  price: deliveryFee,
                },
                {
                  id: "express" as const,
                  label: "Express delivery",
                  desc: "1–2 business days",
                  price: 12.99,
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                    shippingMethod === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingMethod === option.id}
                    onChange={() => setShippingMethod(option.id)}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-muted text-xs">{option.desc}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {option.price === 0 ? "Free" : formatCurrency(option.price)}
                  </span>
                </label>
              ))}
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    setCurrentStep(3);
                    analytics.checkoutStepCompleted("shipping");
                  }}
                >
                  Continue to payment
                </Button>
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Payment method</h2>
              <div className="bg-background rounded-xl border border-border border-dashed p-6 text-center">
                <p className="text-muted text-sm">
                  Mock payment provider active for development.
                </p>
                <p className="text-muted mt-1 text-xs">
                  Configure Stripe or PayPal via PAYMENT_PROVIDER when ready for production.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    setCurrentStep(4);
                    analytics.checkoutStepCompleted("payment_method");
                  }}
                >
                  Review order
                </Button>
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Review your order</h2>
              {contactData ? (
                <div className="bg-surface rounded-xl border border-border p-4 text-sm">
                  <p className="font-medium">Contact</p>
                  <p className="text-muted">
                    {contactData.firstName} {contactData.lastName} · {contactData.email}
                    {contactData.phone
                      ? ` · ${formatPhoneNumber(contactData.phoneCountryCode, contactData.phone)}`
                      : ""}
                  </p>
                </div>
              ) : null}
              {addressData ? (
                <div className="bg-surface rounded-xl border border-border p-4 text-sm">
                  <p className="font-medium">Delivery to</p>
                  <p className="text-muted">
                    {addressData.line1}, {addressData.city}, {addressData.state}{" "}
                    {addressData.postalCode}, {getCountryName(addressData.country)}
                  </p>
                </div>
              ) : null}
              {checkoutError ? (
                <p className="text-error text-sm" role="alert">{checkoutError}</p>
              ) : null}
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button fullWidth isLoading={isPending} onClick={handlePayment}>
                  Place order · {formatCurrency(total)}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-surface h-fit rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Order summary ({activeItems.length})
          </h2>
          <div className="max-h-48 space-y-3 overflow-y-auto">
            {activeItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="ml-2 shrink-0">
                  {formatCurrency(
                    (item.selectedVariant?.price ?? item.product.price) * item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="border-border mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>
                {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

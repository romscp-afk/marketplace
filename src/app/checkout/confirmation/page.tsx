import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface ConfirmationPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="bg-success/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <CheckCircle className="text-success h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="font-display text-2xl font-semibold">Order confirmed!</h1>
      <p className="text-muted mt-2 text-sm">
        Thank you for your purchase. A confirmation email will be sent shortly.
      </p>
      {order ? (
        <p className="mt-4 text-sm">
          Order number:{" "}
          <span className="font-mono font-semibold">{order}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/account/orders"
          className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
        >
          View order
        </Link>
        <Link
          href="/search"
          className="border-border hover:bg-background inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
      <p className="text-muted mt-8 text-xs">
        Want to track orders and save addresses?{" "}
        <Link href="/account" className="text-primary font-medium hover:underline">
          Create an account
        </Link>{" "}
        using the email from your order — no need to re-enter your details.
      </p>
    </div>
  );
}

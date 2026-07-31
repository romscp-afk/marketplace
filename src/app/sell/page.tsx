import Link from "next/link";
import { brand } from "@/config/brand";

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">
        Sell on {brand.name}
      </h1>
      <p className="text-muted mt-4 text-lg">
        Join our community of independent sellers and reach customers nationwide.
      </p>

      <div className="mt-8 space-y-6">
        {[
          {
            step: "1",
            title: "Apply to sell",
            desc: "Submit your business details, store information, and required documents.",
          },
          {
            step: "2",
            title: "Get approved",
            desc: "Our team reviews your application and verifies your business.",
          },
          {
            step: "3",
            title: "List products",
            desc: "Create your store, upload products, and set your prices.",
          },
          {
            step: "4",
            title: "Start selling",
            desc: "Receive orders, fulfil shipments, and get paid on schedule.",
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

      <Link
        href="/seller/apply"
        className="bg-primary text-primary-foreground hover:bg-primary-dark mt-10 inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-medium"
      >
        Start your application
      </Link>

      <p className="text-muted mt-4 text-xs">
        Already approved? <Link href="/seller/dashboard" className="text-primary hover:underline">Go to dashboard</Link>
      </p>
    </div>
  );
}

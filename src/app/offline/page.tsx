import Link from "next/link";
import { WifiOff } from "lucide-react";
import { brand } from "@/config/brand";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <WifiOff className="text-muted mb-4 h-12 w-12" aria-hidden="true" />
      <h1 className="font-display text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted mt-2 max-w-sm text-sm">
        Check your internet connection and try again. Some previously viewed
        pages may still be available.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary-dark mt-6 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
      >
        Go to {brand.name}
      </Link>
    </div>
  );
}

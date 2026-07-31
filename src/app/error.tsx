"use client";

import { useEffect } from "react";
import Link from "next/link";
import { brand } from "@/config/brand";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted mt-2 max-w-sm text-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary-dark mt-6 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors"
      >
        Try again
      </button>
      <Link
        href="/"
        className="text-primary mt-3 text-sm font-medium hover:underline"
      >
        Return to {brand.name}
      </Link>
    </div>
  );
}

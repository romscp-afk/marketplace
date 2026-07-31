import Link from "next/link";
import { brand } from "@/config/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted text-sm font-medium">404</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="text-muted mt-2 max-w-sm text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary-dark mt-6 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors"
      >
        Back to {brand.name}
      </Link>
    </div>
  );
}

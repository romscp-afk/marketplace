import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Use white pill background for emerald/dark surfaces */
  onDark?: boolean;
  height?: number;
  className?: string;
  href?: string;
  priority?: boolean;
}

export function BrandLogo({
  onDark = false,
  height = 28,
  className,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * 3.6);

  const logo = (
    <Image
      src={brand.logo.full}
      alt={brand.name}
      width={width}
      height={height}
      className={cn("object-contain object-left", className)}
      style={{ height, width: "auto", maxWidth: width }}
      priority={priority}
    />
  );

  const content = onDark ? (
    <span className="inline-flex rounded bg-white px-2 py-0.5">{logo}</span>
  ) : (
    logo
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center" aria-label={brand.name}>
        {content}
      </Link>
    );
  }

  return content;
}

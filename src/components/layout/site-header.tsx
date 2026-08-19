"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

/** Hide default site header on mobile marketplace tabs — each screen has its own header. */
function hideMobileMarketplaceHeader(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/search" || pathname.startsWith("/search/")) return true;
  if (pathname === "/cart") return true;
  if (pathname === "/account") return true;
  if (pathname === "/account/wishlist") return true;
  return false;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <div className={hideMobileMarketplaceHeader(pathname) ? "hidden md:block" : undefined}>
      <Header />
    </div>
  );
}

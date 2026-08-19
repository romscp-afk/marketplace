"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

/** Mobile marketplace tabs use their own in-page headers. */
function hideOnMobile(pathname: string): boolean {
  if (pathname === "/search" || pathname.startsWith("/search/")) return true;
  if (pathname === "/cart") return true;
  if (pathname === "/account") return true;
  if (pathname === "/account/wishlist") return true;
  return false;
}

export function SiteHeader() {
  const pathname = usePathname();

  // Home uses Taobao/mobile headers on all screen sizes
  if (pathname === "/") return null;

  return (
    <div className={hideOnMobile(pathname) ? "hidden md:block" : undefined}>
      <Header />
    </div>
  );
}

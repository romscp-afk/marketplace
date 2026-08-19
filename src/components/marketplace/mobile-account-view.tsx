"use client";

import Link from "next/link";
import {
  ChevronRight,
  Heart,
  HelpCircle,
  Package,
  Settings,
  Star,
  Ticket,
  User,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";

const MENU_ITEMS = [
  { icon: Package, label: "My Purchases", href: "/account/orders" },
  { icon: Heart, label: "My Likes", href: "/account/wishlist" },
  { icon: Ticket, label: "My Vouchers", href: "/account" },
  { icon: Star, label: "My Reviews", href: "/account" },
  { icon: HelpCircle, label: "Help Centre", href: "/legal/help" },
  { icon: Settings, label: "Settings", href: "/account/security" },
];

const ORDER_ITEMS = [
  { icon: Package, label: "To Pay" },
  { icon: Package, label: "To Ship" },
  { icon: Package, label: "To Receive" },
  { icon: Star, label: "To Review" },
];

interface MobileAccountViewProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function MobileAccountView({ userName, userEmail }: MobileAccountViewProps) {
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const displayName = userName ?? "Guest User";

  return (
    <div className="bg-background pb-6 md:hidden">
      <div className="bg-header px-4 pt-4 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/25">
            <User className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{displayName}</p>
            {userEmail ? (
              <p className="text-sm text-white/90">{userEmail}</p>
            ) : (
              <Link
                href="/account/login"
                className="mt-1 inline-flex items-center gap-1 text-[13px] text-white"
              >
                Login / Sign Up
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="bg-surface mt-4 flex rounded py-3.5">
          {[
            { value: itemCount, label: "Cart" },
            { value: productIds.length, label: "Likes" },
            { value: 0, label: "Vouchers" },
            { value: 0, label: "Orders" },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <span className="text-price text-lg font-extrabold">{stat.value}</span>
                <span className="text-muted mt-1 text-[11px]">{stat.label}</span>
              </div>
              {i < arr.length - 1 ? <div className="bg-border h-8 w-px" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface mt-2 p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold text-foreground">My Purchase</span>
          <Link href="/account/orders" className="text-primary text-[13px]">
            View History ›
          </Link>
        </div>
        <div className="flex justify-around">
          {ORDER_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <Icon className="text-foreground h-6 w-6" aria-hidden="true" />
                <span className="text-muted text-[11px]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface mt-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="border-border flex items-center gap-3 border-b px-3.5 py-3.5 last:border-b-0"
            >
              <Icon className="text-muted h-[22px] w-[22px]" aria-hidden="true" />
              <span className="flex-1 text-sm text-foreground">{item.label}</span>
              <ChevronRight className="text-muted h-4 w-4" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

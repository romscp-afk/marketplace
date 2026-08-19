"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Ticket,
  Truck,
  Store,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { marketplaceUi } from "@/config/marketplace-ui";

const iconMap: Record<string, LucideIcon> = {
  flash: Zap,
  voucher: Ticket,
  freeship: Truck,
  mall: Store,
  deals: Tag,
};

export function QuickActions() {
  return (
    <div className="bg-surface flex border-b border-border">
      {marketplaceUi.quickActions.map((action) => {
        const Icon = iconMap[action.id] ?? Tag;
        return (
          <Link
            key={action.id}
            href={action.path}
            className="flex flex-1 flex-col items-center py-3"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${action.color}18` }}
            >
              <Icon className="h-5 w-5" style={{ color: action.color }} aria-hidden="true" />
            </span>
            <span className="mt-1.5 text-center text-[10px] text-foreground">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

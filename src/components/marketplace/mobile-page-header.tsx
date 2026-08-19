"use client";

import { cn } from "@/lib/utils";

interface MobilePageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function MobilePageHeader({ title, children, className }: MobilePageHeaderProps) {
  return (
    <div className={cn("bg-header px-3 pt-2 pb-2.5 text-white md:hidden", className)}>
      <h1 className="mb-2 text-base font-bold">{title}</h1>
      {children}
    </div>
  );
}

import Link from "next/link";
import { brand } from "@/config/brand";

export function AnnouncementBar() {
  if (!brand.announcement.enabled) return null;

  return (
    <div
      className="bg-primary text-primary-foreground relative px-4 py-2 text-center text-sm"
      role="region"
      aria-label="Announcement"
    >
      <p>
        {brand.announcement.message}
        {brand.announcement.link ? (
          <>
            {" "}
            <Link
              href={brand.announcement.link}
              className="font-medium underline underline-offset-2 hover:no-underline"
            >
              {brand.announcement.linkText}
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

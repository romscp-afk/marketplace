import Link from "next/link";
import { brand } from "@/config/brand";
import { navigation } from "@/config/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <BrandLogo variant="light" height={30} />
            <p className="text-primary-foreground/70 mt-3 text-sm">
              {brand.tagline}
            </p>
          </div>

          <FooterColumn title="Help" links={navigation.footer.help} />
          <FooterColumn title="Company" links={navigation.footer.company} />
          <FooterColumn title="Sellers" links={navigation.footer.sellers} />
          <FooterColumn title="Legal" links={navigation.footer.legal} />
        </div>

        <div className="border-primary-foreground/20 mt-10 border-t pt-6">
          <p className="text-primary-foreground/60 text-center text-xs sm:text-left">
            &copy; {currentYear}{" "}
            <a
              href={brand.copyright.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-2 transition-colors"
            >
              {brand.copyright.holder}
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

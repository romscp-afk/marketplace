import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";

export interface SitePageContent {
  title: string;
  description: string;
  sections: { heading?: string; body: string[] }[];
  lastUpdated?: string;
}

export const sitePages = {
  "help-center": {
    title: "Help Center",
    description: "Find answers and get support for shopping on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "Welcome to the " + brand.name + " Help Center. Browse topics below or contact our support team for personalised assistance.",
        ],
      },
      {
        heading: "Orders & delivery",
        body: [
          "Track orders from My Account → Orders after signing in.",
          "Standard delivery within Singapore typically takes 3–7 business days.",
          "Free delivery applies to qualifying orders over S$" + brand.delivery.freeShippingThreshold + ".",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Eligible items may be returned within " + brand.returns.windowDays + " days. See our Returns & Refunds policy for full details.",
        ],
      },
    ],
  },
  "help-returns": {
    title: "Returns & Refunds",
    description: "How to return eligible items and request refunds on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We want you to shop with confidence. If an item is eligible for return, you may request a refund within " +
            brand.returns.windowDays +
            " days of delivery.",
        ],
      },
      {
        heading: "Eligible items",
        body: [
          "Items marked as return-eligible on the product page.",
          "Products must be unused, in original packaging, and include proof of purchase.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Sign in to My Account → Orders.",
          "Select the order and choose Request return.",
          "Our team will review your request within 2 business days.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds are processed to the original payment method within 5–10 business days.",
          "Delivery fees are non-refundable unless the return is due to seller error or a defective item.",
        ],
      },
    ],
  },
  "help-contact": {
    title: "Contact Us",
    description: "Get in touch with the " + brand.name + " support team.",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "Our customer support team is available Monday–Friday, 9:00–18:00 SGT (excluding public holidays).",
        ],
      },
      {
        heading: "Customer support",
        body: [
          "Email: " + brand.contact.supportEmail,
          "Address: " + brand.contact.businessAddress,
        ],
      },
      {
        heading: "Seller support",
        body: [
          "Sellers can reach dedicated support via the Seller Support page or seller portal settings.",
        ],
      },
    ],
  },
  about: {
    title: "About Us",
    description: "Learn about " + brand.name + " and our mission.",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          brand.name +
            " is a curated multi-vendor marketplace connecting independent sellers with customers who value quality, trust, and discovery.",
          "We verify sellers, moderate listings, and provide secure checkout so you can shop with confidence.",
        ],
      },
      {
        heading: "Our promise",
        body: [
          "Curated assortment from approved independent sellers.",
          "Transparent pricing in Singapore dollars.",
          "Secure payments and responsive customer support.",
        ],
      },
    ],
  },
  careers: {
    title: "Careers",
    description: "Join the team building " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We are growing our team across engineering, operations, seller success, and customer experience.",
          "Send your CV and area of interest to " + brand.contact.supportEmail + " with the subject line Careers.",
        ],
      },
    ],
  },
  press: {
    title: "Press",
    description: "Media enquiries for " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "For press and media enquiries, contact " + brand.contact.supportEmail + ".",
          "Please include your publication, deadline, and topics of interest.",
        ],
      },
    ],
  },
  sustainability: {
    title: "Sustainability",
    description: "Our approach to responsible commerce on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We work with sellers who share our commitment to responsible sourcing and packaging.",
          "We prioritise consolidated delivery routes within Singapore to reduce unnecessary shipments.",
        ],
      },
    ],
  },
  "seller-guidelines": {
    title: "Seller Guidelines",
    description: "Standards and requirements for selling on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "All sellers must provide accurate product information, honour stated delivery times, and respond to customer enquiries within 2 business days.",
        ],
      },
      {
        heading: "Listing requirements",
        body: [
          "Clear titles, accurate descriptions, and representative product images.",
          "Pricing in SGD including applicable fees disclosed at checkout.",
          "Inventory kept up to date to avoid overselling.",
        ],
      },
      {
        heading: "Prohibited items",
        body: [
          "Counterfeit goods, restricted substances, and items that violate Singapore law are not permitted.",
        ],
      },
    ],
  },
  "seller-support": {
    title: "Seller Support",
    description: "Help for approved sellers on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "Approved sellers can manage products, orders, and payouts through the Seller Portal.",
          "For onboarding or account issues, email " + brand.contact.supportEmail + " with your store name.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description: "Terms governing use of " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "By using " +
            brand.name +
            ", you agree to these Terms of Service. If you do not agree, please do not use the platform.",
        ],
      },
      {
        heading: "Marketplace role",
        body: [
          brand.name +
            " provides a platform connecting buyers and independent sellers. We are not the seller of record for third-party listings unless explicitly stated.",
        ],
      },
      {
        heading: "Accounts",
        body: [
          "You are responsible for safeguarding your account credentials.",
          "You must provide accurate registration information.",
        ],
      },
      {
        heading: "Orders & payments",
        body: [
          "Prices are displayed in Singapore dollars (SGD) unless otherwise stated.",
          "Payment is collected at checkout. Order confirmation does not guarantee acceptance if an item is unavailable.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "How " + brand.name + " collects and uses personal data.",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We collect information you provide at registration, checkout, and when contacting support.",
          "We use this data to process orders, provide customer service, and improve the platform.",
        ],
      },
      {
        heading: "Data sharing",
        body: [
          "Order fulfilment data is shared with relevant sellers to deliver your purchase.",
          "We use trusted payment and infrastructure providers bound by contractual data protection obligations.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You may request access, correction, or deletion of personal data by contacting " +
            brand.contact.supportEmail +
            ".",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description: "How " + brand.name + " uses cookies and similar technologies.",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We use essential cookies for authentication, cart persistence, and security.",
          "Analytics cookies help us understand how the site is used so we can improve performance.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "You can control non-essential cookies through your browser settings. Disabling essential cookies may limit site functionality.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility",
    description: "Our commitment to accessible shopping on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    sections: [
      {
        body: [
          "We aim to conform to WCAG 2.1 Level AA across customer-facing journeys.",
          "If you encounter a barrier, contact " + brand.contact.supportEmail + " and we will assist promptly.",
        ],
      },
    ],
  },
  "seller-policy": {
    title: "Seller Agreement",
    description: "Terms governing sellers on " + brand.name + ".",
    lastUpdated: "2026-07-31",
    version: "1.0",
    sections: [
      {
        body: [
          "This Seller Agreement applies when you apply to sell or operate a store on " +
            brand.name +
            ". By submitting an application or listing products, you agree to these terms.",
        ],
      },
      {
        heading: "Commission & payouts",
        body: [
          "Standard commission rate: " + brand.commission.defaultRate * 100 + "% per completed sale.",
          "Minimum payout threshold: S$" + brand.commission.minimumPayout + ".",
        ],
      },
      {
        heading: "Seller obligations",
        body: [
          "Provide accurate business information and maintain valid contact details.",
          "Ship orders within stated delivery windows and honour return policies.",
          "Do not list prohibited or misleading products.",
        ],
      },
      {
        heading: "Consent record",
        body: [
          "Application submissions record acceptance of this agreement version 1.0 (last updated 2026-07-31).",
        ],
      },
    ],
  },
} as const satisfies Record<string, SitePageContent & { version?: string }>;

export type SitePageId = keyof typeof sitePages;

interface SitePageProps {
  page: SitePageContent & { version?: string };
}

export function SitePage({ page }: SitePageProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold">{page.title}</h1>
        <p className="text-muted mt-2 text-sm">{page.description}</p>
        {page.lastUpdated ? (
          <p className="text-muted mt-2 text-xs">
            Last updated: {page.lastUpdated}
            {page.version ? ` · Version ${page.version}` : ""}
          </p>
        ) : null}
      </header>
      <div className="space-y-8">
        {page.sections.map((section, index) => (
          <section key={index}>
            {section.heading ? (
              <h2 className="mb-3 text-lg font-semibold">{section.heading}</h2>
            ) : null}
            <div className="text-muted space-y-3 text-sm leading-relaxed">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="mt-10 border-t border-border pt-6">
        <Link href="/" className="text-primary text-sm font-medium hover:underline">
          ← Back to home
        </Link>
      </footer>
    </article>
  );
}

export function sitePageMetadata(page: SitePageContent): Metadata {
  return {
    title: page.title,
    description: page.description,
  };
}

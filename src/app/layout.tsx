import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { brand } from "@/config/brand";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PwaInstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { CartProvider } from "@/contexts/cart-context";
import { CartFeedbackProvider } from "@/components/commerce/cart-feedback";
import { WishlistProvider } from "@/contexts/wishlist-context";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: brand.locale.default,
    siteName: brand.name,
    title: brand.name,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={brand.locale.default.split("-")[0]}>
      <body
        className={`${fraunces.variable} ${inter.variable} flex min-h-screen flex-col antialiased`}
      >
        <CartProvider>
          <CartFeedbackProvider>
            <WishlistProvider>
              <div className="hidden md:block">
                <AnnouncementBar />
              </div>
              <SiteHeader />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <div className="hidden md:block">
                <Footer />
              </div>
              <MobileBottomNav />
              <PwaInstallPrompt />
              <ServiceWorkerRegistration />
            </WishlistProvider>
          </CartFeedbackProvider>
        </CartProvider>
      </body>
    </html>
  );
}

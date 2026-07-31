import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["seller-support"]);

export default function SellerSupportPage() {
  return <SitePage page={sitePages["seller-support"]} />;
}

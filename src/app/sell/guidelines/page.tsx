import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["seller-guidelines"]);

export default function SellerGuidelinesPage() {
  return <SitePage page={sitePages["seller-guidelines"]} />;
}

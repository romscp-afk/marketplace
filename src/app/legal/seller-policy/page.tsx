import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["seller-policy"]);

export default function SellerPolicyPage() {
  return <SitePage page={sitePages["seller-policy"]} />;
}

import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.sustainability);

export default function SustainabilityPage() {
  return <SitePage page={sitePages.sustainability} />;
}

import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.accessibility);

export default function AccessibilityPage() {
  return <SitePage page={sitePages.accessibility} />;
}

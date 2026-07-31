import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.privacy);

export default function PrivacyPage() {
  return <SitePage page={sitePages.privacy} />;
}

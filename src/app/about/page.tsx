import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.about);

export default function AboutPage() {
  return <SitePage page={sitePages.about} />;
}

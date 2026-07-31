import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.cookies);

export default function CookiesPage() {
  return <SitePage page={sitePages.cookies} />;
}

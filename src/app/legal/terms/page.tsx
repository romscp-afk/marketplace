import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.terms);

export default function TermsPage() {
  return <SitePage page={sitePages.terms} />;
}

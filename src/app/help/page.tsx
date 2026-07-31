import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["help-center"]);

export default function HelpCenterPage() {
  return <SitePage page={sitePages["help-center"]} />;
}

import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["help-returns"]);

export default function ReturnsPage() {
  return <SitePage page={sitePages["help-returns"]} />;
}

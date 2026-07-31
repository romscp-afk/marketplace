import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.press);

export default function PressPage() {
  return <SitePage page={sitePages.press} />;
}

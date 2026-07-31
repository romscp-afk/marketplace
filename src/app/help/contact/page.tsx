import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages["help-contact"]);

export default function ContactPage() {
  return <SitePage page={sitePages["help-contact"]} />;
}

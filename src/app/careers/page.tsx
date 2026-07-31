import { sitePageMetadata, sitePages, SitePage } from "@/content/site-pages";

export const metadata = sitePageMetadata(sitePages.careers);

export default function CareersPage() {
  return <SitePage page={sitePages.careers} />;
}

import { ScrollViewStyleReset } from "expo-router/html";
import type { ReactNode } from "react";

import { brand } from "@/lib/brand";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <title>{brand.share.title}</title>
        <meta name="description" content={brand.share.description} />
        <meta name="application-name" content={brand.name} />
        <meta name="apple-mobile-web-app-title" content={brand.name} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={brand.name} />
        <meta property="og:title" content={brand.share.title} />
        <meta property="og:description" content={brand.share.description} />
        <meta property="og:image" content={brand.share.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={brand.share.title} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={brand.share.title} />
        <meta name="twitter:description" content={brand.share.description} />
        <meta name="twitter:image" content={brand.share.image} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;

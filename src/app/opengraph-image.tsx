import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { brand } from "@/config/brand";

export const alt = brand.share.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoPath = join(process.cwd(), "public/brand/aromza-logo.png");
  const logoData = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: brand.pwa.backgroundColor,
          gap: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt={brand.name}
          width={520}
          height={200}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: brand.theme.colors.text,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}

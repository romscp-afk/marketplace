import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B5D4B",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <div style={{ width: 60, height: 6, background: "#FAF8F3", borderRadius: 3 }} />
          <div style={{ width: 48, height: 6, background: "#FAF8F3", borderRadius: 3 }} />
          <div style={{ width: 36, height: 6, background: "#FAF8F3", borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}

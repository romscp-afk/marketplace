import { ImageResponse } from "next/og";

export async function GET() {
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
          borderRadius: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div style={{ width: 80, height: 8, background: "#FAF8F3", borderRadius: 4 }} />
          <div style={{ width: 64, height: 8, background: "#FAF8F3", borderRadius: 4 }} />
          <div style={{ width: 48, height: 8, background: "#FAF8F3", borderRadius: 4 }} />
        </div>
      </div>
    ),
    { width: 192, height: 192 },
  );
}

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
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ width: 200, height: 20, background: "#FAF8F3", borderRadius: 10 }} />
          <div style={{ width: 160, height: 20, background: "#FAF8F3", borderRadius: 10 }} />
          <div style={{ width: 120, height: 20, background: "#FAF8F3", borderRadius: 10 }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}

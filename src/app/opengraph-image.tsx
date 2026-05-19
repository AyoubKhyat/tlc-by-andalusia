import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TLC by Andalusia Academy - Master Languages, The Natural Way";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #1B2A4A 0%, #7A1F3E 50%, #5A1530 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              color: "white",
              fontSize: "28px",
              fontWeight: 600,
              padding: "12px 32px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            TLC by Andalusia Academy
          </div>
          <div
            style={{
              color: "white",
              fontSize: "64px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "800px",
            }}
          >
            Master Languages,
            <br />
            The Natural Way
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "24px",
              textAlign: "center",
            }}
          >
            Premium Language Education in Marrakech
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

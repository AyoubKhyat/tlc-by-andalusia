import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TLC by Andalusia Academy - Our Programs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          background:
            "linear-gradient(135deg, #1B2A4A 0%, #7A1F3E 50%, #5A1530 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "22px",
              fontWeight: 600,
              padding: "10px 28px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            TLC by Andalusia Academy
          </div>
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: "64px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Our Programs
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.7)",
              fontSize: "28px",
              textAlign: "center",
            }}
          >
            Language courses for all ages
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#FAF7F4",
                fontSize: "16px",
                fontWeight: 500,
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              English
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#FAF7F4",
                fontSize: "16px",
                fontWeight: 500,
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              Exam Prep
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#FAF7F4",
                fontSize: "16px",
                fontWeight: 500,
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              French
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#FAF7F4",
                fontSize: "16px",
                fontWeight: 500,
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              Arabic
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
              marginTop: "8px",
            }}
          >
            tlcbyAndalusia.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "TLC by Andalusia Academy - Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, category: true, author: true },
  });

  const title = post?.title ?? "Blog Post";
  const category = post?.category ?? "";

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
            maxWidth: "1000px",
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
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#FAF7F4",
                fontSize: "18px",
                fontWeight: 500,
                padding: "6px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
                textTransform: "capitalize",
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
              marginTop: "16px",
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

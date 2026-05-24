import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return Response.json({ error: "Path parameter is required" }, { status: 400 });
    }

    const meta = await prisma.pageMeta.findUnique({
      where: { path },
      select: {
        title: true,
        description: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        keywords: true,
        noIndex: true,
      },
    });

    if (!meta) {
      return Response.json(null);
    }

    return Response.json(meta);
  } catch (error) {
    console.error("SEO meta fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

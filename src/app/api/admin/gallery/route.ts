import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(images);
  } catch (error) {
    console.error("Gallery images fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, caption, category, active, sortOrder } = body;

    if (!url) {
      return Response.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption: caption || null,
        category: category || null,
        active: active !== undefined ? active : true,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(image, { status: 201 });
  } catch (error) {
    console.error("Gallery image creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Gallery image not found" }, { status: 404 });
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(body.url !== undefined && { url: body.url }),
        ...(body.caption !== undefined && { caption: body.caption }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return Response.json(image);
  } catch (error) {
    console.error("Gallery image update error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Gallery image not found" }, { status: 404 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    return Response.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Gallery image delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

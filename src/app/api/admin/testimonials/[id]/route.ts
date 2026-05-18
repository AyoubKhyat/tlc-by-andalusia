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

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return Response.json(testimonial);
  } catch (error) {
    console.error("Testimonial update error:", error);
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

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id } });

    return Response.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

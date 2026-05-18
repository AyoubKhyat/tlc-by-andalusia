import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        groups: true,
        students: true,
        examSessions: true,
      },
    });

    if (!program) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }

    return Response.json(program);
  } catch (error) {
    console.error("Program fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }

    const program = await prisma.program.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.ageGroup !== undefined && { ageGroup: body.ageGroup }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.levels !== undefined && { levels: body.levels }),
        ...(body.objectives !== undefined && { objectives: body.objectives }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return Response.json(program);
  } catch (error) {
    console.error("Program update error:", error);
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

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }

    await prisma.program.delete({ where: { id } });

    return Response.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Program delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

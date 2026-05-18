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

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.programId !== undefined && { programId: body.programId }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.schedule !== undefined && { schedule: body.schedule }),
        ...(body.teacher !== undefined && { teacher: body.teacher }),
        ...(body.capacity !== undefined && { capacity: body.capacity }),
        ...(body.active !== undefined && { active: body.active }),
      },
      include: {
        program: true,
      },
    });

    return Response.json(group);
  } catch (error) {
    console.error("Group update error:", error);
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

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }

    await prisma.group.delete({ where: { id } });

    return Response.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Group delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

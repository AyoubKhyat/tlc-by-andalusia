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

    const existing = await prisma.examSession.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Exam session not found" }, { status: 404 });
    }

    const examSession = await prisma.examSession.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.programId !== undefined && { programId: body.programId }),
        ...(body.groupId !== undefined && { groupId: body.groupId }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.examDate !== undefined && { examDate: new Date(body.examDate) }),
        ...(body.teacher !== undefined && { teacher: body.teacher }),
        ...(body.status !== undefined && { status: body.status }),
      },
      include: {
        program: true,
        group: true,
      },
    });

    return Response.json(examSession);
  } catch (error) {
    console.error("Exam session update error:", error);
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

    const existing = await prisma.examSession.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Exam session not found" }, { status: 404 });
    }

    await prisma.examSession.delete({ where: { id } });

    return Response.json({ message: "Exam session deleted successfully" });
  } catch (error) {
    console.error("Exam session delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

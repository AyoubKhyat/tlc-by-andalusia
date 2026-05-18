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

    const existing = await prisma.examResult.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Result not found" }, { status: 404 });
    }

    // Recalculate percentage if score or maxScore changed
    const newScore = body.score !== undefined ? body.score : existing.score;
    const newMaxScore = body.maxScore !== undefined ? body.maxScore : existing.maxScore;
    const percentage = (newScore / newMaxScore) * 100;

    const result = await prisma.examResult.update({
      where: { id },
      data: {
        ...(body.studentId !== undefined && { studentId: body.studentId }),
        ...(body.examSessionId !== undefined && { examSessionId: body.examSessionId }),
        ...(body.score !== undefined && { score: body.score }),
        ...(body.maxScore !== undefined && { maxScore: body.maxScore }),
        percentage,
        ...(body.status !== undefined && { status: body.status }),
        ...(body.teacherComment !== undefined && { teacherComment: body.teacherComment }),
        ...(body.certificateAvailable !== undefined && { certificateAvailable: body.certificateAvailable }),
      },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
          },
        },
        examSession: {
          select: {
            id: true,
            title: true,
            examDate: true,
            level: true,
          },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error("Result update error:", error);
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

    const existing = await prisma.examResult.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Result not found" }, { status: 404 });
    }

    await prisma.examResult.delete({ where: { id } });

    return Response.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Result delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await prisma.examResult.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    return Response.json(results);
  } catch (error) {
    console.error("Results fetch error:", error);
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
    const {
      studentId,
      examSessionId,
      score,
      maxScore,
      status,
      teacherComment,
      certificateAvailable,
    } = body;

    if (!studentId || !examSessionId || score === undefined) {
      return Response.json(
        { error: "Student, exam session, and score are required" },
        { status: 400 }
      );
    }

    const finalMaxScore = maxScore || 100;
    const percentage = (score / finalMaxScore) * 100;

    const result = await prisma.examResult.create({
      data: {
        studentId,
        examSessionId,
        score,
        maxScore: finalMaxScore,
        percentage,
        status: status || "pending",
        teacherComment: teacherComment || null,
        certificateAvailable: certificateAvailable || false,
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

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Result creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

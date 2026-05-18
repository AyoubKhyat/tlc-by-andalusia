import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const examSessions = await prisma.examSession.findMany({
      include: {
        program: true,
        group: true,
      },
      orderBy: { examDate: "desc" },
    });

    return Response.json(examSessions);
  } catch (error) {
    console.error("Exam sessions fetch error:", error);
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
    const { title, programId, groupId, level, examDate, teacher, status } = body;

    if (!title || !programId || !examDate) {
      return Response.json(
        { error: "Title, program, and exam date are required" },
        { status: 400 }
      );
    }

    const examSession = await prisma.examSession.create({
      data: {
        title,
        programId,
        groupId: groupId || null,
        level: level || null,
        examDate: new Date(examDate),
        teacher: teacher || null,
        status: status || "upcoming",
      },
      include: {
        program: true,
        group: true,
      },
    });

    return Response.json(examSession, { status: 201 });
  } catch (error) {
    console.error("Exam session creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

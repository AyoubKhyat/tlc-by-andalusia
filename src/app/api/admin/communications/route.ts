import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return Response.json({ error: "studentId is required" }, { status: 400 });
    }

    const logs = await prisma.communicationLog.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(logs);
  } catch (error) {
    console.error("Communication logs fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { studentId, type, direction, summary } = body;

    if (!studentId || !type || !summary) {
      return Response.json({ error: "studentId, type, and summary are required" }, { status: 400 });
    }

    const log = await prisma.communicationLog.create({
      data: {
        studentId,
        type,
        direction: direction || "outbound",
        summary,
        userId: (session.user as { id?: string })?.id || null,
        userName: session.user?.name || null,
      },
    });

    return Response.json(log, { status: 201 });
  } catch (error) {
    console.error("Communication log create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

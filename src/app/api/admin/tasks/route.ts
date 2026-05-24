import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });

    return Response.json(tasks);
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, description, priority, dueDate, assigneeId, entity, entityId } = body;

    if (!title) return Response.json({ error: "Title is required" }, { status: 400 });

    const userId = (session.user as { id?: string })?.id;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        assignedById: userId || null,
        entity: entity || null,
        entityId: entityId || null,
      },
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Task create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

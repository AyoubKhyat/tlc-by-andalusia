import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Task not found" }, { status: 404 });

    const body = await request.json();
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId || null }),
      },
    });

    return Response.json(task);
  } catch (error) {
    console.error("Task update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.task.delete({ where: { id } });
    return Response.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Task delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

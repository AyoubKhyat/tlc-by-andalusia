import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.timeSlot.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Time slot not found" }, { status: 404 });

    const body = await request.json();
    const slot = await prisma.timeSlot.update({
      where: { id },
      data: {
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.startTime !== undefined && { startTime: body.startTime }),
        ...(body.endTime !== undefined && { endTime: body.endTime }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.capacity !== undefined && { capacity: body.capacity }),
        ...(body.active !== undefined && { active: body.active }),
      },
    });

    return Response.json(slot);
  } catch (error) {
    console.error("TimeSlot update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.timeSlot.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Time slot not found" }, { status: 404 });

    await prisma.timeSlot.delete({ where: { id } });
    return Response.json({ message: "Time slot deleted successfully" });
  } catch (error) {
    console.error("TimeSlot delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

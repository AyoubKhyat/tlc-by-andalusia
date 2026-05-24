import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { logAction } from "@/lib/audit";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.time !== undefined && { time: body.time || null }),
        ...(body.location !== undefined && { location: body.location || null }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.active !== undefined && { active: body.active }),
      },
    });

    logAction({ action: "update", entity: "Event", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { title: existing.title, active: existing.active }, after: { title: event.title, active: event.active }, request });

    return Response.json(event);
  } catch (error) {
    console.error("Event update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    logAction({ action: "delete", entity: "Event", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { title: existing.title }, request });

    return Response.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Event delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

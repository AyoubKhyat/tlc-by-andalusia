import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { logAction } from "@/lib/audit";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "receptionist");
    if (denied) return denied;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Booking not found" }, { status: 404 });

    const body = await request.json();
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
      },
      include: { timeSlot: true },
    });

    logAction({ action: "update", entity: "Booking", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { status: existing.status }, after: { status: booking.status }, request });

    return Response.json(booking);
  } catch (error) {
    console.error("Booking update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Booking not found" }, { status: 404 });

    await prisma.booking.delete({ where: { id } });

    logAction({ action: "delete", entity: "Booking", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { firstName: existing.firstName, lastName: existing.lastName, email: existing.email }, request });

    return Response.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Booking delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

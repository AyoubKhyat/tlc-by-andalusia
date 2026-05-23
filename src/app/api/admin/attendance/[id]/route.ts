import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "teacher");
    if (denied) return denied;

    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        group: true,
        records: { include: { student: { select: { id: true, firstName: true, lastName: true, studentId: true } } } },
      },
    });

    if (!attendanceSession) return Response.json({ error: "Session not found" }, { status: 404 });
    return Response.json(attendanceSession);
  } catch (error) {
    console.error("Attendance session fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.attendanceSession.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Session not found" }, { status: 404 });

    await prisma.attendanceSession.delete({ where: { id } });
    return Response.json({ message: "Attendance session deleted" });
  } catch (error) {
    console.error("Attendance delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

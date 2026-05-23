import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, getUserRole, getUserId } from "@/lib/authz";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "teacher");
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    const where: Record<string, unknown> = {};
    if (groupId) where.groupId = groupId;

    const role = getUserRole(session);
    if (role === "teacher") {
      const userId = getUserId(session);
      const teacherGroups = await prisma.group.findMany({
        where: { teacherId: userId },
        select: { id: true },
      });
      where.groupId = { in: teacherGroups.map((g) => g.id) };
    }

    const sessions = await prisma.attendanceSession.findMany({
      where,
      include: {
        group: { select: { name: true, programId: true } },
        records: { include: { student: { select: { firstName: true, lastName: true, studentId: true } } } },
      },
      orderBy: { date: "desc" },
      take: 50,
    });

    return Response.json(sessions);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "teacher");
    if (denied) return denied;

    const body = await request.json();
    const { groupId, date, notes, records } = body;

    if (!groupId || !date || !records || !Array.isArray(records)) {
      return Response.json({ error: "Group, date, and records are required" }, { status: 400 });
    }

    const role = getUserRole(session);
    if (role === "teacher") {
      const userId = getUserId(session);
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      if (!group || group.teacherId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const attendanceSession = await prisma.attendanceSession.upsert({
      where: { groupId_date: { groupId, date: dateObj } },
      create: { groupId, date: dateObj, notes: notes || null },
      update: { notes: notes || null },
    });

    for (const record of records) {
      await prisma.attendanceRecord.upsert({
        where: {
          attendanceSessionId_studentId: {
            attendanceSessionId: attendanceSession.id,
            studentId: record.studentId,
          },
        },
        create: {
          attendanceSessionId: attendanceSession.id,
          studentId: record.studentId,
          status: record.status || "present",
          notes: record.notes || null,
        },
        update: {
          status: record.status || "present",
          notes: record.notes || null,
        },
      });
    }

    const result = await prisma.attendanceSession.findUnique({
      where: { id: attendanceSession.id },
      include: {
        records: { include: { student: { select: { firstName: true, lastName: true, studentId: true } } } },
      },
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Attendance save error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

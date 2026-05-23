import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "teacher");
    if (denied) return denied;

    const totalRecords = await prisma.attendanceRecord.count();
    const presentRecords = await prisma.attendanceRecord.count({
      where: { status: { in: ["present", "late"] } },
    });
    const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    const totalSessions = await prisma.attendanceSession.count();

    return Response.json({ attendanceRate, totalRecords, presentRecords, totalSessions });
  } catch (error) {
    console.error("Attendance stats error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalStudents,
      activePrograms,
      upcomingExams,
      recentRegistrations,
      examResults,
      totalBookings,
      pendingBookings,
      attendanceRate,
      totalGroups,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.program.count({ where: { active: true } }),
      prisma.examSession.count({ where: { status: "upcoming" } }),
      prisma.registration.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.examResult.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.attendanceRecord.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.group.count({ where: { active: true } }),
    ]);

    const passFailStats: Record<string, number> = {};
    for (const result of examResults) {
      passFailStats[result.status] = result._count.status;
    }

    const attendanceStats: Record<string, number> = {};
    for (const rec of attendanceRate) {
      attendanceStats[rec.status] = rec._count.status;
    }
    const totalAttendance = Object.values(attendanceStats).reduce((a, b) => a + b, 0);
    const presentCount = (attendanceStats["present"] || 0) + (attendanceStats["late"] || 0);
    const overallAttendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    return Response.json({
      totalStudents,
      activePrograms,
      upcomingExams,
      recentRegistrations,
      passFailStats,
      totalBookings,
      pendingBookings,
      overallAttendanceRate,
      totalGroups,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

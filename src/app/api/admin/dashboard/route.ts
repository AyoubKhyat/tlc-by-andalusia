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
    ] = await Promise.all([
      prisma.student.count(),
      prisma.program.count({ where: { active: true } }),
      prisma.examSession.count({ where: { status: "upcoming" } }),
      prisma.registration.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
          },
        },
      }),
      prisma.examResult.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    // Build pass/fail statistics
    const passFailStats: Record<string, number> = {};
    for (const result of examResults) {
      passFailStats[result.status] = result._count.status;
    }

    return Response.json({
      totalStudents,
      activePrograms,
      upcomingExams,
      recentRegistrations,
      passFailStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

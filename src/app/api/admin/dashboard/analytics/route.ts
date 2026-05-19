import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "12m":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [registrations, students, programs] = await Promise.all([
      prisma.registration.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, status: true, programInterest: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.student.findMany({
        select: { programId: true },
        where: { programId: { not: null } },
      }),
      prisma.program.findMany({
        select: { id: true, title: true },
        where: { active: true },
      }),
    ]);

    // Group registrations by date
    const regByDate: Record<string, number> = {};
    for (const reg of registrations) {
      const dateKey = reg.createdAt.toISOString().split("T")[0];
      regByDate[dateKey] = (regByDate[dateKey] || 0) + 1;
    }

    const registrationsByDate = Object.entries(regByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // Program distribution
    const programMap = new Map(programs.map((p) => [p.id, p.title]));
    const distCounts: Record<string, number> = {};
    for (const student of students) {
      const title = programMap.get(student.programId!) || "Unknown";
      distCounts[title] = (distCounts[title] || 0) + 1;
    }

    const programDistribution = Object.entries(distCounts).map(([program, count]) => ({
      program,
      count,
    }));

    // Registrations by status
    const statusCounts: Record<string, number> = {};
    for (const reg of registrations) {
      statusCounts[reg.status] = (statusCounts[reg.status] || 0) + 1;
    }

    const registrationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    return Response.json({
      registrationsByDate,
      programDistribution,
      registrationsByStatus,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

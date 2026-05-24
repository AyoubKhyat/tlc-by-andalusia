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

    const [registrations, students, programs, attendanceSessions, bookings, examResults, enrollmentsByMonth] = await Promise.all([
      prisma.registration.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, status: true, programInterest: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.student.findMany({
        select: { programId: true, status: true, registrationDate: true },
        where: { programId: { not: null } },
      }),
      prisma.program.findMany({
        select: { id: true, title: true },
        where: { active: true },
      }),
      prisma.attendanceSession.findMany({
        where: { date: { gte: startDate } },
        include: { records: { select: { status: true } } },
        orderBy: { date: "asc" },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, status: true, type: true },
      }),
      prisma.examResult.findMany({
        where: { createdAt: { gte: startDate } },
        select: { percentage: true, status: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.student.findMany({
        where: { registrationDate: { gte: startDate } },
        select: { registrationDate: true },
        orderBy: { registrationDate: "asc" },
      }),
    ]);

    // Group registrations by date
    const regByDate: Record<string, number> = {};
    for (const reg of registrations) {
      const dateKey = reg.createdAt.toISOString().split("T")[0];
      regByDate[dateKey] = (regByDate[dateKey] || 0) + 1;
    }
    const registrationsByDate = Object.entries(regByDate).map(([date, count]) => ({ date, count }));

    // Program distribution
    const programMap = new Map(programs.map((p) => [p.id, p.title]));
    const distCounts: Record<string, number> = {};
    for (const student of students) {
      const title = programMap.get(student.programId!) || "Unknown";
      distCounts[title] = (distCounts[title] || 0) + 1;
    }
    const programDistribution = Object.entries(distCounts).map(([program, count]) => ({ program, count }));

    // Registrations by status
    const statusCounts: Record<string, number> = {};
    for (const reg of registrations) {
      statusCounts[reg.status] = (statusCounts[reg.status] || 0) + 1;
    }
    const registrationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Attendance rate over time
    const attendanceByDate = attendanceSessions.map((s) => {
      const total = s.records.length;
      const present = s.records.filter((r) => r.status === "present" || r.status === "late").length;
      return {
        date: s.date.toISOString().split("T")[0],
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
        total,
        present,
      };
    });

    // Booking stats by type
    const bookingByType: Record<string, number> = {};
    const bookingByStatus: Record<string, number> = {};
    for (const b of bookings) {
      bookingByType[b.type] = (bookingByType[b.type] || 0) + 1;
      bookingByStatus[b.status] = (bookingByStatus[b.status] || 0) + 1;
    }
    const bookingsByType = Object.entries(bookingByType).map(([type, count]) => ({ type, count }));
    const bookingsByStatus = Object.entries(bookingByStatus).map(([status, count]) => ({ status, count }));

    // Student performance distribution (score ranges)
    const scoreRanges = [
      { range: "0-49", min: 0, max: 49, count: 0 },
      { range: "50-59", min: 50, max: 59, count: 0 },
      { range: "60-69", min: 60, max: 69, count: 0 },
      { range: "70-79", min: 70, max: 79, count: 0 },
      { range: "80-89", min: 80, max: 89, count: 0 },
      { range: "90-100", min: 90, max: 100, count: 0 },
    ];
    for (const r of examResults) {
      const bucket = scoreRanges.find((s) => r.percentage >= s.min && r.percentage <= s.max);
      if (bucket) bucket.count++;
    }
    const performanceDistribution = scoreRanges.map(({ range, count }) => ({ range, count }));

    // Enrollment trend (students enrolled over time)
    const enrollByMonth: Record<string, number> = {};
    for (const s of enrollmentsByMonth) {
      const key = s.registrationDate.toISOString().slice(0, 7);
      enrollByMonth[key] = (enrollByMonth[key] || 0) + 1;
    }
    const enrollmentTrend = Object.entries(enrollByMonth).map(([month, count]) => ({ month, count }));

    // Student status breakdown
    const studentStatusCounts: Record<string, number> = {};
    for (const s of students) {
      studentStatusCounts[s.status] = (studentStatusCounts[s.status] || 0) + 1;
    }
    const studentsByStatus = Object.entries(studentStatusCounts).map(([status, count]) => ({ status, count }));

    return Response.json({
      registrationsByDate,
      programDistribution,
      registrationsByStatus,
      attendanceByDate,
      bookingsByType,
      bookingsByStatus,
      performanceDistribution,
      enrollmentTrend,
      studentsByStatus,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth()));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    const [events, examSessions, bookings, attendanceSessions] = await Promise.all([
      prisma.event.findMany({
        where: { date: { gte: start, lte: end }, active: true },
        orderBy: { date: "asc" },
      }),
      prisma.examSession.findMany({
        where: { examDate: { gte: start, lte: end } },
        include: { program: { select: { title: true } }, group: { select: { name: true } } },
        orderBy: { examDate: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          timeSlot: { date: { gte: start, lte: end } },
          status: { not: "cancelled" },
        },
        include: { timeSlot: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.attendanceSession.findMany({
        where: { date: { gte: start, lte: end } },
        include: { group: { select: { name: true } } },
        orderBy: { date: "asc" },
      }),
    ]);

    const calendarItems = [
      ...events.map((e) => ({
        id: e.id,
        type: "event" as const,
        title: e.title,
        date: e.date,
        color: "#7A1F3E",
      })),
      ...examSessions.map((e) => ({
        id: e.id,
        type: "exam" as const,
        title: `${e.program.title} Exam${e.group ? ` - ${e.group.name}` : ""}`,
        date: e.examDate,
        color: "#D4A843",
      })),
      ...bookings.map((b) => ({
        id: b.id,
        type: "booking" as const,
        title: `${b.firstName} ${b.lastName} - ${b.type}`,
        date: b.timeSlot.date,
        color: "#1B2A4A",
      })),
      ...attendanceSessions.map((a) => ({
        id: a.id,
        type: "attendance" as const,
        title: `Attendance: ${a.group.name}`,
        date: a.date,
        color: "#2D6A4F",
      })),
    ];

    return Response.json(calendarItems);
  } catch (error) {
    console.error("Calendar fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    let where: Record<string, unknown> = { active: true, date: { gte: new Date() } };

    if (month) {
      const [year, m] = month.split("-").map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 0, 23, 59, 59);
      where = { active: true, date: { gte: start, lte: end } };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return Response.json(events);
  } catch (error) {
    console.error("Public events fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });

    return Response.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const body = await request.json();
    const { title, description, date, endDate, time, location, category, active } = body;

    if (!title || !description || !date) {
      return Response.json({ error: "Title, description, and date are required" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        time: time || null,
        location: location || null,
        category: category || "general",
        active: active !== undefined ? active : true,
      },
    });

    return Response.json(event, { status: 201 });
  } catch (error) {
    console.error("Event create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

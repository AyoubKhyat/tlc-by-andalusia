import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const slots = await prisma.timeSlot.findMany({
      include: { bookings: { where: { status: { not: "cancelled" } } } },
      orderBy: { date: "desc" },
    });

    return Response.json(slots);
  } catch (error) {
    console.error("TimeSlots fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const body = await request.json();
    const { date, startTime, endTime, type, capacity, active } = body;

    if (!date || !startTime || !endTime) {
      return Response.json({ error: "Date, start time, and end time are required" }, { status: 400 });
    }

    const slot = await prisma.timeSlot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        type: type || "placement_test",
        capacity: capacity || 1,
        active: active !== undefined ? active : true,
      },
    });

    return Response.json(slot, { status: 201 });
  } catch (error) {
    console.error("TimeSlot create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

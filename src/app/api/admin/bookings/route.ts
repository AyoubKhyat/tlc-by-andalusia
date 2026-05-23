import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "receptionist");
    if (denied) return denied;

    const bookings = await prisma.booking.findMany({
      include: { timeSlot: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(bookings);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, ids, status } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json({ error: "No IDs provided" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.registration.deleteMany({ where: { id: { in: ids } } });
      return Response.json({ message: "Registrations deleted successfully" });
    }

    if (action === "status" && status) {
      await prisma.registration.updateMany({
        where: { id: { in: ids } },
        data: { status },
      });
      return Response.json({ message: "Statuses updated successfully" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk registration action error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

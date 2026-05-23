import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserId } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json(notifications);
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

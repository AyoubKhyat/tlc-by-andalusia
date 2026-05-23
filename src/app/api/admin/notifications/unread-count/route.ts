import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserId } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const count = await prisma.notification.count({
      where: {
        read: false,
        OR: [{ userId }, { userId: null }],
      },
    });

    return Response.json({ count });
  } catch (error) {
    console.error("Notification count error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

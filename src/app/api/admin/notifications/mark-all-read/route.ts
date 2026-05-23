import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserId } from "@/lib/authz";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    await prisma.notification.updateMany({
      where: {
        read: false,
        OR: [{ userId }, { userId: null }],
      },
      data: { read: true },
    });

    return Response.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

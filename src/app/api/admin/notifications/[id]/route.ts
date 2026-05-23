import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: body.read ?? true },
    });

    return Response.json(notification);
  } catch (error) {
    console.error("Notification update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id?: string })?.id;
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return Response.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as { id?: string })?.id;
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return Response.json({ error: "Current password is required" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return Response.json({ error: "User not found" }, { status: 404 });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return Response.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      data.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

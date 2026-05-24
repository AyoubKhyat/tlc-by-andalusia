import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.communicationLog.delete({ where: { id } });
    return Response.json({ message: "Communication log deleted" });
  } catch (error) {
    console.error("Communication log delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

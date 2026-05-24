import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(registrations);
  } catch (error) {
    console.error("Registrations fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

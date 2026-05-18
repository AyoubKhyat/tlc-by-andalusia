import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      include: {
        program: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(groups);
  } catch (error) {
    console.error("Groups fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, programId, level, schedule, teacher, capacity, active } = body;

    if (!name || !programId) {
      return Response.json(
        { error: "Name and program are required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name,
        programId,
        level: level || null,
        schedule: schedule || null,
        teacher: teacher || null,
        capacity: capacity || 15,
        active: active !== undefined ? active : true,
      },
      include: {
        program: true,
      },
    });

    return Response.json(group, { status: 201 });
  } catch (error) {
    console.error("Group creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

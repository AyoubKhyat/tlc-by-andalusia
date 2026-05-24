import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity");
    const entityId = searchParams.get("entityId");

    if (!entity || !entityId) {
      return Response.json({ error: "entity and entityId are required" }, { status: 400 });
    }

    const notes = await prisma.note.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(notes);
  } catch (error) {
    console.error("Notes fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { content, entity, entityId } = body;

    if (!content || !entity || !entityId) {
      return Response.json({ error: "content, entity, and entityId are required" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        content,
        entity,
        entityId,
        userId: (session.user as { id?: string })?.id || null,
        userName: session.user?.name || null,
      },
    });

    return Response.json(note, { status: 201 });
  } catch (error) {
    console.error("Note create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.chatbotFAQ.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Entry not found" }, { status: 404 });

    const body = await request.json();
    const entry = await prisma.chatbotFAQ.update({
      where: { id },
      data: {
        ...(body.question !== undefined && { question: body.question }),
        ...(body.answer !== undefined && { answer: body.answer }),
        ...(body.keywords !== undefined && { keywords: body.keywords }),
        ...(body.category !== undefined && { category: body.category || null }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return Response.json(entry);
  } catch (error) {
    console.error("Chatbot FAQ update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.chatbotFAQ.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Entry not found" }, { status: 404 });

    await prisma.chatbotFAQ.delete({ where: { id } });
    return Response.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Chatbot FAQ delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

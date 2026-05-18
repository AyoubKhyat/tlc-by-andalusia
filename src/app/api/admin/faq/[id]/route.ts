import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(body.question !== undefined && { question: body.question }),
        ...(body.answer !== undefined && { answer: body.answer }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return Response.json(faq);
  } catch (error) {
    console.error("FAQ update error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }

    await prisma.fAQ.delete({ where: { id } });

    return Response.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("FAQ delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

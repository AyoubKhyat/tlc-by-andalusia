import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const entries = await prisma.chatbotFAQ.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(entries);
  } catch (error) {
    console.error("Chatbot FAQ fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const body = await request.json();
    const { question, answer, keywords, category, active, sortOrder } = body;

    if (!question || !answer || !keywords) {
      return Response.json({ error: "Question, answer, and keywords are required" }, { status: 400 });
    }

    const entry = await prisma.chatbotFAQ.create({
      data: {
        question,
        answer,
        keywords,
        category: category || null,
        active: active !== undefined ? active : true,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(entry, { status: 201 });
  } catch (error) {
    console.error("Chatbot FAQ create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(faqs);
  } catch (error) {
    console.error("FAQs fetch error:", error);
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
    const { question, answer, category, active, sortOrder } = body;

    if (!question || !answer) {
      return Response.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || null,
        active: active !== undefined ? active : true,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(faq, { status: 201 });
  } catch (error) {
    console.error("FAQ creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

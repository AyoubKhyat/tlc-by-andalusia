import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const normalizedMsg = message.toLowerCase().trim();
    const entries = await prisma.chatbotFAQ.findMany({ where: { active: true } });

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of entries) {
      const keywords = entry.keywords.split(",").map((k) => k.trim().toLowerCase());
      let score = 0;

      for (const keyword of keywords) {
        if (keyword && normalizedMsg.includes(keyword)) score += 2;
      }

      const questionWords = entry.question.toLowerCase().split(/\s+/);
      for (const word of questionWords) {
        if (word.length > 3 && normalizedMsg.includes(word)) score += 0.5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore >= 1) {
      return Response.json({ answer: bestMatch.answer, matched: true });
    }

    return Response.json({
      answer: "I'm not sure about that. For more information, please visit our contact page or reach out to us directly!",
      matched: false,
      contactLink: "/contact",
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";

interface SearchResult {
  type: "program" | "faq" | "blog";
  title: string;
  description: string;
  href: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();

  if (!query || query.length < 2) {
    return Response.json([]);
  }

  try {
    const [programs, faqs, blogPosts] = await Promise.all([
      prisma.program.findMany({
        where: { active: true },
        select: { title: true, slug: true, description: true, ageGroup: true },
      }),
      prisma.fAQ.findMany({
        where: { active: true },
        select: { question: true, answer: true, category: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { title: true, slug: true, excerpt: true, category: true },
      }),
    ]);

    const results: SearchResult[] = [];

    for (const p of programs) {
      if (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      ) {
        results.push({
          type: "program",
          title: p.title,
          description: `${p.ageGroup} — ${p.description.slice(0, 100)}...`,
          href: `/programs#${p.slug}`,
        });
      }
    }

    for (const f of faqs) {
      if (
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query)
      ) {
        results.push({
          type: "faq",
          title: f.question,
          description: f.answer.slice(0, 120) + "...",
          href: `/faq`,
        });
      }
    }

    for (const b of blogPosts) {
      if (
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query)
      ) {
        results.push({
          type: "blog",
          title: b.title,
          description: b.excerpt.slice(0, 120) + "...",
          href: `/blog/${b.slug}`,
        });
      }
    }

    return Response.json(results.slice(0, 20));
  } catch (error) {
    console.error("Search error:", error);
    return Response.json([], { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, category, tags, published } = body;

    if (!title || !slug || !excerpt || !content || !author) {
      return Response.json(
        { error: "Title, slug, excerpt, content, and author are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return Response.json({ error: "A post with this slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        author,
        category: category || "news",
        tags: tags || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return Response.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog post creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

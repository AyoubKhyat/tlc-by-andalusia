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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    const wasPublished = existing.published;
    const isNowPublished = body.published !== undefined ? body.published : wasPublished;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.published !== undefined && { published: body.published }),
        ...(!wasPublished && isNowPublished && { publishedAt: new Date() }),
      },
    });

    return Response.json(post);
  } catch (error) {
    console.error("Blog post update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    return Response.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Blog post delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

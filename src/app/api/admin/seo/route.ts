import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { logAction } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const pages = await prisma.pageMeta.findMany({
      orderBy: { path: "asc" },
    });

    return Response.json(pages);
  } catch (error) {
    console.error("SEO fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const body = await request.json();
    const { path, title, description, ogTitle, ogDescription, ogImage, keywords, noIndex } = body;

    if (!path) {
      return Response.json({ error: "Path is required" }, { status: 400 });
    }

    const existing = await prisma.pageMeta.findUnique({ where: { path } });
    if (existing) {
      return Response.json({ error: "Page meta already exists for this path" }, { status: 409 });
    }

    const pageMeta = await prisma.pageMeta.create({
      data: {
        path,
        title: title || null,
        description: description || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        keywords: keywords || null,
        noIndex: noIndex || false,
      },
    });

    logAction({ action: "create", entity: "PageMeta", entityId: pageMeta.id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, after: { path, title }, request });

    return Response.json(pageMeta, { status: 201 });
  } catch (error) {
    console.error("SEO create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

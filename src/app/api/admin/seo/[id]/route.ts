import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { logAction } from "@/lib/audit";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.pageMeta.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Page meta not found" }, { status: 404 });
    }

    const body = await request.json();
    const pageMeta = await prisma.pageMeta.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.ogTitle !== undefined && { ogTitle: body.ogTitle || null }),
        ...(body.ogDescription !== undefined && { ogDescription: body.ogDescription || null }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage || null }),
        ...(body.keywords !== undefined && { keywords: body.keywords || null }),
        ...(body.noIndex !== undefined && { noIndex: body.noIndex }),
      },
    });

    logAction({ action: "update", entity: "PageMeta", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { title: existing.title, description: existing.description }, after: { title: pageMeta.title, description: pageMeta.description }, request });

    return Response.json(pageMeta);
  } catch (error) {
    console.error("SEO update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.pageMeta.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Page meta not found" }, { status: 404 });
    }

    await prisma.pageMeta.delete({ where: { id } });

    logAction({ action: "delete", entity: "PageMeta", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { path: existing.path, title: existing.title }, request });

    return Response.json({ message: "Page meta deleted successfully" });
  } catch (error) {
    console.error("SEO delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

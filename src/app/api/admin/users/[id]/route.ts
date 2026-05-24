import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, getUserId } from "@/lib/authz";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    const validRoles = ["admin", "teacher", "receptionist"];
    if (role && !validRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    if (email && email !== existing.email) {
      const duplicate = await prisma.user.findUnique({ where: { email } });
      if (duplicate) {
        return Response.json({ error: "Email already exists" }, { status: 409 });
      }
    }

    const data: Record<string, unknown> = {};
    if (email !== undefined) data.email = email;
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });

    logAction({ action: "update", entity: "User", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { email: existing.email, name: existing.name, role: existing.role }, after: user, request });

    return Response.json(user);
  } catch (error) {
    console.error("User update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const currentUserId = getUserId(session);
    if (id === currentUserId) {
      return Response.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    logAction({ action: "delete", entity: "User", entityId: id, userId: currentUserId || undefined, userName: session!.user?.name || undefined, before: { email: existing.email, name: existing.name, role: existing.role }, request });

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(users);
  } catch (error) {
    console.error("Users fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin");
    if (denied) return denied;

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return Response.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const validRoles = ["admin", "teacher", "receptionist"];
    if (role && !validRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "teacher",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });

    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error("User create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Registration not found" }, { status: 404 });
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
      },
    });

    return Response.json(registration);
  } catch (error) {
    console.error("Registration update error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Registration not found" }, { status: 404 });
    }

    await prisma.registration.delete({ where: { id } });

    return Response.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Registration delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

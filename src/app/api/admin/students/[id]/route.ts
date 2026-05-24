import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        program: true,
        group: true,
        examResults: {
          include: {
            examSession: true,
          },
        },
      },
    });

    if (!student) {
      return Response.json({ error: "Student not found" }, { status: 404 });
    }

    return Response.json(student);
  } catch (error) {
    console.error("Student fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Student not found" }, { status: 404 });
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(body.firstName !== undefined && { firstName: body.firstName }),
        ...(body.lastName !== undefined && { lastName: body.lastName }),
        ...(body.dateOfBirth !== undefined && { dateOfBirth: new Date(body.dateOfBirth) }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.parentPhone !== undefined && { parentPhone: body.parentPhone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.programId !== undefined && { programId: body.programId }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.groupId !== undefined && { groupId: body.groupId }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: {
        program: true,
        group: true,
      },
    });

    logAction({ action: "update", entity: "Student", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { firstName: existing.firstName, lastName: existing.lastName, status: existing.status }, after: { firstName: student.firstName, lastName: student.lastName, status: student.status }, request });

    return Response.json(student);
  } catch (error) {
    console.error("Student update error:", error);
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

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });

    logAction({ action: "delete", entity: "Student", entityId: id, userId: (session!.user as { id?: string })?.id, userName: session!.user?.name || undefined, before: { studentId: existing.studentId, firstName: existing.firstName, lastName: existing.lastName }, request });

    return Response.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Student delete error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

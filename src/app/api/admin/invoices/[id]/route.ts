import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Invoice not found" }, { status: 404 });

    const body = await request.json();
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(body.amount !== undefined && { amount: parseFloat(body.amount) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.paidAt !== undefined && { paidAt: body.paidAt ? new Date(body.paidAt) : null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      },
      include: {
        student: { select: { firstName: true, lastName: true, studentId: true } },
        payments: true,
      },
    });

    logAction({
      action: "update",
      entity: "invoice",
      entityId: id,
      userId: (session.user as { id?: string })?.id,
      userName: session.user?.name || undefined,
      before: existing,
      after: invoice,
      request,
    });

    return Response.json(invoice);
  } catch (error) {
    console.error("Invoice update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Invoice not found" }, { status: 404 });

    await prisma.invoice.delete({ where: { id } });

    logAction({
      action: "delete",
      entity: "invoice",
      entityId: id,
      userId: (session.user as { id?: string })?.id,
      userName: session.user?.name || undefined,
      before: existing,
      request,
    });

    return Response.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error("Invoice delete error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, studentId: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(invoices);
  } catch (error) {
    console.error("Invoices fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { studentId, amount, description, dueDate, notes } = body;

    if (!studentId || !amount || !description) {
      return Response.json({ error: "studentId, amount, and description are required" }, { status: 400 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
      },
      include: {
        student: { select: { firstName: true, lastName: true, studentId: true } },
        payments: true,
      },
    });

    logAction({
      action: "create",
      entity: "invoice",
      entityId: invoice.id,
      userId: (session.user as { id?: string })?.id,
      userName: session.user?.name || undefined,
      after: invoice,
      request,
    });

    return Response.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

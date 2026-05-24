import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { invoiceId, amount, method, reference } = body;

    if (!invoiceId || !amount || !method) {
      return Response.json({ error: "invoiceId, amount, and method are required" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });
    if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: parseFloat(amount),
        method,
        reference: reference || null,
      },
    });

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + parseFloat(amount);
    const newStatus = totalPaid >= invoice.amount ? "paid" : "partial";

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: newStatus,
        ...(newStatus === "paid" && { paidAt: new Date() }),
      },
    });

    logAction({
      action: "create",
      entity: "payment",
      entityId: payment.id,
      userId: (session.user as { id?: string })?.id,
      userName: session.user?.name || undefined,
      after: payment,
      request,
    });

    return Response.json(payment, { status: 201 });
  } catch (error) {
    console.error("Payment create error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

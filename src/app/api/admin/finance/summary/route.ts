import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const invoices = await prisma.invoice.findMany({
      include: { payments: true },
    });

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCollected = invoices.reduce(
      (sum, inv) => sum + inv.payments.reduce((ps, p) => ps + p.amount, 0),
      0
    );
    const totalOutstanding = totalInvoiced - totalCollected;
    const overdueInvoices = invoices.filter(
      (inv) => inv.status !== "paid" && inv.dueDate && new Date(inv.dueDate) < new Date()
    ).length;

    const byStatus = {
      pending: invoices.filter((i) => i.status === "pending").length,
      partial: invoices.filter((i) => i.status === "partial").length,
      paid: invoices.filter((i) => i.status === "paid").length,
      overdue: overdueInvoices,
    };

    const now = new Date();
    const monthlyRevenue: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthPayments = invoices.flatMap((inv) =>
        inv.payments.filter((p) => new Date(p.paidAt) >= d && new Date(p.paidAt) <= end)
      );
      monthlyRevenue.push({
        month: d.toLocaleDateString("en", { month: "short", year: "2-digit" }),
        amount: monthPayments.reduce((s, p) => s + p.amount, 0),
      });
    }

    return Response.json({
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      overdueInvoices,
      byStatus,
      monthlyRevenue,
      totalInvoices: invoices.length,
    });
  } catch (error) {
    console.error("Finance summary error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

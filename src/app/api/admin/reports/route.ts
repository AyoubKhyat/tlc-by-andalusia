import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const roleErr = requireRole(session, "admin");
    if (roleErr) return roleErr;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return Response.json({ error: "type parameter is required" }, { status: 400 });
    }

    switch (type) {
      case "enrollment": {
        const students = await prisma.student.findMany({
          include: {
            program: { select: { title: true } },
            group: { select: { name: true } },
          },
        });
        const byProgram: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        students.forEach((s) => {
          const prog = s.program?.title || "Unassigned";
          byProgram[prog] = (byProgram[prog] || 0) + 1;
          byStatus[s.status] = (byStatus[s.status] || 0) + 1;
        });
        return Response.json({
          type: "enrollment",
          total: students.length,
          byProgram: Object.entries(byProgram).map(([name, count]) => ({ name, count })),
          byStatus: Object.entries(byStatus).map(([name, count]) => ({ name, count })),
        });
      }
      case "financial": {
        const invoices = await prisma.invoice.findMany({ include: { payments: true } });
        const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
        const totalPaid = invoices.reduce(
          (s, i) => s + i.payments.reduce((ps, p) => ps + p.amount, 0), 0
        );
        return Response.json({
          type: "financial",
          totalInvoiced,
          totalPaid,
          outstanding: totalInvoiced - totalPaid,
          invoiceCount: invoices.length,
          paidCount: invoices.filter((i) => i.status === "paid").length,
          pendingCount: invoices.filter((i) => i.status === "pending").length,
        });
      }
      case "attendance": {
        const records = await prisma.attendanceRecord.findMany({
          include: {
            attendanceSession: { include: { group: { select: { name: true } } } },
          },
        });
        const total = records.length;
        const present = records.filter((r) => r.status === "present").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const late = records.filter((r) => r.status === "late").length;
        const byGroup: Record<string, { total: number; present: number }> = {};
        records.forEach((r) => {
          const g = r.attendanceSession.group.name;
          if (!byGroup[g]) byGroup[g] = { total: 0, present: 0 };
          byGroup[g].total++;
          if (r.status === "present" || r.status === "late") byGroup[g].present++;
        });
        return Response.json({
          type: "attendance",
          total, present, absent, late,
          rate: total > 0 ? Math.round((present / total) * 100) : 0,
          byGroup: Object.entries(byGroup).map(([name, data]) => ({
            name,
            rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
            total: data.total,
          })),
        });
      }
      case "performance": {
        const results = await prisma.examResult.findMany({
          include: {
            student: { select: { firstName: true, lastName: true } },
            examSession: { include: { program: { select: { title: true } } } },
          },
        });
        const avgScore = results.length > 0
          ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
          : 0;
        const passRate = results.length > 0
          ? Math.round((results.filter((r) => r.percentage >= 50).length / results.length) * 100)
          : 0;
        return Response.json({
          type: "performance",
          totalExams: results.length,
          averageScore: avgScore,
          passRate,
          topStudents: results
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 10)
            .map((r) => ({
              name: `${r.student.firstName} ${r.student.lastName}`,
              score: r.percentage,
              exam: r.examSession.program.title,
            })),
        });
      }
      default:
        return Response.json({ error: "Unsupported report type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Report error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const roleErr = requireRole(session, "admin");
    if (roleErr) return roleErr;

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity");

    if (!entity) {
      return Response.json({ error: "entity parameter is required" }, { status: 400 });
    }

    let csv = "";
    let filename = "";

    switch (entity) {
      case "students": {
        const students = await prisma.student.findMany({
          include: { program: { select: { title: true } }, group: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        });
        const headers = ["ID", "Student ID", "First Name", "Last Name", "DOB", "Phone", "Parent Phone", "Email", "Program", "Group", "Level", "Status", "Registration Date"];
        const rows = students.map((s) => [
          s.id, s.studentId, s.firstName, s.lastName,
          new Date(s.dateOfBirth).toLocaleDateString(),
          s.phone || "", s.parentPhone || "", s.email || "",
          s.program?.title || "", s.group?.name || "", s.level || "",
          s.status, new Date(s.registrationDate).toLocaleDateString(),
        ]);
        csv = toCsv(headers, rows);
        filename = "students.csv";
        break;
      }
      case "registrations": {
        const regs = await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });
        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Parent Name", "Parent Phone", "Program Interest", "Status", "Date"];
        const rows = regs.map((r) => [
          r.id, r.firstName, r.lastName, r.email || "", r.phone,
          r.parentName || "", r.parentPhone || "", r.programInterest || "",
          r.status, new Date(r.createdAt).toLocaleDateString(),
        ]);
        csv = toCsv(headers, rows);
        filename = "registrations.csv";
        break;
      }
      case "invoices": {
        const invoices = await prisma.invoice.findMany({
          include: { student: { select: { firstName: true, lastName: true, studentId: true } }, payments: true },
          orderBy: { createdAt: "desc" },
        });
        const headers = ["ID", "Student", "Student ID", "Description", "Amount", "Paid", "Status", "Due Date", "Created"];
        const rows = invoices.map((i) => [
          i.id, `${i.student.firstName} ${i.student.lastName}`, i.student.studentId,
          i.description, String(i.amount),
          String(i.payments.reduce((s, p) => s + p.amount, 0)),
          i.status, i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "",
          new Date(i.createdAt).toLocaleDateString(),
        ]);
        csv = toCsv(headers, rows);
        filename = "invoices.csv";
        break;
      }
      case "attendance": {
        const records = await prisma.attendanceRecord.findMany({
          include: {
            student: { select: { firstName: true, lastName: true, studentId: true } },
            attendanceSession: { include: { group: { select: { name: true } } } },
          },
          orderBy: { createdAt: "desc" },
        });
        const headers = ["Student", "Student ID", "Group", "Date", "Status", "Notes"];
        const rows = records.map((r) => [
          `${r.student.firstName} ${r.student.lastName}`, r.student.studentId,
          r.attendanceSession.group.name,
          new Date(r.attendanceSession.date).toLocaleDateString(),
          r.status, r.notes || "",
        ]);
        csv = toCsv(headers, rows);
        filename = "attendance.csv";
        break;
      }
      default:
        return Response.json({ error: "Unsupported entity" }, { status: 400 });
    }

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

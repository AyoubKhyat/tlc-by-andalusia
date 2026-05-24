import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !["enrollment", "financial", "attendance", "performance"].includes(type)) {
      return Response.json(
        { error: "type parameter is required (enrollment, financial, attendance, performance)" },
        { status: 400 }
      );
    }

    const generatedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let reportTitle = "";
    let summaryHtml = "";
    let dataHtml = "";

    switch (type) {
      case "enrollment": {
        reportTitle = "Enrollment Report";
        const students = await prisma.student.findMany({
          include: {
            program: { select: { title: true } },
            group: { select: { name: true } },
          },
          orderBy: { lastName: "asc" },
        });

        const byProgram: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        students.forEach((s) => {
          const prog = s.program?.title || "Unassigned";
          byProgram[prog] = (byProgram[prog] || 0) + 1;
          byStatus[s.status] = (byStatus[s.status] || 0) + 1;
        });

        summaryHtml = `
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">${students.length}</div>
              <div class="summary-label">Total Students</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${Object.keys(byProgram).length}</div>
              <div class="summary-label">Programs</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${byStatus["active"] || 0}</div>
              <div class="summary-label">Active</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${byStatus["inactive"] || 0}</div>
              <div class="summary-label">Inactive</div>
            </div>
          </div>

          <div class="two-col">
            <div>
              <h3>By Program</h3>
              <table>
                <thead><tr><th>Program</th><th>Students</th></tr></thead>
                <tbody>
                  ${Object.entries(byProgram)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => `<tr><td>${escapeHtml(name)}</td><td class="num">${count}</td></tr>`)
                    .join("")}
                </tbody>
              </table>
            </div>
            <div>
              <h3>By Status</h3>
              <table>
                <thead><tr><th>Status</th><th>Count</th></tr></thead>
                <tbody>
                  ${Object.entries(byStatus)
                    .map(([name, count]) => `<tr><td class="capitalize">${escapeHtml(name)}</td><td class="num">${count}</td></tr>`)
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>`;

        dataHtml = `
          <h3>Student Roster</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Program</th>
                <th>Group</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  (s) => `
              <tr>
                <td>${escapeHtml(s.studentId)}</td>
                <td>${escapeHtml(s.firstName)} ${escapeHtml(s.lastName)}</td>
                <td>${s.program ? escapeHtml(s.program.title) : "-"}</td>
                <td>${s.group ? escapeHtml(s.group.name) : "-"}</td>
                <td class="capitalize">${escapeHtml(s.status)}</td>
                <td>${formatDate(s.registrationDate)}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>`;
        break;
      }

      case "financial": {
        reportTitle = "Financial Report";
        const invoices = await prisma.invoice.findMany({
          include: {
            student: { select: { firstName: true, lastName: true, studentId: true } },
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        });

        const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
        const totalPaid = invoices.reduce(
          (s, i) => s + i.payments.reduce((ps, p) => ps + p.amount, 0),
          0
        );
        const outstanding = totalInvoiced - totalPaid;
        const paidCount = invoices.filter((i) => i.status === "paid").length;
        const pendingCount = invoices.filter((i) => i.status === "pending").length;
        const overdueCount = invoices.filter((i) => i.status === "overdue").length;

        summaryHtml = `
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(totalInvoiced)}</div>
              <div class="summary-label">Total Invoiced</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(totalPaid)}</div>
              <div class="summary-label">Total Collected</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(outstanding)}</div>
              <div class="summary-label">Outstanding</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${invoices.length}</div>
              <div class="summary-label">Total Invoices</div>
            </div>
          </div>

          <div class="two-col">
            <div>
              <h3>Invoice Status Breakdown</h3>
              <table>
                <thead><tr><th>Status</th><th>Count</th></tr></thead>
                <tbody>
                  <tr><td>Paid</td><td class="num">${paidCount}</td></tr>
                  <tr><td>Pending</td><td class="num">${pendingCount}</td></tr>
                  <tr><td>Overdue</td><td class="num">${overdueCount}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Collection Rate</h3>
              <table>
                <thead><tr><th>Metric</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Collection Rate</td><td class="num">${totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0}%</td></tr>
                  <tr><td>Avg Invoice</td><td class="num">${invoices.length > 0 ? formatCurrency(totalInvoiced / invoices.length) : formatCurrency(0)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>`;

        dataHtml = `
          <h3>All Invoices</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${invoices
                .map((i) => {
                  const paid = i.payments.reduce((s, p) => s + p.amount, 0);
                  const balance = i.amount - paid;
                  return `
              <tr>
                <td>INV-${i.id.slice(-8).toUpperCase()}</td>
                <td>${escapeHtml(i.student.firstName)} ${escapeHtml(i.student.lastName)}</td>
                <td>${escapeHtml(i.description)}</td>
                <td class="num">${formatCurrency(i.amount)}</td>
                <td class="num">${formatCurrency(paid)}</td>
                <td class="num">${formatCurrency(balance)}</td>
                <td class="capitalize">${escapeHtml(i.status)}</td>
                <td>${formatDate(i.createdAt)}</td>
              </tr>`;
                })
                .join("")}
            </tbody>
          </table>`;
        break;
      }

      case "attendance": {
        reportTitle = "Attendance Report";
        const records = await prisma.attendanceRecord.findMany({
          include: {
            attendanceSession: {
              include: { group: { select: { name: true } } },
            },
            student: { select: { firstName: true, lastName: true, studentId: true } },
          },
          orderBy: { attendanceSession: { date: "desc" } },
        });

        const total = records.length;
        const present = records.filter((r) => r.status === "present").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const late = records.filter((r) => r.status === "late").length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        const byGroup: Record<string, { total: number; present: number }> = {};
        records.forEach((r) => {
          const g = r.attendanceSession.group.name;
          if (!byGroup[g]) byGroup[g] = { total: 0, present: 0 };
          byGroup[g].total++;
          if (r.status === "present" || r.status === "late") byGroup[g].present++;
        });

        summaryHtml = `
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">${total}</div>
              <div class="summary-label">Total Records</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${rate}%</div>
              <div class="summary-label">Attendance Rate</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${present}</div>
              <div class="summary-label">Present</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${absent}</div>
              <div class="summary-label">Absent</div>
            </div>
          </div>

          <div class="two-col">
            <div>
              <h3>Status Breakdown</h3>
              <table>
                <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
                <tbody>
                  <tr><td>Present</td><td class="num">${present}</td><td class="num">${total > 0 ? Math.round((present / total) * 100) : 0}%</td></tr>
                  <tr><td>Late</td><td class="num">${late}</td><td class="num">${total > 0 ? Math.round((late / total) * 100) : 0}%</td></tr>
                  <tr><td>Absent</td><td class="num">${absent}</td><td class="num">${total > 0 ? Math.round((absent / total) * 100) : 0}%</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>By Group</h3>
              <table>
                <thead><tr><th>Group</th><th>Records</th><th>Rate</th></tr></thead>
                <tbody>
                  ${Object.entries(byGroup)
                    .sort((a, b) => b[1].total - a[1].total)
                    .map(
                      ([name, data]) =>
                        `<tr><td>${escapeHtml(name)}</td><td class="num">${data.total}</td><td class="num">${data.total > 0 ? Math.round((data.present / data.total) * 100) : 0}%</td></tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>`;

        dataHtml = `
          <h3>Attendance Records</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Group</th>
                <th>Student ID</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .slice(0, 500)
                .map(
                  (r) => `
              <tr>
                <td>${formatDate(r.attendanceSession.date)}</td>
                <td>${escapeHtml(r.attendanceSession.group.name)}</td>
                <td>${escapeHtml(r.student.studentId)}</td>
                <td>${escapeHtml(r.student.firstName)} ${escapeHtml(r.student.lastName)}</td>
                <td class="capitalize">${escapeHtml(r.status)}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
          ${records.length > 500 ? `<p class="truncated">Showing 500 of ${records.length} records</p>` : ""}`;
        break;
      }

      case "performance": {
        reportTitle = "Academic Performance Report";
        const results = await prisma.examResult.findMany({
          include: {
            student: { select: { firstName: true, lastName: true, studentId: true } },
            examSession: {
              include: { program: { select: { title: true } } },
            },
          },
          orderBy: { percentage: "desc" },
        });

        const avgScore =
          results.length > 0
            ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
            : 0;
        const passRate =
          results.length > 0
            ? Math.round((results.filter((r) => r.percentage >= 50).length / results.length) * 100)
            : 0;
        const highestScore = results.length > 0 ? Math.round(results[0].percentage) : 0;
        const lowestScore =
          results.length > 0 ? Math.round(results[results.length - 1].percentage) : 0;

        const byProgram: Record<string, { total: number; sum: number; pass: number }> = {};
        results.forEach((r) => {
          const prog = r.examSession.program.title;
          if (!byProgram[prog]) byProgram[prog] = { total: 0, sum: 0, pass: 0 };
          byProgram[prog].total++;
          byProgram[prog].sum += r.percentage;
          if (r.percentage >= 50) byProgram[prog].pass++;
        });

        summaryHtml = `
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">${results.length}</div>
              <div class="summary-label">Total Exam Results</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${avgScore}%</div>
              <div class="summary-label">Average Score</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${passRate}%</div>
              <div class="summary-label">Pass Rate</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${highestScore}%</div>
              <div class="summary-label">Highest Score</div>
            </div>
          </div>

          <div class="two-col">
            <div>
              <h3>Performance by Program</h3>
              <table>
                <thead><tr><th>Program</th><th>Exams</th><th>Avg</th><th>Pass Rate</th></tr></thead>
                <tbody>
                  ${Object.entries(byProgram)
                    .sort((a, b) => b[1].total - a[1].total)
                    .map(
                      ([name, data]) =>
                        `<tr><td>${escapeHtml(name)}</td><td class="num">${data.total}</td><td class="num">${Math.round(data.sum / data.total)}%</td><td class="num">${Math.round((data.pass / data.total) * 100)}%</td></tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div>
              <h3>Score Distribution</h3>
              <table>
                <thead><tr><th>Range</th><th>Count</th></tr></thead>
                <tbody>
                  <tr><td>90-100%</td><td class="num">${results.filter((r) => r.percentage >= 90).length}</td></tr>
                  <tr><td>70-89%</td><td class="num">${results.filter((r) => r.percentage >= 70 && r.percentage < 90).length}</td></tr>
                  <tr><td>50-69%</td><td class="num">${results.filter((r) => r.percentage >= 50 && r.percentage < 70).length}</td></tr>
                  <tr><td>Below 50%</td><td class="num">${results.filter((r) => r.percentage < 50).length}</td></tr>
                </tbody>
              </table>
            </div>
          </div>`;

        dataHtml = `
          <h3>All Exam Results</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student</th>
                <th>Program</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Max</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${results
                .map(
                  (r) => `
              <tr>
                <td>${escapeHtml(r.student.studentId)}</td>
                <td>${escapeHtml(r.student.firstName)} ${escapeHtml(r.student.lastName)}</td>
                <td>${escapeHtml(r.examSession.program.title)}</td>
                <td>${escapeHtml(r.examSession.title)}</td>
                <td class="num">${r.score}</td>
                <td class="num">${r.maxScore}</td>
                <td class="num">${Math.round(r.percentage)}%</td>
                <td class="capitalize">${r.percentage >= 50 ? "Pass" : "Fail"}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>`;
        break;
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - TLC by Andalusia Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.5;
      background: #f5f5f5;
      padding: 20px;
    }

    .report-container {
      max-width: 1000px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .header {
      background: #7A1F3E;
      color: #fff;
      padding: 24px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header .brand h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .header .brand .sub {
      font-size: 12px;
      opacity: 0.85;
      margin-top: 2px;
    }

    .header .report-info {
      text-align: right;
    }

    .header .report-info h2 {
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 1px;
    }

    .header .report-info .date {
      font-size: 12px;
      opacity: 0.85;
      margin-top: 4px;
    }

    .content {
      padding: 30px 40px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }

    .summary-card {
      background: #f8f4f6;
      border: 1px solid #e8d5dc;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
    }

    .summary-value {
      font-size: 28px;
      font-weight: 700;
      color: #7A1F3E;
      line-height: 1.2;
    }

    .summary-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7A1F3E;
      margin-bottom: 12px;
      font-weight: 600;
      padding-bottom: 6px;
      border-bottom: 2px solid #f0e6ea;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    thead th {
      background: #f8f4f6;
      color: #7A1F3E;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e8d5dc;
    }

    tbody td {
      padding: 7px 10px;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
    }

    tbody tr:hover {
      background: #fdfbfc;
    }

    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .capitalize {
      text-transform: capitalize;
    }

    .data-table {
      font-size: 12px;
    }

    .data-table td {
      padding: 5px 8px;
      font-size: 12px;
    }

    .data-table th {
      padding: 6px 8px;
      font-size: 10px;
    }

    .truncated {
      font-size: 12px;
      color: #999;
      text-align: center;
      padding: 10px;
      font-style: italic;
    }

    .footer {
      background: #f8f4f6;
      padding: 16px 40px;
      text-align: center;
      border-top: 1px solid #e8d5dc;
    }

    .footer p {
      font-size: 11px;
      color: #888;
      margin-bottom: 2px;
    }

    .footer .academy {
      font-weight: 600;
      color: #7A1F3E;
      margin-bottom: 4px;
    }

    .print-button {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #7A1F3E;
      color: #fff;
      border: none;
      padding: 12px 28px;
      font-size: 15px;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(122, 31, 62, 0.3);
    }

    .print-button:hover {
      background: #5e1730;
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
        margin: 0;
      }

      .report-container {
        border: none;
        border-radius: 0;
        box-shadow: none;
        max-width: 100%;
      }

      .print-button {
        display: none !important;
      }

      .header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        padding: 16px 20px;
      }

      .content {
        padding: 20px;
      }

      .summary-card {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      thead th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .footer {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        padding: 12px 20px;
      }

      .data-table {
        page-break-inside: auto;
      }

      .data-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      .data-table thead {
        display: table-header-group;
      }

      h3 {
        page-break-after: avoid;
      }

      .summary-grid,
      .two-col {
        page-break-inside: avoid;
      }

      @page {
        margin: 12mm;
        size: A4 landscape;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div class="brand">
        <h1>TLC</h1>
        <div class="sub">by Andalusia Academy</div>
      </div>
      <div class="report-info">
        <h2>${reportTitle}</h2>
        <div class="date">Generated: ${generatedAt}</div>
      </div>
    </div>

    <div class="content">
      ${summaryHtml}
      ${dataHtml}
    </div>

    <div class="footer">
      <p class="academy">TLC by Andalusia Academy</p>
      <p>Marrakech, Morocco</p>
      <p>Report generated on ${generatedAt}</p>
    </div>
  </div>

  <button class="print-button" onclick="window.print()">Print Report</button>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Print report error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(amount);
}

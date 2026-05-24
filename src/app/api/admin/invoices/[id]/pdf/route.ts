import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          orderBy: { paidAt: "asc" },
        },
      },
    });

    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceDue = invoice.amount - totalPaid;
    const invoiceNumber = `INV-${invoice.id.slice(-8).toUpperCase()}`;
    const dateIssued = formatDate(invoice.createdAt);
    const dueDate = invoice.dueDate ? formatDate(invoice.dueDate) : "N/A";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber} - TLC by Andalusia Academy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
      background: #f5f5f5;
      padding: 20px;
    }

    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .header {
      background: #7A1F3E;
      color: #fff;
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .header .academy-name {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 4px;
    }

    .header .invoice-title {
      text-align: right;
    }

    .header .invoice-title h2 {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 2px;
    }

    .header .invoice-title .invoice-number {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 4px;
    }

    .info-section {
      display: flex;
      justify-content: space-between;
      padding: 30px 40px;
      border-bottom: 1px solid #eee;
    }

    .info-block h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7A1F3E;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .info-block p {
      font-size: 14px;
      margin-bottom: 3px;
      color: #444;
    }

    .info-block .value {
      font-weight: 600;
      color: #222;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 8px;
    }

    .status-paid { background: #e6f4ea; color: #1e7e34; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-overdue { background: #fce4ec; color: #c62828; }
    .status-partial { background: #e3f2fd; color: #1565c0; }
    .status-cancelled { background: #f5f5f5; color: #666; }

    .table-section {
      padding: 30px 40px;
    }

    .table-section h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7A1F3E;
      margin-bottom: 12px;
      font-weight: 600;
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
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e8d5dc;
    }

    thead th:last-child {
      text-align: right;
    }

    tbody td {
      padding: 10px 12px;
      font-size: 14px;
      border-bottom: 1px solid #f0f0f0;
    }

    tbody td:last-child {
      text-align: right;
      font-weight: 500;
    }

    .totals-section {
      padding: 0 40px 30px 40px;
      display: flex;
      justify-content: flex-end;
    }

    .totals-table {
      width: 280px;
    }

    .totals-table .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .totals-table .row.separator {
      border-top: 1px solid #ddd;
      margin-top: 4px;
      padding-top: 12px;
    }

    .totals-table .row.total {
      font-size: 18px;
      font-weight: 700;
      color: #7A1F3E;
      border-top: 2px solid #7A1F3E;
      margin-top: 4px;
      padding-top: 12px;
    }

    .totals-table .row .label {
      color: #666;
    }

    .totals-table .row.total .label {
      color: #7A1F3E;
    }

    .notes-section {
      padding: 0 40px 30px 40px;
    }

    .notes-section h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7A1F3E;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .notes-section p {
      font-size: 13px;
      color: #666;
      background: #fafafa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #e8d5dc;
    }

    .footer {
      background: #f8f4f6;
      padding: 20px 40px;
      text-align: center;
      border-top: 1px solid #e8d5dc;
    }

    .footer p {
      font-size: 12px;
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

      .invoice-container {
        border: none;
        border-radius: 0;
        box-shadow: none;
        max-width: 100%;
      }

      .print-button {
        display: none !important;
      }

      @page {
        margin: 15mm;
        size: A4;
      }

      .header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      thead th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .status-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .footer {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <h1>TLC</h1>
        <div class="academy-name">by Andalusia Academy</div>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-number">${invoiceNumber}</div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-block">
        <h3>Bill To</h3>
        <p class="value">${escapeHtml(invoice.student.firstName)} ${escapeHtml(invoice.student.lastName)}</p>
        <p>Student ID: ${escapeHtml(invoice.student.studentId)}</p>
        ${invoice.student.email ? `<p>${escapeHtml(invoice.student.email)}</p>` : ""}
        ${invoice.student.phone ? `<p>${escapeHtml(invoice.student.phone)}</p>` : ""}
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Invoice Details</h3>
        <p><span class="label">Date Issued:</span> <span class="value">${dateIssued}</span></p>
        <p><span class="label">Due Date:</span> <span class="value">${dueDate}</span></p>
        <div>
          <span class="status-badge status-${invoice.status}">${invoice.status}</span>
        </div>
      </div>
    </div>

    <div class="table-section">
      <h3>Line Items</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHtml(invoice.description)}</td>
            <td>${formatCurrency(invoice.amount)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${
      invoice.payments.length > 0
        ? `
    <div class="table-section" style="padding-top: 0;">
      <h3>Payments Received</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Reference</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.payments
            .map(
              (p) => `
          <tr>
            <td>${formatDate(p.paidAt)}</td>
            <td>${escapeHtml(p.method)}</td>
            <td>${p.reference ? escapeHtml(p.reference) : "-"}</td>
            <td>${formatCurrency(p.amount)}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`
        : ""
    }

    <div class="totals-section">
      <div class="totals-table">
        <div class="row">
          <span class="label">Invoice Amount</span>
          <span>${formatCurrency(invoice.amount)}</span>
        </div>
        <div class="row">
          <span class="label">Total Paid</span>
          <span>${formatCurrency(totalPaid)}</span>
        </div>
        <div class="row total">
          <span class="label">Balance Due</span>
          <span>${formatCurrency(balanceDue)}</span>
        </div>
      </div>
    </div>

    ${
      invoice.notes
        ? `
    <div class="notes-section">
      <h3>Notes</h3>
      <p>${escapeHtml(invoice.notes)}</p>
    </div>`
        : ""
    }

    <div class="footer">
      <p class="academy">TLC by Andalusia Academy</p>
      <p>Marrakech, Morocco</p>
      <p>Thank you for choosing TLC by Andalusia Academy</p>
    </div>
  </div>

  <button class="print-button" onclick="window.print()">Print Invoice</button>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Invoice PDF generation error:", error);
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
    month: "long",
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

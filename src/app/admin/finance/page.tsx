"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  DollarSign,
  CreditCard,
  Receipt,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import StatCard from "@/components/admin/StatCard";
import { formatDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  reference: string | null;
  createdAt: string;
}

interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  description: string;
  status: string;
  dueDate: string;
  notes: string | null;
  createdAt: string;
  student: { id: string; firstName: string; lastName: string };
  payments: Payment[];
}

interface FinanceSummary {
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  overdueInvoices: number;
  byStatus: { pending: number; partial: number; paid: number; overdue: number };
  monthlyRevenue: { month: string; amount: number }[];
  totalInvoices: number;
}

type TabKey = "invoices" | "payments" | "summary";

// ---------------------------------------------------------------------------
// Empty form defaults
// ---------------------------------------------------------------------------

const emptyInvoiceForm = {
  studentId: "",
  amount: "",
  description: "",
  dueDate: "",
  notes: "",
};

const emptyPaymentForm = {
  invoiceId: "",
  amount: "",
  method: "cash",
  reference: "",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  // Data
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Invoice modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [savingInvoice, setSavingInvoice] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [savingPayment, setSavingPayment] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch helpers
  // -------------------------------------------------------------------------

  const fetchAll = useCallback(async () => {
    try {
      const [invoicesRes, studentsRes, summaryRes] = await Promise.all([
        fetch("/api/admin/invoices"),
        fetch("/api/admin/students"),
        fetch("/api/admin/finance/summary"),
      ]);
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(
          data.map((s: Record<string, string>) => ({
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
          }))
        );
      }
      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // -------------------------------------------------------------------------
  // Invoice CRUD
  // -------------------------------------------------------------------------

  const openCreateInvoice = () => {
    setSelectedInvoice(null);
    setInvoiceForm(emptyInvoiceForm);
    setInvoiceModalOpen(true);
  };

  const openEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceForm({
      studentId: invoice.studentId,
      amount: String(invoice.amount),
      description: invoice.description,
      dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
      notes: invoice.notes || "",
    });
    setInvoiceModalOpen(true);
  };

  const openDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.studentId || !invoiceForm.amount || !invoiceForm.description || !invoiceForm.dueDate) {
      toast.error("Student, amount, description, and due date are required");
      return;
    }

    setSavingInvoice(true);
    try {
      const url = selectedInvoice
        ? `/api/admin/invoices/${selectedInvoice.id}`
        : "/api/admin/invoices";
      const method = selectedInvoice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: invoiceForm.studentId,
          amount: parseFloat(invoiceForm.amount),
          description: invoiceForm.description,
          dueDate: invoiceForm.dueDate,
          notes: invoiceForm.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save invoice");
      }

      toast.success(selectedInvoice ? "Invoice updated" : "Invoice created");
      setInvoiceModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save invoice");
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/invoices/${selectedInvoice.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete invoice");
      toast.success("Invoice deleted");
      setDeleteDialogOpen(false);
      fetchAll();
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Payment
  // -------------------------------------------------------------------------

  const openRecordPayment = (invoice: Invoice) => {
    setPaymentForm({
      invoiceId: invoice.id,
      amount: "",
      method: "cash",
      reference: "",
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.invoiceId || !paymentForm.amount) {
      toast.error("Invoice and amount are required");
      return;
    }

    setSavingPayment(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: paymentForm.invoiceId,
          amount: parseFloat(paymentForm.amount),
          method: paymentForm.method,
          reference: paymentForm.reference || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to record payment");
      }

      toast.success("Payment recorded");
      setPaymentModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSavingPayment(false);
    }
  };

  // -------------------------------------------------------------------------
  // Columns
  // -------------------------------------------------------------------------

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: "student",
      label: "Student",
      sortable: true,
      render: (inv) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {inv.student.firstName} {inv.student.lastName}
        </span>
      ),
    },
    { key: "description", label: "Description", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (inv) => (
        <span className="font-semibold">{formatCurrency(inv.amount)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (inv) => formatDate(inv.dueDate),
    },
  ];

  // Flatten all payments across invoices for the Payments tab
  const allPayments = invoices.flatMap((inv) =>
    inv.payments.map((p) => ({
      ...p,
      studentName: `${inv.student.firstName} ${inv.student.lastName}`,
      invoiceDescription: inv.description,
      invoiceAmount: inv.amount,
    }))
  );

  type FlatPayment = (typeof allPayments)[number];

  const paymentColumns: Column<FlatPayment>[] = [
    { key: "studentName", label: "Student", sortable: true },
    { key: "invoiceDescription", label: "Invoice", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (p) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
      sortable: true,
      render: (p) => (
        <span className="capitalize">{p.method.replace("_", " ")}</span>
      ),
    },
    { key: "reference", label: "Reference" },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (p) => formatDate(p.createdAt),
    },
  ];

  // -------------------------------------------------------------------------
  // Tabs config
  // -------------------------------------------------------------------------

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "summary", label: "Summary", icon: <TrendingUp size={16} /> },
    { key: "invoices", label: "Invoices", icon: <Receipt size={16} /> },
    { key: "payments", label: "Payments", icon: <CreditCard size={16} /> },
  ];

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage invoices, payments &amp; financial reports
          </p>
        </div>
        {activeTab === "invoices" && (
          <button
            onClick={openCreateInvoice}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus size={18} />
            New Invoice
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-1 mb-6 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white dark:bg-slate-700 text-[var(--color-burgundy)] shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* ================================================================= */}
      {/* SUMMARY TAB                                                       */}
      {/* ================================================================= */}
      {activeTab === "summary" && summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Invoiced"
              value={formatCurrency(summary.totalInvoiced)}
              icon={Receipt}
              color="navy"
              delay={0}
            />
            <StatCard
              title="Total Collected"
              value={formatCurrency(summary.totalCollected)}
              icon={DollarSign}
              color="emerald"
              delay={0.05}
            />
            <StatCard
              title="Outstanding"
              value={formatCurrency(summary.totalOutstanding)}
              icon={CreditCard}
              color="burgundy"
              delay={0.1}
            />
            <StatCard
              title="Overdue Invoices"
              value={summary.overdueInvoices}
              icon={AlertCircle}
              color="purple"
              delay={0.15}
            />
          </div>

          {/* Status breakdown */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {(
              [
                { label: "Pending", value: summary.byStatus.pending, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
                { label: "Partial", value: summary.byStatus.partial, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
                { label: "Paid", value: summary.byStatus.paid, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
                { label: "Overdue", value: summary.byStatus.overdue, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                <span
                  className={`inline-block text-2xl font-bold px-3 py-1 rounded-lg ${item.color}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Monthly revenue chart */}
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Revenue
            </h2>
            {summary.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={summary.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#d1d5db" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#d1d5db" }}
                    tickFormatter={(v: number) => formatCurrency(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-navy)",
                      border: "none",
                      borderRadius: "0.75rem",
                      color: "#fff",
                    }}
                    formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-burgundy)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-burgundy)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                No revenue data yet
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* INVOICES TAB                                                      */}
      {/* ================================================================= */}
      {activeTab === "invoices" && (
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            searchKeys={["description", "status"]}
            searchPlaceholder="Search invoices..."
            emptyMessage="No invoices found"
            actions={(invoice) => (
              <div className="flex items-center gap-1 justify-end">
                {invoice.status !== "paid" && (
                  <button
                    onClick={() => openRecordPayment(invoice)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                    title="Record Payment"
                  >
                    <DollarSign size={16} />
                  </button>
                )}
                <button
                  onClick={() => openEditInvoice(invoice)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit Invoice"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => openDeleteInvoice(invoice)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Invoice"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* PAYMENTS TAB                                                      */}
      {/* ================================================================= */}
      {activeTab === "payments" && (
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DataTable
            columns={paymentColumns}
            data={allPayments}
            searchKeys={["studentName", "invoiceDescription", "method", "reference"]}
            searchPlaceholder="Search payments..."
            emptyMessage="No payments recorded"
          />
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* INVOICE MODAL                                                     */}
      {/* ================================================================= */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title={selectedInvoice ? "Edit Invoice" : "New Invoice"}
        size="md"
      >
        <form onSubmit={handleInvoiceSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Student *
            </label>
            <select
              value={invoiceForm.studentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (MAD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              value={invoiceForm.description}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
              placeholder="e.g. English B1 - Term 2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={invoiceForm.notes}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setInvoiceModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingInvoice}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-burgundy)] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {savingInvoice && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {selectedInvoice ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================================================================= */}
      {/* PAYMENT MODAL                                                     */}
      {/* ================================================================= */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Payment"
        size="sm"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (MAD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference
            </label>
            <input
              type="text"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              placeholder="e.g. Check #1234, Transfer ref..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingPayment}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingPayment && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* ================================================================= */}
      {/* DELETE CONFIRM                                                    */}
      {/* ================================================================= */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteInvoice}
        title="Delete Invoice"
        message={`Are you sure you want to delete this invoice for ${selectedInvoice?.student?.firstName} ${selectedInvoice?.student?.lastName}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

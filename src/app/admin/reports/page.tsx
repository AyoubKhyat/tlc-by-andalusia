"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Users,
  DollarSign,
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------- types ----------

type ReportType = "enrollment" | "financial" | "attendance" | "performance";

interface EnrollmentReport {
  total: number;
  byProgram: { name: string; count: number }[];
  byStatus: { name: string; count: number }[];
}

interface FinancialReport {
  totalInvoiced: number;
  totalPaid: number;
  outstanding: number;
  invoiceCount: number;
  paidCount: number;
  pendingCount: number;
}

interface AttendanceReport {
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
  byGroup: { name: string; rate: number; total: number }[];
}

interface PerformanceReport {
  totalExams: number;
  averageScore: number;
  passRate: number;
  topStudents: { name: string; score: number; exam: string }[];
}

type ReportData = EnrollmentReport | FinancialReport | AttendanceReport | PerformanceReport;

// ---------- constants ----------

const COLORS = [
  "#7A1F3E",
  "#1B2A4A",
  "#9B2D50",
  "#2A3F6A",
  "#5A1530",
  "#4A6FA5",
  "#C2456B",
  "#3D5A80",
];

interface ReportCard {
  type: ReportType;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
  darkBgColor: string;
  exportEntity: string;
}

const reportCards: ReportCard[] = [
  {
    type: "enrollment",
    title: "Enrollment Report",
    description: "Student enrollment breakdown by program and status",
    icon: Users,
    color: "text-[var(--color-burgundy)]",
    bgColor: "bg-[var(--color-burgundy)]/10",
    darkBgColor: "dark:bg-[var(--color-burgundy)]/20",
    exportEntity: "students",
  },
  {
    type: "financial",
    title: "Financial Report",
    description: "Invoice and payment summaries with outstanding balances",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-900/20",
    exportEntity: "invoices",
  },
  {
    type: "attendance",
    title: "Attendance Report",
    description: "Attendance rates and breakdowns by group",
    icon: ClipboardCheck,
    color: "text-[var(--color-navy)]",
    bgColor: "bg-[var(--color-navy)]/10",
    darkBgColor: "dark:bg-[var(--color-navy)]/20",
    exportEntity: "attendance",
  },
  {
    type: "performance",
    title: "Performance Report",
    description: "Exam scores, pass rates, and top students",
    icon: GraduationCap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-900/20",
    exportEntity: "students",
  },
];

// ---------- helpers ----------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ---------- sub-components ----------

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-center">
      <p className={`text-2xl font-bold ${accent || "text-gray-900 dark:text-white"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  );
}

function EnrollmentView({ data }: { data: EnrollmentReport }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox label="Total Enrolled" value={data.total} accent="text-[var(--color-burgundy)]" />
        <StatBox label="Programs" value={data.byProgram.length} accent="text-[var(--color-navy)]" />
        <StatBox label="Status Categories" value={data.byStatus.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Enrollment by Program
          </h3>
          {data.byProgram.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.byProgram} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [String(value), "Students"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.byProgram.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Enrollment by Status
          </h3>
          {data.byStatus.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                >
                  {data.byStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, name) => [String(value), String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function FinancialView({ data }: { data: FinancialReport }) {
  const pieData = [
    { name: "Paid", value: data.paidCount },
    { name: "Pending", value: data.pendingCount },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatBox label="Total Invoiced" value={formatCurrency(data.totalInvoiced)} accent="text-gray-900 dark:text-white" />
        <StatBox label="Total Paid" value={formatCurrency(data.totalPaid)} accent="text-emerald-600" />
        <StatBox label="Outstanding" value={formatCurrency(data.outstanding)} accent="text-red-500" />
        <StatBox label="Invoices" value={data.invoiceCount} />
        <StatBox label="Paid" value={data.paidCount} accent="text-emerald-600" />
        <StatBox label="Pending" value={data.pendingCount} accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={[
                { name: "Invoiced", amount: data.totalInvoiced },
                { name: "Paid", amount: data.totalPaid },
                { name: "Outstanding", amount: data.outstanding },
              ]}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                <Cell fill="#1B2A4A" />
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Invoice Status
          </h3>
          {pieData.every((d) => d.value === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">No invoice data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, name) => [String(value), String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function AttendanceView({ data }: { data: AttendanceReport }) {
  const statusData = [
    { name: "Present", value: data.present },
    { name: "Absent", value: data.absent },
    { name: "Late", value: data.late },
  ];
  const statusColors = ["#22c55e", "#ef4444", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatBox label="Total Records" value={data.total} />
        <StatBox label="Present" value={data.present} accent="text-emerald-600" />
        <StatBox label="Absent" value={data.absent} accent="text-red-500" />
        <StatBox label="Late" value={data.late} accent="text-amber-600" />
        <StatBox label="Attendance Rate" value={`${data.rate}%`} accent="text-[var(--color-navy)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Attendance by Group
          </h3>
          {data.byGroup.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No group data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.byGroup}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [`${value}%`, "Attendance Rate"]}
                />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {data.byGroup.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Status Breakdown
          </h3>
          {statusData.every((d) => d.value === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={statusColors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, name) => [String(value), String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function PerformanceView({ data }: { data: PerformanceReport }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox label="Total Exams" value={data.totalExams} />
        <StatBox label="Average Score" value={`${data.averageScore}%`} accent="text-[var(--color-navy)]" />
        <StatBox label="Pass Rate" value={`${data.passRate}%`} accent="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Top Students
          </h3>
          {data.topStudents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No exam data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.topStudents}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, _name, props) => [
                    `${value}%`,
                    props.payload?.exam || "Exam",
                  ]}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {data.topStudents.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Score Distribution
          </h3>
          {data.topStudents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No exam data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Pass", value: data.passRate },
                    { name: "Fail", value: 100 - data.passRate },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  formatter={(value, name) => [`${value}%`, String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- main page ----------

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const loadReport = useCallback(async (type: ReportType) => {
    setLoading(true);
    setActiveReport(type);
    setReportData(null);

    try {
      const res = await fetch(`/api/admin/reports?type=${type}`);
      if (!res.ok) throw new Error("Failed to load report");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load report");
      setActiveReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExport = useCallback(async (entity: string) => {
    setExporting(entity);
    try {
      const res = await fetch(`/api/admin/export?entity=${entity}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${entity}-report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }, []);

  const activeCard = reportCards.find((c) => c.type === activeReport);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[var(--color-burgundy)]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Generate and export detailed reports
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!activeReport ? (
          /* ---------- report type cards ---------- */
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {reportCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => loadReport(card.type)}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 text-left hover:border-[var(--color-burgundy)] dark:hover:border-[var(--color-burgundy)] hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.darkBgColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[var(--color-burgundy)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-burgundy)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3.5 h-3.5" />
                    Generate Report
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          /* ---------- active report view ---------- */
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveReport(null);
                    setReportData(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                {activeCard && (
                  <>
                    <div
                      className={`w-10 h-10 rounded-xl ${activeCard.bgColor} ${activeCard.darkBgColor} flex items-center justify-center`}
                    >
                      <activeCard.icon className={`w-5 h-5 ${activeCard.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activeCard.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeCard.description}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {activeCard && (
                <button
                  onClick={() => handleExport(activeCard.exportEntity)}
                  disabled={exporting !== null}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-burgundy)] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export CSV
                </button>
              )}
            </div>

            {/* content */}
            {loading ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generating report...
                  </p>
                </div>
              </div>
            ) : reportData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {activeReport === "enrollment" && (
                  <EnrollmentView data={reportData as EnrollmentReport} />
                )}
                {activeReport === "financial" && (
                  <FinancialView data={reportData as FinancialReport} />
                )}
                {activeReport === "attendance" && (
                  <AttendanceView data={reportData as AttendanceReport} />
                )}
                {activeReport === "performance" && (
                  <PerformanceView data={reportData as PerformanceReport} />
                )}
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

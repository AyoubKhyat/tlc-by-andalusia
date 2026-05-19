"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import ExportButtons from "@/components/admin/ExportButtons";

interface ExamResult {
  id: string;
  studentId: string;
  examSessionId: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  teacherComment: string | null;
  certificateAvailable: boolean;
  student: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
  };
  examSession: {
    id: string;
    title: string;
    examDate: string;
    level: string | null;
  };
}

interface StudentOption {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
}

interface ExamOption {
  id: string;
  title: string;
  examDate: string;
}

const emptyForm = {
  studentId: "",
  examSessionId: "",
  score: 0,
  maxScore: 100,
  status: "pending",
  teacherComment: "",
  certificateAvailable: false,
};

export default function ResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ExamResult | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [resultsRes, studentsRes, examsRes] = await Promise.all([
        fetch("/api/admin/results"),
        fetch("/api/admin/students"),
        fetch("/api/admin/exams"),
      ]);
      if (resultsRes.ok) setResults(await resultsRes.json());
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.map((s: Record<string, string>) => ({ id: s.id, studentId: s.studentId, firstName: s.firstName, lastName: s.lastName })));
      }
      if (examsRes.ok) {
        const data = await examsRes.json();
        setExams(data.map((e: Record<string, string>) => ({ id: e.id, title: e.title, examDate: e.examDate })));
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (result: ExamResult) => {
    setSelected(result);
    setForm({
      studentId: result.studentId,
      examSessionId: result.examSessionId,
      score: result.score,
      maxScore: result.maxScore,
      status: result.status,
      teacherComment: result.teacherComment || "",
      certificateAvailable: result.certificateAvailable,
    });
    setModalOpen(true);
  };

  const openDelete = (result: ExamResult) => {
    setSelected(result);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.examSessionId) {
      toast.error("Student and exam session are required");
      return;
    }

    setSaving(true);
    try {
      const url = selected ? `/api/admin/results/${selected.id}` : "/api/admin/results";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          examSessionId: form.examSessionId,
          score: form.score,
          maxScore: form.maxScore,
          status: form.status,
          teacherComment: form.teacherComment || null,
          certificateAvailable: form.certificateAvailable,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selected ? "Result updated" : "Result created");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/results/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Result deleted");
      setDeleteDialogOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete result");
    } finally {
      setDeleting(false);
    }
  };

  const percentage = form.maxScore > 0 ? Math.round((form.score / form.maxScore) * 100) : 0;

  const columns: Column<ExamResult>[] = [
    {
      key: "student",
      label: "Student",
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.student.firstName} {r.student.lastName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{r.student.studentId}</p>
        </div>
      ),
    },
    {
      key: "examSession",
      label: "Exam",
      render: (r) => (
        <div>
          <p className="text-gray-900 dark:text-white">{r.examSession.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(() => { try { return format(new Date(r.examSession.examDate), "MMM d, yyyy"); } catch { return "—"; } })()}
          </p>
        </div>
      ),
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (r) => `${r.score}/${r.maxScore}`,
    },
    {
      key: "percentage",
      label: "Percentage",
      sortable: true,
      render: (r) => {
        const pct = Math.round(r.percentage);
        const color = pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600";
        return <span className={`font-semibold ${color}`}>{pct}%</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "certificateAvailable",
      label: "Certificate",
      render: (r) => (
        <span className={`text-xs font-medium ${r.certificateAvailable ? "text-emerald-600" : "text-gray-400"}`}>
          {r.certificateAvailable ? "Available" : "N/A"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{results.length} results</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons
            data={results as unknown as Record<string, unknown>[]}
            filename="exam-results"
            title="Exam Results"
            columns={[
              { key: "student.studentId", label: "Student ID" },
              { key: "student.firstName", label: "First Name" },
              { key: "student.lastName", label: "Last Name" },
              { key: "examSession.title", label: "Exam" },
              { key: "score", label: "Score" },
              { key: "maxScore", label: "Max Score" },
              { key: "percentage", label: "%" },
              { key: "status", label: "Status" },
              { key: "teacherComment", label: "Comment" },
            ]}
          />
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
            <Plus size={18} />
            Add Result
          </button>
        </div>
      </motion.div>

      <motion.div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={results}
          searchKeys={["student", "examSession"]}
          searchPlaceholder="Search results..."
          actions={(item) => {
            const r = item as unknown as ExamResult;
            return (
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                <button onClick={() => openDelete(r)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            );
          }}
          emptyMessage="No exam results found"
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Result" : "New Result"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student *</label>
            <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required>
              <option value="">Select student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Session *</label>
            <select value={form.examSessionId} onChange={(e) => setForm({ ...form, examSessionId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required>
              <option value="">Select exam</option>
              {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Score *</label>
              <input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" min={0} step="0.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Score</label>
              <input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: parseFloat(e.target.value) || 100 })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" min={1} step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Percentage</label>
              <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${percentage >= 70 ? "bg-emerald-50 text-emerald-700" : percentage >= 50 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                {percentage}%
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
              <option value="pending">Pending</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher Comment</label>
            <textarea value={form.teacherComment} onChange={(e) => setForm({ ...form, teacherComment: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cert" checked={form.certificateAvailable} onChange={(e) => setForm({ ...form, certificateAvailable: e.target.checked })} className="rounded border-gray-300 dark:border-slate-600" />
            <label htmlFor="cert" className="text-sm text-gray-700 dark:text-gray-300">Certificate Available</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-burgundy)] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {selected ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Result" message="Delete this exam result? This action cannot be undone." loading={deleting} />
    </div>
  );
}

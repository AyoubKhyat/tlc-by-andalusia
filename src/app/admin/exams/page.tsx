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

interface ExamSession {
  id: string;
  title: string;
  programId: string;
  groupId: string | null;
  level: string | null;
  examDate: string;
  teacher: string | null;
  status: string;
  program: { id: string; title: string };
  group: { id: string; name: string } | null;
}

interface Program {
  id: string;
  title: string;
}

interface Group {
  id: string;
  name: string;
  programId: string;
}

const emptyForm = {
  title: "",
  programId: "",
  groupId: "",
  level: "",
  examDate: "",
  teacher: "",
  status: "upcoming",
};

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamSession[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ExamSession | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [examsRes, programsRes, groupsRes] = await Promise.all([
        fetch("/api/admin/exams"),
        fetch("/api/admin/programs"),
        fetch("/api/admin/groups"),
      ]);
      if (examsRes.ok) setExams(await examsRes.json());
      if (programsRes.ok) setPrograms(await programsRes.json());
      if (groupsRes.ok) setGroups(await groupsRes.json());
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

  const openEdit = (exam: ExamSession) => {
    setSelected(exam);
    setForm({
      title: exam.title,
      programId: exam.programId,
      groupId: exam.groupId || "",
      level: exam.level || "",
      examDate: exam.examDate ? exam.examDate.split("T")[0] : "",
      teacher: exam.teacher || "",
      status: exam.status,
    });
    setModalOpen(true);
  };

  const openDelete = (exam: ExamSession) => {
    setSelected(exam);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.programId || !form.examDate) {
      toast.error("Title, program, and exam date are required");
      return;
    }

    setSaving(true);
    try {
      const url = selected ? `/api/admin/exams/${selected.id}` : "/api/admin/exams";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          programId: form.programId,
          groupId: form.groupId || null,
          level: form.level || null,
          examDate: form.examDate,
          teacher: form.teacher || null,
          status: form.status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selected ? "Exam updated" : "Exam created");
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
      const res = await fetch(`/api/admin/exams/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Exam deleted");
      setDeleteDialogOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete exam");
    } finally {
      setDeleting(false);
    }
  };

  const filteredGroups = form.programId
    ? groups.filter((g) => g.programId === form.programId)
    : groups;

  const columns: Column<ExamSession>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "program", label: "Program", render: (e) => e.program?.title || "—" },
    { key: "group", label: "Group", render: (e) => e.group?.name || "—" },
    { key: "level", label: "Level" },
    {
      key: "examDate",
      label: "Date",
      sortable: true,
      render: (e) => {
        try { return format(new Date(e.examDate), "MMM d, yyyy"); } catch { return "—"; }
      },
    },
    { key: "teacher", label: "Teacher" },
    { key: "status", label: "Status", render: (e) => <StatusBadge status={e.status} /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Sessions</h1>
          <p className="text-gray-500 text-sm mt-1">{exams.length} exam sessions</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} />
          Add Exam
        </button>
      </motion.div>

      <motion.div className="bg-white rounded-xl border border-gray-200 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={exams}
          searchKeys={["title", "teacher", "level"]}
          searchPlaceholder="Search exams..."
          actions={(item) => {
            const e = item as unknown as ExamSession;
            return (
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => openEdit(e)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                <button onClick={() => openDelete(e)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            );
          }}
          emptyMessage="No exam sessions found"
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Exam" : "New Exam"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, groupId: "" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required>
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
                <option value="">All groups</option>
                {filteredGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label>
              <input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input type="text" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <input type="text" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
                <option value="upcoming">Upcoming</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-burgundy)] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {selected ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Exam" message={`Delete "${selected?.title}"? All results linked to this exam will also be deleted.`} loading={deleting} />
    </div>
  );
}

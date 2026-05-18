"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string | null;
  parentPhone: string | null;
  email: string | null;
  programId: string | null;
  level: string | null;
  groupId: string | null;
  status: string;
  notes: string | null;
  program: { id: string; title: string } | null;
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
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  parentPhone: "",
  email: "",
  programId: "",
  level: "",
  groupId: "",
  status: "active",
  notes: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [studentsRes, programsRes, groupsRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/programs"),
        fetch("/api/admin/groups"),
      ]);
      if (studentsRes.ok) setStudents(await studentsRes.json());
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
    setSelectedStudent(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student: Student) => {
    setSelectedStudent(student);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
      phone: student.phone || "",
      parentPhone: student.parentPhone || "",
      email: student.email || "",
      programId: student.programId || "",
      level: student.level || "",
      groupId: student.groupId || "",
      status: student.status,
      notes: student.notes || "",
    });
    setModalOpen(true);
  };

  const openDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.dateOfBirth) {
      toast.error("First name, last name, and date of birth are required");
      return;
    }

    setSaving(true);
    try {
      const url = selectedStudent
        ? `/api/admin/students/${selectedStudent.id}`
        : "/api/admin/students";
      const method = selectedStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          dateOfBirth: form.dateOfBirth,
          phone: form.phone || null,
          parentPhone: form.parentPhone || null,
          email: form.email || null,
          programId: form.programId || null,
          level: form.level || null,
          groupId: form.groupId || null,
          status: form.status,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save student");
      }

      toast.success(selectedStudent ? "Student updated" : "Student created");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      toast.success("Student deleted");
      setDeleteDialogOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  const filteredGroups = form.programId
    ? groups.filter((g) => g.programId === form.programId)
    : groups;

  const columns: Column<Student>[] = [
    { key: "studentId", label: "ID", sortable: true },
    {
      key: "firstName",
      label: "Name",
      sortable: true,
      render: (s) => `${s.firstName} ${s.lastName}`,
    },
    {
      key: "program",
      label: "Program",
      render: (s) => s.program?.title || "—",
    },
    { key: "level", label: "Level" },
    {
      key: "group",
      label: "Group",
      render: (s) => s.group?.name || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
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
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} total students</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={18} />
          Add Student
        </button>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          columns={columns}
          data={students}
          searchKeys={["firstName", "lastName", "studentId", "email"]}
          searchPlaceholder="Search students..."
          actions={(item) => {
            const s = item as unknown as Student;
            return (
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => openDelete(s)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          }}
          emptyMessage="No students found"
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedStudent ? "Edit Student" : "New Student"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
              <input type="tel" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, groupId: "" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input type="text" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" placeholder="e.g. A1, B2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
                <option value="">Select group</option>
                {filteredGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-burgundy)] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {selectedStudent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

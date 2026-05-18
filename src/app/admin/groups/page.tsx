"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";

interface Group {
  id: string;
  name: string;
  programId: string;
  level: string | null;
  schedule: string | null;
  teacher: string | null;
  capacity: number;
  active: boolean;
  program: { id: string; title: string };
}

interface Program {
  id: string;
  title: string;
}

const emptyForm = {
  name: "",
  programId: "",
  level: "",
  schedule: "",
  teacher: "",
  capacity: 15,
  active: true,
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Group | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [groupsRes, programsRes] = await Promise.all([
        fetch("/api/admin/groups"),
        fetch("/api/admin/programs"),
      ]);
      if (groupsRes.ok) setGroups(await groupsRes.json());
      if (programsRes.ok) setPrograms(await programsRes.json());
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

  const openEdit = (group: Group) => {
    setSelected(group);
    setForm({
      name: group.name,
      programId: group.programId,
      level: group.level || "",
      schedule: group.schedule || "",
      teacher: group.teacher || "",
      capacity: group.capacity,
      active: group.active,
    });
    setModalOpen(true);
  };

  const openDelete = (group: Group) => {
    setSelected(group);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.programId) {
      toast.error("Name and program are required");
      return;
    }

    setSaving(true);
    try {
      const url = selected ? `/api/admin/groups/${selected.id}` : "/api/admin/groups";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          programId: form.programId,
          level: form.level || null,
          schedule: form.schedule || null,
          teacher: form.teacher || null,
          capacity: form.capacity,
          active: form.active,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selected ? "Group updated" : "Group created");
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
      const res = await fetch(`/api/admin/groups/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Group deleted");
      setDeleteDialogOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete group");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Group>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "program", label: "Program", render: (g) => g.program?.title || "—" },
    { key: "level", label: "Level" },
    { key: "schedule", label: "Schedule" },
    { key: "teacher", label: "Teacher" },
    { key: "capacity", label: "Capacity", sortable: true },
    { key: "active", label: "Status", render: (g) => <StatusBadge status={g.active ? "active" : "inactive"} /> },
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
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500 text-sm mt-1">{groups.length} groups</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} />
          Add Group
        </button>
      </motion.div>

      <motion.div className="bg-white rounded-xl border border-gray-200 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={groups}
          searchKeys={["name", "teacher", "level"]}
          searchPlaceholder="Search groups..."
          actions={(item) => {
            const g = item as unknown as Group;
            return (
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => openEdit(g)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                <button onClick={() => openDelete(g)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            );
          }}
          emptyMessage="No groups found"
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Group" : "New Group"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
            <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required>
              <option value="">Select program</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input type="text" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 15 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" min={1} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <input type="text" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" placeholder="e.g. Mon/Wed 4-6 PM" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <input type="text" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="groupActive" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300" />
            <label htmlFor="groupActive" className="text-sm text-gray-700">Active</label>
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

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Group" message={`Delete "${selected?.name}"? Students in this group will be unassigned.`} loading={deleting} />
    </div>
  );
}

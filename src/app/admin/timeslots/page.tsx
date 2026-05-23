"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  capacity: number;
  active: boolean;
  bookings: { id: string }[];
}

const emptyForm = { date: "", startTime: "09:00", endTime: "10:00", type: "placement_test", capacity: 1, active: true };

export default function TimeSlotsPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/timeslots");
      if (res.ok) setSlots(await res.json());
    } catch {
      toast.error("Failed to load time slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: TimeSlot) => {
    setSelected(s);
    setForm({ date: s.date.slice(0, 10), startTime: s.startTime, endTime: s.endTime, type: s.type, capacity: s.capacity, active: s.active });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime) { toast.error("Date and times are required"); return; }
    setSaving(true);
    try {
      const url = selected ? `/api/admin/timeslots/${selected.id}` : "/api/admin/timeslots";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to save"); }
      toast.success(selected ? "Slot updated" : "Slot created");
      setModalOpen(false);
      fetchSlots();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/timeslots/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Slot deleted"); setDeleteDialogOpen(false); fetchSlots();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: "date", label: "Date", sortable: true, render: (s: TimeSlot) => formatDate(s.date) },
    { key: "startTime", label: "Time", render: (s: TimeSlot) => `${s.startTime} - ${s.endTime}` },
    { key: "type", label: "Type", sortable: true, render: (s: TimeSlot) => <StatusBadge status={s.type.replace("_", " ")} /> },
    { key: "capacity", label: "Capacity", render: (s: TimeSlot) => `${s.bookings.length} / ${s.capacity}` },
    { key: "active", label: "Status", render: (s: TimeSlot) => <StatusBadge status={s.active ? "active" : "inactive"} /> },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" /></div>;

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Slots</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{slots.length} total slots</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} /> Add Slot
        </button>
      </motion.div>

      <DataTable columns={columns} data={slots} searchKeys={["type"]} searchPlaceholder="Search slots..." actions={(s: TimeSlot) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Pencil size={16} /></button>
          <button onClick={() => { setSelected(s); setDeleteDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
        </div>
      )} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Slot" : "Add Slot"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent">
                <option value="placement_test">Placement Test</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
              <input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">{saving ? "Saving..." : selected ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Slot" message="Are you sure you want to delete this time slot?" loading={deleting} />
    </div>
  );
}

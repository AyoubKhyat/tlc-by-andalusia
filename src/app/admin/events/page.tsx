"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string | null;
  category: string;
  active: boolean;
  createdAt: string;
}

const categories = ["general", "open_day", "exam", "enrollment", "workshop", "holiday"];
const emptyForm = { title: "", description: "", date: "", endDate: "", time: "", location: "", category: "general", active: true };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) setEvents(await res.json());
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openCreate = () => {
    setSelectedEvent(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      endDate: event.endDate?.slice(0, 10) || "",
      time: event.time || "",
      location: event.location || "",
      category: event.category,
      active: event.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date) {
      toast.error("Title, description, and date are required");
      return;
    }
    setSaving(true);
    try {
      const url = selectedEvent ? `/api/admin/events/${selectedEvent.id}` : "/api/admin/events";
      const method = selectedEvent ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          endDate: form.endDate || null,
          time: form.time || null,
          location: form.location || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selectedEvent ? "Event updated" : "Event created");
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${selectedEvent.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Event deleted");
      setDeleteDialogOpen(false);
      fetchEvents();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (e: Event) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{e.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{e.description}</div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (e: Event) => (
        <div>
          <div className="text-sm">{formatDate(e.date)}</div>
          {e.time && <div className="text-xs text-gray-500 dark:text-gray-400">{e.time}</div>}
        </div>
      ),
    },
    { key: "location", label: "Location", render: (e: Event) => e.location || "—" },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (e: Event) => <StatusBadge status={e.category.replace("_", " ")} />,
    },
    {
      key: "active",
      label: "Status",
      render: (e: Event) => <StatusBadge status={e.active ? "active" : "inactive"} />,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{events.length} total events</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} />
          Add Event
        </button>
      </motion.div>

      <DataTable columns={columns} data={events} searchKeys={["title", "location", "category"]} searchPlaceholder="Search events..." actions={(event: Event) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(event)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
          <button onClick={() => { setSelectedEvent(event); setDeleteDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
        </div>
      )} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedEvent ? "Edit Event" : "Add Event"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time <span className="text-gray-400 font-normal">(e.g. 09:00 - 11:00)</span></label>
              <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="09:00 - 11:00" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="TLC Main Campus" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent">
                {categories.map((c) => (
                  <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
              {saving ? "Saving..." : selectedEvent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Event" message={`Are you sure you want to delete "${selectedEvent?.title}"?`} loading={deleting} />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image: string | null;
  active: boolean;
  sortOrder: number;
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  image: "",
  active: true,
  sortOrder: 0,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setTestimonials(await res.json());
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setSelected(t);
    setForm({
      name: t.name,
      role: t.role || "",
      content: t.content,
      rating: t.rating,
      image: t.image || "",
      active: t.active,
      sortOrder: t.sortOrder,
    });
    setModalOpen(true);
  };

  const openDelete = (t: Testimonial) => {
    setSelected(t);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) {
      toast.error("Name and content are required");
      return;
    }

    setSaving(true);
    try {
      const url = selected ? `/api/admin/testimonials/${selected.id}` : "/api/admin/testimonials";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role || null,
          content: form.content,
          rating: form.rating,
          image: form.image || null,
          active: form.active,
          sortOrder: form.sortOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selected ? "Testimonial updated" : "Testimonial created");
      setModalOpen(false);
      fetchTestimonials();
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
      const res = await fetch(`/api/admin/testimonials/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Testimonial deleted");
      setDeleteDialogOpen(false);
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setDeleting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">{testimonials.length} testimonials</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} />
          Add Testimonial
        </button>
      </motion.div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No testimonials yet. Add your first testimonial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-[var(--color-burgundy)]/10 rounded-full flex items-center justify-center text-[var(--color-burgundy)] font-semibold text-sm">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                  </div>
                </div>
                <StatusBadge status={t.active ? "active" : "inactive"} />
              </div>

              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{t.content}</p>

              <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => openDelete(t)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Testimonial" : "New Testimonial"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" placeholder="e.g. Parent, Student" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, rating: i + 1 })}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${i < form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-200"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="testimonialActive" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300" />
            <label htmlFor="testimonialActive" className="text-sm text-gray-700">Active</label>
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

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Testimonial" message={`Delete testimonial from "${selected?.name}"?`} loading={deleting} />
    </div>
  );
}

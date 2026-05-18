"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  active: boolean;
  sortOrder: number;
}

const emptyForm = {
  question: "",
  answer: "",
  category: "",
  active: true,
  sortOrder: 0,
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<FAQ | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/faq");
      if (res.ok) setFaqs(await res.json());
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setSelected(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      active: faq.active,
      sortOrder: faq.sortOrder,
    });
    setModalOpen(true);
  };

  const openDelete = (faq: FAQ) => {
    setSelected(faq);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      toast.error("Question and answer are required");
      return;
    }

    setSaving(true);
    try {
      const url = selected ? `/api/admin/faq/${selected.id}` : "/api/admin/faq";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question,
          answer: form.answer,
          category: form.category || null,
          active: form.active,
          sortOrder: form.sortOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selected ? "FAQ updated" : "FAQ created");
      setModalOpen(false);
      fetchFaqs();
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
      const res = await fetch(`/api/admin/faq/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("FAQ deleted");
      setDeleteDialogOpen(false);
      fetchFaqs();
    } catch {
      toast.error("Failed to delete FAQ");
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
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-500 text-sm mt-1">{faqs.length} questions</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} />
          Add FAQ
        </button>
      </motion.div>

      {faqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No FAQs yet. Add your first question.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${expandedId === faq.id ? "rotate-180" : ""}`}
                  />
                  <p className="font-medium text-gray-900 text-sm truncate">{faq.question}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {faq.category && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded capitalize">{faq.category}</span>
                  )}
                  <StatusBadge status={faq.active ? "active" : "inactive"} />
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(faq); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openDelete(faq); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expandedId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pl-11">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit FAQ" : "New FAQ"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
            <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" placeholder="e.g. general, enrollment" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="faqActive" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300" />
            <label htmlFor="faqActive" className="text-sm text-gray-700">Active</label>
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

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete FAQ" message="Delete this FAQ? This action cannot be undone." loading={deleting} />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";

interface ChatbotEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string;
  category: string | null;
  active: boolean;
  sortOrder: number;
}

const emptyForm = { question: "", answer: "", keywords: "", category: "", active: true, sortOrder: 0 };

export default function ChatbotPage() {
  const [entries, setEntries] = useState<ChatbotEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ChatbotEntry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chatbot");
      if (res.ok) setEntries(await res.json());
    } catch { toast.error("Failed to load entries"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (e: ChatbotEntry) => {
    setSelected(e);
    setForm({ question: e.question, answer: e.answer, keywords: e.keywords, category: e.category || "", active: e.active, sortOrder: e.sortOrder });
    setModalOpen(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.question || !form.answer || !form.keywords) { toast.error("Question, answer, and keywords are required"); return; }
    setSaving(true);
    try {
      const url = selected ? `/api/admin/chatbot/${selected.id}` : "/api/admin/chatbot";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to save"); }
      toast.success(selected ? "Entry updated" : "Entry created");
      setModalOpen(false); fetchEntries();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/chatbot/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Entry deleted"); setDeleteDialogOpen(false); fetchEntries();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: "question", label: "Question", sortable: true, render: (e: ChatbotEntry) => <div className="max-w-xs truncate font-medium text-gray-900 dark:text-white">{e.question}</div> },
    { key: "keywords", label: "Keywords", render: (e: ChatbotEntry) => (
      <div className="flex flex-wrap gap-1">
        {e.keywords.split(",").slice(0, 3).map((k, i) => (
          <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">{k.trim()}</span>
        ))}
        {e.keywords.split(",").length > 3 && <span className="text-[10px] text-gray-400">+{e.keywords.split(",").length - 3}</span>}
      </div>
    )},
    { key: "category", label: "Category", render: (e: ChatbotEntry) => e.category || "—" },
    { key: "active", label: "Status", render: (e: ChatbotEntry) => <StatusBadge status={e.active ? "active" : "inactive"} /> },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" /></div>;

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chatbot Q&A</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{entries.length} entries</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={18} /> Add Entry
        </button>
      </motion.div>

      <DataTable columns={columns} data={entries} searchKeys={["question", "keywords", "category"]} searchPlaceholder="Search entries..." actions={(e: ChatbotEntry) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(e)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Pencil size={16} /></button>
          <button onClick={() => { setSelected(e); setDeleteDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
        </div>
      )} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? "Edit Entry" : "Add Entry"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
            <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="What programs do you offer?" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} placeholder="We offer English, French, and Arabic programs for all ages..." className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="programs, courses, languages, offer" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
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
            <button type="submit" disabled={saving} className="px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">{saving ? "Saving..." : selected ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Entry" message={`Delete "${selected?.question}"?`} loading={deleting} />
    </div>
  );
}

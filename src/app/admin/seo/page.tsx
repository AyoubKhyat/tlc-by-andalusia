"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Pencil, Trash2, Search, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface PageMeta {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  keywords: string | null;
  noIndex: boolean;
}

const defaultPages = [
  "/", "/about", "/programs", "/approach", "/results",
  "/events", "/booking", "/gallery", "/blog", "/faq", "/contact",
];

export default function SEOPage() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PageMeta | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    path: "",
    title: "",
    description: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    keywords: "",
    noIndex: false,
  });

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo");
      if (res.ok) setPages(await res.json());
    } catch {
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openCreate = () => {
    setEditing(null);
    setForm({ path: "", title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", keywords: "", noIndex: false });
    setModalOpen(true);
  };

  const openEdit = (page: PageMeta) => {
    setEditing(page);
    setForm({
      path: page.path,
      title: page.title || "",
      description: page.description || "",
      ogTitle: page.ogTitle || "",
      ogDescription: page.ogDescription || "",
      ogImage: page.ogImage || "",
      keywords: page.keywords || "",
      noIndex: page.noIndex,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.path) { toast.error("Path is required"); return; }

    try {
      const url = editing ? `/api/admin/seo/${editing.id}` : "/api/admin/seo";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success(editing ? "Page meta updated" : "Page meta created");
      setModalOpen(false);
      fetchPages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/seo/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Page meta deleted");
      setDeleteId(null);
      fetchPages();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const existingPaths = new Set(pages.map((p) => p.path));
  const missingPages = defaultPages.filter((p) => !existingPaths.has(p));
  const filtered = pages.filter((p) =>
    p.path.toLowerCase().includes(search.toLowerCase()) ||
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const charCount = (str: string, max: number) => {
    const len = str.length;
    const color = len === 0 ? "text-gray-400" : len <= max ? "text-emerald-500" : "text-red-500";
    return <span className={`text-xs ${color}`}>{len}/{max}</span>;
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {pages.length} pages configured &middot; {missingPages.length} pages without custom meta
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} /> Add Page Meta
        </button>
      </motion.div>

      {missingPages.length > 0 && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Pages without custom meta tags:</p>
          <div className="flex flex-wrap gap-2">
            {missingPages.map((path) => (
              <button
                key={path}
                onClick={() => { setEditing(null); setForm({ path, title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", keywords: "", noIndex: false }); setModalOpen(true); }}
                className="px-3 py-1 text-xs font-mono bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
              >
                {path}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No page meta entries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((page) => (
            <motion.div
              key={page.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-[var(--color-burgundy)] dark:text-[var(--color-burgundy-light)]">{page.path}</span>
                    {page.noIndex && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                        <EyeOff size={10} /> noindex
                      </span>
                    )}
                  </div>
                  {page.title && <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{page.title}</p>}
                  {page.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{page.description}</p>}
                  {page.keywords && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {page.keywords.split(",").slice(0, 5).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded">{kw.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <button onClick={() => openEdit(page)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(page.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {(page.ogTitle || page.ogDescription || page.ogImage) && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                  <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1"><ExternalLink size={10} /> Open Graph Preview</p>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 flex gap-3">
                    {page.ogImage && (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded flex-shrink-0 overflow-hidden">
                        <img src={page.ogImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{page.ogTitle || page.title || "Untitled"}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{page.ogDescription || page.description || ""}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Page Meta" : "Add Page Meta"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Path</label>
            <input
              type="text"
              value={form.path}
              onChange={(e) => setForm({ ...form, path: e.target.value })}
              disabled={!!editing}
              placeholder="/"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm disabled:opacity-50"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              {charCount(form.title, 60)}
            </div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Page Title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              {charCount(form.description, 160)}
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Page description for search engines"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords</label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Open Graph (Social Sharing)</p>
            <div className="space-y-3">
              <input
                type="text"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                placeholder="OG Title (defaults to page title)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              />
              <textarea
                value={form.ogDescription}
                onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                placeholder="OG Description"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={form.ogImage}
                onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                placeholder="OG Image URL"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noIndex"
              checked={form.noIndex}
              onChange={(e) => setForm({ ...form, noIndex: e.target.checked })}
              className="rounded border-gray-300 dark:border-slate-600 text-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
            />
            <label htmlFor="noIndex" className="text-sm text-gray-700 dark:text-gray-300">
              Add <code className="text-xs bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">noindex</code> tag (hide from search engines)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Page Meta"
        message="Are you sure you want to delete this page meta? The page will use default meta tags."
      />
    </div>
  );
}

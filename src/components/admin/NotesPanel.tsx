"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

interface Note {
  id: string;
  content: string;
  userName: string | null;
  createdAt: string;
}

interface NotesPanelProps {
  entity: string;
  entityId: string;
  open: boolean;
  onClose: () => void;
}

export default function NotesPanel({ entity, entityId, open, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notes?entity=${entity}&entityId=${entityId}`);
      if (res.ok) setNotes(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [entity, entityId]);

  useEffect(() => {
    if (open && entityId) fetchNotes();
  }, [open, entityId, fetchNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, entity, entityId }),
      });
      if (res.ok) {
        setContent("");
        fetchNotes();
        toast.success("Note added");
      }
    } catch {
      toast.error("Failed to add note");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        toast.success("Note deleted");
      }
    } catch {
      toast.error("Failed to delete note");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[var(--color-burgundy)]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
              {notes.length}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1">{note.content}</p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{note.userName || "System"}</span>
                  <span>·</span>
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]/20"
            />
            <button
              type="submit"
              disabled={!content.trim() || sending}
              className="px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

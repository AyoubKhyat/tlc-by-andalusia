"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ScrollText, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/admin/Modal";

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  userId: string | null;
  userName: string | null;
  before: string | null;
  after: string | null;
  ipAddress: string | null;
  createdAt: string;
}

const actionColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const limit = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filterEntity) params.set("entity", filterEntity);
      if (filterAction) params.set("action", filterAction);

      const res = await fetch(`/api/admin/audit-log?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, filterEntity, filterAction]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => { setPage(1); }, [filterEntity, filterAction]);

  const totalPages = Math.ceil(total / limit);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const renderJson = (json: string | null) => {
    if (!json) return <span className="text-gray-400 italic">—</span>;
    try {
      return (
        <pre className="text-xs bg-gray-50 dark:bg-slate-800 rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap">
          {JSON.stringify(JSON.parse(json), null, 2)}
        </pre>
      );
    } catch {
      return <pre className="text-xs">{json}</pre>;
    }
  };

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{total} entries recorded</p>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
        >
          <option value="">All Entities</option>
          {["User", "Student", "Program", "Group", "ExamSession", "ExamResult", "Registration", "Event", "TimeSlot", "Booking", "AttendanceSession", "Notification", "BlogPost", "FAQ", "Testimonial", "GalleryImage", "ChatbotFAQ", "PageMeta", "SiteSetting"].map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
        >
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <ScrollText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No audit log entries yet</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entity ID</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-white">{formatDate(log.createdAt)}</div>
                      <div className="text-xs text-gray-500">{formatTime(log.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {log.userName || "System"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${actionColors[log.action] || "bg-gray-100 text-gray-700"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {log.entity}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono truncate max-w-[120px]">
                      {log.entityId || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(log.before || log.after) && (
                        <button
                          onClick={() => setSelected(log)}
                          className="p-1.5 text-gray-400 hover:text-[var(--color-burgundy)] transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="flex items-center px-3 text-sm text-gray-700 dark:text-gray-300">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`${selected?.action} ${selected?.entity}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">User</p>
                <p className="text-gray-900 dark:text-white">{selected.userName || "System"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Date</p>
                <p className="text-gray-900 dark:text-white">{formatDate(selected.createdAt)} {formatTime(selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Entity</p>
                <p className="text-gray-900 dark:text-white font-mono">{selected.entity}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Entity ID</p>
                <p className="text-gray-900 dark:text-white font-mono text-xs">{selected.entityId || "—"}</p>
              </div>
            </div>
            {selected.before && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">Before</p>
                {renderJson(selected.before)}
              </div>
            )}
            {selected.after && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">After</p>
                {renderJson(selected.after)}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

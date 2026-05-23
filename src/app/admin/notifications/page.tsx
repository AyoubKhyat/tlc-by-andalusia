"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  registration: { label: "Registration", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  booking: { label: "Booking", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  contact: { label: "Contact", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleRead = async (n: Notification) => {
    try {
      await fetch(`/api/admin/notifications/${n.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !n.read }),
      });
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: !item.read } : item)));
    } catch {
      toast.error("Failed to update");
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "all" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "unread" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              Unread
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>
      </motion.div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                n.read
                  ? "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
              }`}
            >
              <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${n.read ? "bg-gray-300 dark:bg-gray-600" : "bg-blue-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</span>
                  {typeLabels[n.type] && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeLabels[n.type].color}`}>
                      {typeLabels[n.type].label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {n.link && (
                  <a
                    href={n.link}
                    className="p-1.5 text-gray-400 hover:text-[var(--color-burgundy)] hover:bg-[var(--color-burgundy)]/5 rounded-lg transition-colors"
                    title="Go to"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => toggleRead(n)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={n.read ? "Mark as unread" : "Mark as read"}
                >
                  <Check size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

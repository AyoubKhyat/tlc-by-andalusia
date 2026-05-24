"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  GripVertical,
  ClipboardList,
  Loader2,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  dueDate: string | null;
  createdAt: string;
}

type Status = "todo" | "in_progress" | "done";

const STATUSES: { key: Status; label: string; color: string; darkColor: string }[] = [
  {
    key: "todo",
    label: "Todo",
    color: "bg-slate-100 border-slate-300",
    darkColor: "dark:bg-slate-800/60 dark:border-slate-600",
  },
  {
    key: "in_progress",
    label: "In Progress",
    color: "bg-blue-50 border-blue-300",
    darkColor: "dark:bg-blue-900/20 dark:border-blue-700",
  },
  {
    key: "done",
    label: "Done",
    color: "bg-green-50 border-green-300",
    darkColor: "dark:bg-green-900/20 dark:border-green-700",
  },
];

const PRIORITIES: { value: Task["priority"]; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const priorityStyles: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const emptyForm = {
  title: "",
  description: "",
  priority: "medium" as Task["priority"],
  status: "todo" as Status,
  dueDate: "",
};

/* ------------------------------------------------------------------ */
/*  Priority Badge                                                     */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${priorityStyles[priority]}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Task Card                                                          */
/* ------------------------------------------------------------------ */

function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onMove: (t: Task, status: Status) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}) {
  const otherStatuses = STATUSES.filter((s) => s.key !== task.status);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={isDragging ? "opacity-50" : ""}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
        className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onEdit(task)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <GripVertical
              size={14}
              className="text-gray-300 dark:text-slate-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
            />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {task.title}
            </h4>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 ml-[22px]">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between ml-[22px]">
          {task.dueDate ? (
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Calendar size={12} />
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span />
          )}

          {/* Quick actions */}
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {otherStatuses.map((s) => (
              <button
                key={s.key}
                onClick={() => onMove(task, s.key)}
                className="p-1 text-gray-400 hover:text-[var(--color-burgundy)] hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                title={`Move to ${s.label}`}
              >
                <ArrowRight size={14} />
              </button>
            ))}
            <button
              onClick={() => onDelete(task)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  /* ---- Fetch ---- */
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) setTasks(await res.json());
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ---- Grouped tasks ---- */
  const grouped: Record<Status, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  /* ---- Handlers ---- */
  const openCreate = () => {
    setSelectedTask(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate?.slice(0, 10) || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const url = selectedTask
        ? `/api/admin/tasks/${selectedTask.id}`
        : "/api/admin/tasks";
      const method = selectedTask ? "PUT" : "POST";
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success(selectedTask ? "Task updated" : "Task created");
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tasks/${selectedTask.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Task deleted");
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (task: Task, newStatus: Status) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Moved to ${STATUSES.find((s) => s.key === newStatus)?.label}`);
      fetchTasks();
    } catch {
      toast.error("Failed to move task");
    }
  };

  /* ---- Drag & Drop handlers ---- */
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id, status: task.status }));
    e.dataTransfer.effectAllowed = "move";
    setDraggingTaskId(task.id);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnKey: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnKey);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column itself (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = async (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDraggingTaskId(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const taskId = data.id as string;
      const oldStatus = data.status as Status;

      if (oldStatus === newStatus) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Moved to ${STATUSES.find((s) => s.key === newStatus)?.label}`);
    } catch {
      toast.error("Failed to move task");
      fetchTasks(); // Revert on error
    }
  };

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  /* ---- Render ---- */
  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList size={24} className="text-[var(--color-burgundy)]" />
            Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={18} />
          Add Task
        </button>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {STATUSES.map((col) => (
          <div
            key={col.key}
            className="flex flex-col"
            onDragOver={(e) => handleColumnDragOver(e, col.key)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, col.key)}
          >
            {/* Column header */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-t-2 ${col.color} ${col.darkColor}`}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {col.label}
                </h3>
                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-full">
                  {grouped[col.key].length}
                </span>
              </div>
            </div>

            {/* Column body */}
            <div className={`flex-1 rounded-b-xl border border-t-0 p-3 space-y-3 min-h-[200px] transition-colors ${
              dragOverColumn === col.key
                ? "border-dashed border-2 border-[var(--color-burgundy)]/30 bg-[var(--color-burgundy)]/5"
                : "bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700"
            }`}>
              {grouped[col.key].length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
                  <ClipboardList size={28} className="mb-2 opacity-50" />
                  <p className="text-xs">No tasks</p>
                </div>
              ) : (
                grouped[col.key].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEdit}
                    onDelete={(t) => {
                      setSelectedTask(t);
                      setDeleteDialogOpen(true);
                    }}
                    onMove={handleMove}
                    isDragging={draggingTaskId === task.id}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTask ? "Edit Task" : "Add Task"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
              placeholder="Task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
              placeholder="Optional description..."
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as Task["priority"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Status })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : selectedTask ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

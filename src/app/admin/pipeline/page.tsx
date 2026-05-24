"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  KanbanSquare,
  Phone,
  Mail,
  Search,
  ChevronDown,
  X,
  User,
  Calendar,
  MessageSquare,
  StickyNote,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Modal from "@/components/admin/Modal";
import { formatDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  programInterest: string | null;
  message: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

type PipelineStatus = "new" | "contacted" | "testing" | "enrolled" | "rejected";

interface Column {
  id: PipelineStatus;
  label: string;
  color: string;
  darkColor: string;
  icon: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLUMNS: Column[] = [
  {
    id: "new",
    label: "New",
    color: "bg-sky-500",
    darkColor: "dark:bg-sky-600",
    icon: <Users size={16} />,
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "bg-purple-500",
    darkColor: "dark:bg-purple-600",
    icon: <Phone size={16} />,
  },
  {
    id: "testing",
    label: "Testing",
    color: "bg-amber-500",
    darkColor: "dark:bg-amber-600",
    icon: <StickyNote size={16} />,
  },
  {
    id: "enrolled",
    label: "Enrolled",
    color: "bg-emerald-500",
    darkColor: "dark:bg-emerald-600",
    icon: <CheckCircle2 size={16} />,
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "bg-red-500",
    darkColor: "dark:bg-red-600",
    icon: <XCircle size={16} />,
  },
];

const STATUS_OPTIONS: { value: PipelineStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "testing", label: "Testing" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Pipeline Card
// ---------------------------------------------------------------------------

function PipelineCard({
  registration,
  onOpenDetail,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  registration: Registration;
  onOpenDetail: (reg: Registration) => void;
  onStatusChange: (reg: Registration, status: PipelineStatus) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={isDragging ? "opacity-50" : ""}
    >
      <motion.div
        variants={cardVariants}
        layout
        className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => onOpenDetail(registration)}
      >
        {/* Name */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[var(--color-burgundy)]/10 dark:bg-[var(--color-burgundy)]/20 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-[var(--color-burgundy)]" />
            </div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {registration.firstName} {registration.lastName}
            </p>
          </div>

          {/* Status dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Change status"
            >
              <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(registration, opt.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                          registration.status === opt.value
                            ? "bg-[var(--color-burgundy)]/10 text-[var(--color-burgundy)] font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
          <Phone size={12} />
          <span className="truncate">{registration.phone}</span>
        </div>

        {/* Program Interest */}
        {registration.programInterest && (
          <div className="mb-2">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--color-navy)]/10 text-[var(--color-navy)] dark:bg-[var(--color-navy)]/30 dark:text-sky-300">
              {registration.programInterest}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
          <Calendar size={12} />
          <span>{formatDate(registration.createdAt)}</span>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Column
// ---------------------------------------------------------------------------

function PipelineColumn({
  column,
  registrations,
  onOpenDetail,
  onStatusChange,
  isDragOver,
  draggingRegId,
  onColumnDragOver,
  onColumnDragLeave,
  onColumnDrop,
  onCardDragStart,
  onCardDragEnd,
}: {
  column: Column;
  registrations: Registration[];
  onOpenDetail: (reg: Registration) => void;
  onStatusChange: (reg: Registration, status: PipelineStatus) => void;
  isDragOver?: boolean;
  draggingRegId?: string | null;
  onColumnDragOver?: (e: React.DragEvent) => void;
  onColumnDragLeave?: (e: React.DragEvent) => void;
  onColumnDrop?: (e: React.DragEvent) => void;
  onCardDragStart?: (e: React.DragEvent, reg: Registration) => void;
  onCardDragEnd?: () => void;
}) {
  return (
    <div
      className="flex flex-col min-w-[280px] max-w-[320px] flex-1"
      onDragOver={onColumnDragOver}
      onDragLeave={onColumnDragLeave}
      onDrop={onColumnDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className={`w-2.5 h-2.5 rounded-full ${column.color} ${column.darkColor}`}
        />
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
          {column.label}
        </h3>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
          {registrations.length}
        </span>
      </div>

      {/* Cards container */}
      <div className={`flex-1 rounded-xl p-2 space-y-2 min-h-[200px] overflow-y-auto max-h-[calc(100vh-320px)] transition-colors ${
        isDragOver
          ? "border-dashed border-2 border-[var(--color-burgundy)]/30 bg-[var(--color-burgundy)]/5"
          : "bg-gray-50 dark:bg-slate-900/50"
      }`}>
        <AnimatePresence mode="popLayout">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {registrations.map((reg) => (
              <PipelineCard
                key={reg.id}
                registration={reg}
                onOpenDetail={onOpenDetail}
                onStatusChange={onStatusChange}
                isDragging={draggingRegId === reg.id}
                onDragStart={onCardDragStart ? (e) => onCardDragStart(e, reg) : undefined}
                onDragEnd={onCardDragEnd}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-600">
            <KanbanSquare size={24} className="mb-2 opacity-50" />
            <p className="text-xs">No registrations</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PipelinePage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [detailStatus, setDetailStatus] = useState<PipelineStatus>("new");
  const [dragOverColumn, setDragOverColumn] = useState<PipelineStatus | null>(null);
  const [draggingRegId, setDraggingRegId] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Fetch
  // -----------------------------------------------------------------------

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRegistrations(data);
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------

  const programs = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      if (r.programInterest) set.add(r.programInterest);
    });
    return Array.from(set).sort();
  }, [registrations]);

  const filtered = useMemo(() => {
    let result = registrations;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.firstName.toLowerCase().includes(q) ||
          r.lastName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.programInterest && r.programInterest.toLowerCase().includes(q))
      );
    }

    if (filterProgram) {
      result = result.filter((r) => r.programInterest === filterProgram);
    }

    return result;
  }, [registrations, searchQuery, filterProgram]);

  const grouped = useMemo(() => {
    const map: Record<PipelineStatus, Registration[]> = {
      new: [],
      contacted: [],
      testing: [],
      enrolled: [],
      rejected: [],
    };
    filtered.forEach((r) => {
      const status = r.status as PipelineStatus;
      if (map[status]) {
        map[status].push(r);
      } else {
        // Treat any unknown status as "new"
        map.new.push(r);
      }
    });
    // Sort each column by createdAt descending (newest first)
    Object.values(map).forEach((arr) =>
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    return map;
  }, [filtered]);

  // Stats
  const totalCount = registrations.length;
  const enrolledCount = registrations.filter((r) => r.status === "enrolled").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;
  const newCount = registrations.filter((r) => r.status === "new").length;
  const conversionRate =
    totalCount > 0 ? ((enrolledCount / totalCount) * 100).toFixed(1) : "0.0";

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const updateStatus = async (
    reg: Registration,
    newStatus: PipelineStatus
  ) => {
    if (reg.status === newStatus) return;

    // Optimistic update
    setRegistrations((prev) =>
      prev.map((r) => (r.id === reg.id ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
      fetchRegistrations(); // Revert on error
    }
  };

  /* ---- Drag & Drop handlers ---- */
  const handleDragStart = (e: React.DragEvent, reg: Registration) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: reg.id, status: reg.status }));
    e.dataTransfer.effectAllowed = "move";
    setDraggingRegId(reg.id);
  };

  const handleDragEnd = () => {
    setDraggingRegId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: PipelineStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = async (e: React.DragEvent, newStatus: PipelineStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDraggingRegId(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const regId = data.id as string;
      const oldStatus = data.status as PipelineStatus;

      if (oldStatus === newStatus) return;

      const reg = registrations.find((r) => r.id === regId);
      if (reg) {
        await updateStatus(reg, newStatus);
      }
    } catch {
      toast.error("Failed to move registration");
    }
  };

  const openDetail = (reg: Registration) => {
    setSelected(reg);
    setAdminNotes(reg.adminNotes || "");
    setDetailStatus(reg.status as PipelineStatus);
    setDetailOpen(true);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/registrations/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved");
      fetchRegistrations();
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const updateDetailStatus = async (newStatus: PipelineStatus) => {
    if (!selected || selected.status === newStatus) return;
    setDetailStatus(newStatus);
    await updateStatus(selected, newStatus);
    setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-burgundy)]/10 dark:bg-[var(--color-burgundy)]/20 flex items-center justify-center">
            <KanbanSquare
              size={20}
              className="text-[var(--color-burgundy)]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registration Pipeline
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Track and manage applicant registrations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Users size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalCount}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <TrendingUp size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Conversion
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {conversionRate}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Users size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">
              New
            </span>
          </div>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {newCount}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <CheckCircle2 size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Enrolled
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {enrolledCount}
          </p>
        </div>
      </motion.div>

      {/* Search & filter bar */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none cursor-pointer"
          >
            <option value="">All Programs</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {(searchQuery || filterProgram) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterProgram("");
            }}
            className="text-sm text-[var(--color-burgundy)] hover:underline self-center"
          >
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Kanban board */}
      <motion.div
        className="flex gap-4 overflow-x-auto pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {COLUMNS.map((column) => (
          <PipelineColumn
            key={column.id}
            column={column}
            registrations={grouped[column.id]}
            onOpenDetail={openDetail}
            onStatusChange={updateStatus}
            isDragOver={dragOverColumn === column.id}
            draggingRegId={draggingRegId}
            onColumnDragOver={(e) => handleColumnDragOver(e, column.id)}
            onColumnDragLeave={handleColumnDragLeave}
            onColumnDrop={(e) => handleColumnDrop(e, column.id)}
            onCardDragStart={handleDragStart}
            onCardDragEnd={handleDragEnd}
          />
        ))}
      </motion.div>

      {/* Detail modal */}
      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Registration Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {/* Applicant info header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-[var(--color-burgundy)]/10 dark:bg-[var(--color-burgundy)]/20 flex items-center justify-center">
                <User
                  size={20}
                  className="text-[var(--color-burgundy)]"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selected.firstName} {selected.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {formatDate(selected.createdAt)}
                </p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <Phone
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selected.phone}
                  </p>
                </div>
              </div>

              {selected.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                  <Mail
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selected.email}
                    </p>
                  </div>
                </div>
              )}

              {selected.programInterest && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                  <KanbanSquare
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Program Interest
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selected.programInterest}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <Calendar
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Date Submitted
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status selector */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const col = COLUMNS.find((c) => c.id === opt.value);
                  const isActive = detailStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updateDetailStatus(opt.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                        isActive
                          ? `text-white ${col?.color || "bg-gray-500"}`
                          : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            {selected.message && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare
                    size={14}
                    className="text-gray-400"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Message
                  </p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg leading-relaxed">
                  {selected.message}
                </p>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote size={14} className="text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Admin Notes
                </p>
              </div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none"
                placeholder="Add internal notes about this applicant..."
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-burgundy)] hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

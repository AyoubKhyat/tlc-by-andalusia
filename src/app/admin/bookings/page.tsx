"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  message: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) setBookings(await res.json());
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Booking deleted"); setDeleteDialogOpen(false); fetchBookings();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: "name", label: "Name", sortable: true,
      render: (b: Booking) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{b.firstName} {b.lastName}</div>
          <div className="text-xs text-gray-500">{b.email}</div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    {
      key: "timeSlot", label: "Slot",
      render: (b: Booking) => (
        <div>
          <div className="text-sm">{formatDate(b.timeSlot.date)}</div>
          <div className="text-xs text-gray-500">{b.timeSlot.startTime} - {b.timeSlot.endTime}</div>
        </div>
      ),
    },
    { key: "type", label: "Type", render: (b: Booking) => <StatusBadge status={b.type.replace("_", " ")} /> },
    { key: "status", label: "Status", sortable: true, render: (b: Booking) => <StatusBadge status={b.status} /> },
    { key: "createdAt", label: "Created", sortable: true, render: (b: Booking) => formatDate(b.createdAt) },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" /></div>;

  return (
    <div>
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
        </div>
      </motion.div>

      <DataTable columns={columns} data={bookings} searchKeys={["firstName", "lastName", "email", "status"]} searchPlaceholder="Search bookings..." actions={(b: Booking) => (
        <div className="flex items-center gap-1">
          {b.status === "pending" && (
            <>
              <button onClick={() => updateStatus(b.id, "approved")} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Approve"><Check size={16} /></button>
              <button onClick={() => updateStatus(b.id, "rejected")} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Reject"><X size={16} /></button>
            </>
          )}
          <button onClick={() => { setSelected(b); setDeleteDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
        </div>
      )} />

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Booking" message={`Delete booking for "${selected?.firstName} ${selected?.lastName}"?`} loading={deleting} />
    </div>
  );
}

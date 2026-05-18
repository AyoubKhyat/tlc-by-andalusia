"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2, Eye, X } from "lucide-react";
import { format } from "date-fns";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import Modal from "@/components/admin/Modal";

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  parentName: string | null;
  parentPhone: string | null;
  programInterest: string | null;
  message: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch("/api/registrations");
      if (res.ok) setRegistrations(await res.json());
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const updateStatus = async (reg: Registration, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated");
      fetchRegistrations();
    } catch {
      toast.error("Failed to update status");
    }
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

  const openDetail = (reg: Registration) => {
    setSelected(reg);
    setAdminNotes(reg.adminNotes || "");
    setDetailOpen(true);
  };

  const openDelete = (reg: Registration) => {
    setSelected(reg);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/registrations/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Registration deleted");
      setDeleteDialogOpen(false);
      fetchRegistrations();
    } catch {
      toast.error("Failed to delete registration");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Registration>[] = [
    {
      key: "firstName",
      label: "Name",
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.firstName} {r.lastName}</p>
          {r.email && <p className="text-xs text-gray-500">{r.email}</p>}
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "programInterest", label: "Program Interest" },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => updateStatus(r, e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (r) => {
        try { return format(new Date(r.createdAt), "MMM d, yyyy"); } catch { return "—"; }
      },
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
          <p className="text-gray-500 text-sm mt-1">{registrations.length} registrations</p>
        </div>
      </motion.div>

      <motion.div className="bg-white rounded-xl border border-gray-200 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={registrations}
          searchKeys={["firstName", "lastName", "email", "phone", "programInterest"]}
          searchPlaceholder="Search registrations..."
          actions={(item) => {
            const r = item as unknown as Registration;
            return (
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => openDetail(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                <button onClick={() => openDelete(r)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            );
          }}
          emptyMessage="No registrations yet"
        />
      </motion.div>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Registration Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selected.firstName} {selected.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm text-gray-900 mt-0.5">{selected.phone}</p>
              </div>
              {selected.email && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selected.email}</p>
                </div>
              )}
              {selected.parentName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Parent Name</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selected.parentName}</p>
                </div>
              )}
              {selected.parentPhone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Parent Phone</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selected.parentPhone}</p>
                </div>
              )}
              {selected.programInterest && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Program Interest</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selected.programInterest}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                <p className="text-sm text-gray-900 mt-0.5">
                  {(() => { try { return format(new Date(selected.createdAt), "MMM d, yyyy HH:mm"); } catch { return "—"; } })()}
                </p>
              </div>
            </div>
            {selected.message && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Message</p>
                <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{selected.message}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Admin Notes</p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none"
                placeholder="Add internal notes..."
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

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Registration" message={`Delete registration from ${selected?.firstName} ${selected?.lastName}?`} loading={deleting} />
    </div>
  );
}

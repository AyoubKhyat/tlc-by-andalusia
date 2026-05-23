"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Save, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";

interface Group {
  id: string;
  name: string;
  programId: string;
  program: { title: string };
}

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
}

interface AttendanceRecord {
  studentId: string;
  status: string;
  notes: string;
  student?: { firstName: string; lastName: string; studentId: string };
}

interface AttendanceSession {
  id: string;
  groupId: string;
  date: string;
  notes: string | null;
  group: { name: string };
  records: AttendanceRecord[];
}

export default function AttendancePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<Record<string, { status: string; notes: string }>>({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"mark" | "history">("mark");
  const [stats, setStats] = useState({ attendanceRate: 0, totalSessions: 0 });

  const fetchGroups = useCallback(async () => {
    try {
      const [groupsRes, statsRes] = await Promise.all([
        fetch("/api/admin/groups"),
        fetch("/api/admin/attendance/stats"),
      ]);
      if (groupsRes.ok) setGroups(await groupsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const fetchStudentsForGroup = useCallback(async (groupId: string) => {
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const all = await res.json();
        const groupStudents = (all as (Student & { groupId?: string })[]).filter((s) => s.groupId === groupId);
        setStudents(groupStudents);
        const initial: Record<string, { status: string; notes: string }> = {};
        groupStudents.forEach((s) => { initial[s.id] = { status: "present", notes: "" }; });
        setRecords(initial);
      }
    } catch {
      toast.error("Failed to load students");
    }
  }, []);

  const fetchExistingSession = useCallback(async (groupId: string, date: string) => {
    try {
      const res = await fetch(`/api/admin/attendance?groupId=${groupId}`);
      if (res.ok) {
        const allSessions: AttendanceSession[] = await res.json();
        const dateStr = new Date(date).toISOString().slice(0, 10);
        const existing = allSessions.find((s) => s.date.slice(0, 10) === dateStr);
        if (existing) {
          setSessionNotes(existing.notes || "");
          const loaded: Record<string, { status: string; notes: string }> = {};
          existing.records.forEach((r) => {
            loaded[r.studentId] = { status: r.status, notes: r.notes || "" };
          });
          setRecords((prev) => ({ ...prev, ...loaded }));
        }
      }
    } catch {}
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const url = selectedGroupId
        ? `/api/admin/attendance?groupId=${selectedGroupId}`
        : "/api/admin/attendance";
      const res = await fetch(url);
      if (res.ok) setSessions(await res.json());
    } catch {
      toast.error("Failed to load history");
    }
  }, [selectedGroupId]);

  useEffect(() => {
    if (selectedGroupId && view === "mark") {
      fetchStudentsForGroup(selectedGroupId);
    }
  }, [selectedGroupId, view, fetchStudentsForGroup]);

  useEffect(() => {
    if (selectedGroupId && selectedDate && view === "mark" && students.length > 0) {
      fetchExistingSession(selectedGroupId, selectedDate);
    }
  }, [selectedGroupId, selectedDate, view, students.length, fetchExistingSession]);

  useEffect(() => {
    if (view === "history") fetchHistory();
  }, [view, fetchHistory]);

  const handleMarkAll = (status: string) => {
    const updated: Record<string, { status: string; notes: string }> = {};
    Object.entries(records).forEach(([id, rec]) => { updated[id] = { ...rec, status }; });
    setRecords(updated);
  };

  const handleSave = async () => {
    if (!selectedGroupId || !selectedDate) { toast.error("Select a group and date"); return; }
    setSaving(true);
    try {
      const recordsArray = Object.entries(records).map(([studentId, rec]) => ({
        studentId,
        status: rec.status,
        notes: rec.notes || null,
      }));

      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroupId,
          date: selectedDate,
          notes: sessionNotes || null,
          records: recordsArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success("Attendance saved");
      fetchGroups();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {stats.attendanceRate}% overall rate &middot; {stats.totalSessions} sessions recorded
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <button onClick={() => setView("mark")} className={`px-4 py-2 text-sm font-medium transition-colors ${view === "mark" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
            Mark Attendance
          </button>
          <button onClick={() => setView("history")} className={`px-4 py-2 text-sm font-medium transition-colors ${view === "history" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
            History
          </button>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name} — {g.program?.title}</option>
          ))}
        </select>
        {view === "mark" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
          />
        )}
      </div>

      {view === "mark" ? (
        <>
          {!selectedGroupId ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Select a group to mark attendance</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No students in this group</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-2 mb-4">
                <button onClick={() => handleMarkAll("present")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  <CheckCircle size={14} /> All Present
                </button>
                <button onClick={() => handleMarkAll("absent")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <XCircle size={14} /> All Absent
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-gray-500">{student.studentId}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {["present", "late", "absent"].map((s) => (
                              <button
                                key={s}
                                onClick={() => setRecords((prev) => ({ ...prev, [student.id]: { ...prev[student.id], status: s } }))}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  records[student.id]?.status === s
                                    ? s === "present" ? "bg-emerald-500 text-white"
                                    : s === "late" ? "bg-amber-500 text-white"
                                    : "bg-red-500 text-white"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={records[student.id]?.notes || ""}
                            onChange={(e) => setRecords((prev) => ({ ...prev, [student.id]: { ...prev[student.id], notes: e.target.value } }))}
                            placeholder="Optional note..."
                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-slate-700 rounded bg-transparent text-gray-900 dark:text-white focus:ring-1 focus:ring-[var(--color-burgundy)] focus:border-transparent"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Session notes (optional)"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <DataTable
          columns={[
            { key: "group", label: "Group", render: (s: AttendanceSession) => s.group.name },
            { key: "date", label: "Date", sortable: true, render: (s: AttendanceSession) => formatDate(s.date) },
            {
              key: "summary", label: "Summary",
              render: (s: AttendanceSession) => {
                const present = s.records.filter((r) => r.status === "present").length;
                const late = s.records.filter((r) => r.status === "late").length;
                const absent = s.records.filter((r) => r.status === "absent").length;
                return (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-600">{present} present</span>
                    <span className="text-amber-600">{late} late</span>
                    <span className="text-red-600">{absent} absent</span>
                  </div>
                );
              },
            },
            { key: "notes", label: "Notes", render: (s: AttendanceSession) => s.notes || "—" },
          ]}
          data={sessions}
          searchKeys={["notes"]}
          searchPlaceholder="Search sessions..."
        />
      )}
    </div>
  );
}

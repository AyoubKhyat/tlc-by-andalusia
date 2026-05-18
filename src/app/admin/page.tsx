"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FileText,
  Trophy,
  TrendingUp,
  Clock,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";

interface DashboardStats {
  totalStudents: number;
  activePrograms: number;
  upcomingExams: number;
  recentRegistrations: number;
  passFailStats: Record<string, number>;
}

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  programInterest: string | null;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRegs, setRecentRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, regsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/registrations"),
      ]);
      if (!dashRes.ok) throw new Error("Failed to load dashboard");
      const dashData = await dashRes.json();
      setStats(dashData);

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRecentRegs(Array.isArray(regsData) ? regsData.slice(0, 5) : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(""); fetchDashboard(); }}
            className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const passed = stats.passFailStats?.passed || 0;
  const failed = stats.passFailStats?.failed || 0;
  const totalResults = passed + failed;
  const passRate = totalResults > 0 ? Math.round((passed / totalResults) * 100) : 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to TLC Admin Panel</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="burgundy" delay={0} />
        <StatCard title="Active Programs" value={stats.activePrograms} icon={BookOpen} color="navy" delay={0.1} />
        <StatCard title="New Registrations" value={stats.recentRegistrations} icon={FileText} color="burgundy" delay={0.2} />
        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon={Trophy} color="emerald" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
            </div>
          </div>
          {recentRegs.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No registrations yet</p>
          ) : (
            <div className="space-y-3">
              {recentRegs.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reg.firstName} {reg.lastName}</p>
                    <p className="text-xs text-gray-500">{reg.phone}{reg.programInterest ? ` · ${reg.programInterest}` : ""}</p>
                  </div>
                  <StatusBadge status={reg.status} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Pass/Fail Ratio</h2>
          </div>
          {totalResults === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No exam results yet</p>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{passRate}%</p>
                <p className="text-sm text-gray-500 mt-1">Overall Pass Rate</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{passed}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Passed</p>
                </div>
                <div className="flex-1 bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{failed}</p>
                  <p className="text-xs text-red-600 font-medium mt-1">Failed</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${passRate}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

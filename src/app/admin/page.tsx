"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FileText,
  Trophy,
  TrendingUp,
  Clock,
  BarChart3,
  CalendarCheck,
  ClipboardCheck,
  UsersRound,
  GraduationCap,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import GlobalSearch from "@/components/admin/GlobalSearch";
import QuickActions from "@/components/admin/QuickActions";

const ChartSkeleton = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
  </div>
);

const RegistrationsChart = dynamic(
  () => import("@/components/admin/charts/RegistrationsChart"),
  { ssr: false, loading: ChartSkeleton }
);
const ProgramDistributionChart = dynamic(
  () => import("@/components/admin/charts/ProgramDistributionChart"),
  { ssr: false, loading: ChartSkeleton }
);
const AttendanceChart = dynamic(
  () => import("@/components/admin/charts/AttendanceChart"),
  { ssr: false, loading: ChartSkeleton }
);
const PerformanceChart = dynamic(
  () => import("@/components/admin/charts/PerformanceChart"),
  { ssr: false, loading: ChartSkeleton }
);
const EnrollmentTrendChart = dynamic(
  () => import("@/components/admin/charts/EnrollmentTrendChart"),
  { ssr: false, loading: ChartSkeleton }
);
const BookingStatsChart = dynamic(
  () => import("@/components/admin/charts/BookingStatsChart"),
  { ssr: false, loading: ChartSkeleton }
);

interface DashboardStats {
  totalStudents: number;
  activePrograms: number;
  upcomingExams: number;
  recentRegistrations: number;
  passFailStats: Record<string, number>;
  totalBookings: number;
  pendingBookings: number;
  overallAttendanceRate: number;
  totalGroups: number;
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

interface AnalyticsData {
  registrationsByDate: Array<{ date: string; count: number }>;
  programDistribution: Array<{ program: string; count: number }>;
  registrationsByStatus: Array<{ status: string; count: number }>;
  attendanceByDate: Array<{ date: string; rate: number; total: number; present: number }>;
  bookingsByType: Array<{ type: string; count: number }>;
  bookingsByStatus: Array<{ status: string; count: number }>;
  performanceDistribution: Array<{ range: string; count: number }>;
  enrollmentTrend: Array<{ month: string; count: number }>;
  studentsByStatus: Array<{ status: string; count: number }>;
}

const periods = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRegs, setRecentRegs] = useState<Registration[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
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
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/dashboard/analytics?period=${period}`);
      if (res.ok) {
        setAnalytics(await res.json());
      }
    } catch {
      // Analytics are non-critical
    }
  }, [period]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome to TLC Admin Panel</p>
          </div>
          <GlobalSearch />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <QuickActions />
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="burgundy" delay={0} />
        <StatCard title="Active Programs" value={stats.activePrograms} icon={BookOpen} color="navy" delay={0.1} />
        <StatCard title="New Registrations" value={stats.recentRegistrations} icon={FileText} color="burgundy" delay={0.2} />
        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon={Trophy} color="emerald" delay={0.3} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Attendance Rate" value={`${stats.overallAttendanceRate}%`} icon={ClipboardCheck} color="emerald" delay={0.4} />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} color="navy" delay={0.5} />
        <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={Clock} color="burgundy" delay={0.6} />
        <StatCard title="Active Groups" value={stats.totalGroups} icon={UsersRound} color="navy" delay={0.7} />
      </div>

      {/* Analytics charts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h2>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p.value
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Registrations Over Time</h3>
            <RegistrationsChart data={analytics?.registrationsByDate || []} />
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Program Distribution</h3>
            <ProgramDistributionChart data={analytics?.programDistribution || []} />
          </motion.div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            Attendance Rate Over Time
          </h3>
          <AttendanceChart data={analytics?.attendanceByDate || []} />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            Student Performance Distribution
          </h3>
          <PerformanceChart data={analytics?.performanceDistribution || []} />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-navy)]" />
            Enrollment Trend
          </h3>
          <EnrollmentTrendChart data={analytics?.enrollmentTrend || []} />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[var(--color-burgundy)]" />
            Booking Statistics
          </h3>
          <BookingStatsChart typeData={analytics?.bookingsByType || []} statusData={analytics?.bookingsByStatus || []} />
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Registrations</h2>
            </div>
          </div>
          {recentRegs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">No registrations yet</p>
          ) : (
            <div className="space-y-3">
              {recentRegs.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{reg.firstName} {reg.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{reg.phone}{reg.programInterest ? ` · ${reg.programInterest}` : ""}</p>
                  </div>
                  <StatusBadge status={reg.status} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pass/Fail Ratio</h2>
          </div>
          {totalResults === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">No exam results yet</p>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{passRate}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall Pass Rate</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{passed}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Passed</p>
                </div>
                <div className="flex-1 bg-red-50 dark:bg-red-900/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{failed}</p>
                  <p className="text-xs text-red-600 font-medium mt-1">Failed</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
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

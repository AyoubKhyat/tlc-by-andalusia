"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  typeData: Array<{ type: string; count: number }>;
  statusData: Array<{ status: string; count: number }>;
}

const TYPE_COLORS = ["#7A1F3E", "#1B2A4A", "#9B2D50", "#4A6FA5", "#2A3F6A"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#22c55e",
  cancelled: "#ef4444",
  completed: "#3b82f6",
};

export default function BookingStatsChart({ typeData, statusData }: Props) {
  if (typeData.length === 0 && statusData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        No booking data for this period
      </div>
    );
  }

  const formatType = (t: string) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 font-medium">By Type</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count" nameKey="type">
              {typeData.map((_, i) => (
                <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              formatter={(value, name) => [String(value), formatType(String(name))]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(v: string) => formatType(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 font-medium">By Status</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count" nameKey="status">
              {statusData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.status] || "#9ca3af"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              formatter={(value, name) => [String(value), formatType(String(name))]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(v: string) => formatType(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

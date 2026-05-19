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
  data: Array<{ program: string; count: number }>;
}

const COLORS = ["#7A1F3E", "#1B2A4A", "#9B2D50", "#2A3F6A", "#5A1530", "#4A6FA5", "#C2456B", "#3D5A80"];

export default function ProgramDistributionChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        No student enrollment data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="count"
          nameKey="program"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "13px",
          }}
          formatter={(value, name) => [String(value), String(name)]}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          formatter={(value: string) =>
            value.length > 20 ? value.slice(0, 20) + "..." : value
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

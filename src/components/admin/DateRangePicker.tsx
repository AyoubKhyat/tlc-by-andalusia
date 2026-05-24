"use client";

import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  className?: string;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const presets = [
  {
    label: "Today",
    getRange: () => {
      const today = formatDate(new Date());
      return [today, today] as const;
    },
  },
  {
    label: "Last 7 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return [formatDate(start), formatDate(end)] as const;
    },
  },
  {
    label: "Last 30 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      return [formatDate(start), formatDate(end)] as const;
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [formatDate(start), formatDate(end)] as const;
    },
  },
  {
    label: "Last Month",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return [formatDate(start), formatDate(end)] as const;
    },
  },
  {
    label: "All Time",
    getRange: () => ["", ""] as const,
  },
];

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = "",
}: DateRangePickerProps) {
  const activePreset = presets.find((p) => {
    const [s, e] = p.getRange();
    return s === startDate && e === endDate;
  });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Date inputs row */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
            className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]/20 focus:border-[var(--color-burgundy)] transition-colors"
          />
        </div>
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium select-none">
          &ndash;
        </span>
        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
            className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]/20 focus:border-[var(--color-burgundy)] transition-colors"
          />
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const isActive = activePreset?.label === preset.label;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const [s, e] = preset.getRange();
                onChange(s, e);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                isActive
                  ? "bg-[var(--color-burgundy)] text-white border-[var(--color-burgundy)]"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

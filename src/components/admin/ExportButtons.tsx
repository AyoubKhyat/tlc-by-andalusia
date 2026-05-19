"use client";

import { Download } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/lib/export";

interface ExportColumn {
  key: string;
  label: string;
}

interface ExportButtonsProps {
  data: Record<string, unknown>[];
  filename: string;
  title: string;
  columns: ExportColumn[];
}

export default function ExportButtons({ data, filename, title, columns }: ExportButtonsProps) {
  if (data.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToCSV(data, filename, columns)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        CSV
      </button>
      <button
        onClick={() => exportToPDF(data, filename, title, columns)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        PDF
      </button>
    </div>
  );
}

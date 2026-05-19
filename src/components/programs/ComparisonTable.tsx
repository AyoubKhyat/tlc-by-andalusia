"use client";

import { motion } from "framer-motion";

interface Program {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  icon?: string | null;
  ageGroup: string;
  duration: string;
  levels: string;
  description: string;
  objectives: string | string[];
}

function getObjectives(objectives: string | string[]): string[] {
  if (Array.isArray(objectives)) return objectives;
  try {
    const parsed = JSON.parse(objectives);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return objectives ? objectives.split("\n").filter(Boolean) : [];
  }
}

export default function ComparisonTable({ programs }: { programs: Program[] }) {
  const rows: { label: string; key: string }[] = [
    { label: "Age Range", key: "ageGroup" },
    { label: "Duration", key: "duration" },
    { label: "Levels", key: "levels" },
    { label: "Description", key: "description" },
    { label: "Key Objectives", key: "objectives" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="md:hidden text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Scroll horizontally to compare
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-[var(--burgundy)] text-white text-left px-5 py-4 font-semibold text-sm min-w-[140px] border-r border-white/10">
                Program
              </th>
              {programs.map((program) => (
                <th
                  key={program.id || program.title}
                  className="bg-[var(--burgundy)] text-white text-center px-4 py-4 font-semibold text-sm min-w-[180px] border-r border-white/10 last:border-r-0"
                >
                  {program.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.key}>
                <td
                  className={`sticky left-0 z-10 px-5 py-4 font-semibold text-sm text-navy dark:text-white border-r border-gray-200 dark:border-slate-700 ${
                    rowIndex % 2 === 0
                      ? "bg-cream dark:bg-slate-800"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  {row.label}
                </td>
                {programs.map((program) => (
                  <td
                    key={program.id || program.title}
                    className={`px-4 py-4 text-sm text-gray-600 dark:text-gray-300 text-center border-r border-gray-100 dark:border-slate-700 last:border-r-0 ${
                      rowIndex % 2 === 0
                        ? "bg-cream/50 dark:bg-slate-800/50"
                        : "bg-white dark:bg-slate-900"
                    }`}
                  >
                    {row.key === "objectives" ? (
                      <ul className="text-left space-y-1">
                        {getObjectives(program.objectives).map((obj) => (
                          <li key={obj} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      (program as unknown as Record<string, unknown>)[row.key] as string
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

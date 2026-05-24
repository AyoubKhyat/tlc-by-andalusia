"use client";

import { cn } from "@/lib/utils";

// --- Base Skeleton ---

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "card";
}

export default function Skeleton({
  variant = "rectangle",
  className,
  ...props
}: SkeletonProps) {
  const variantClasses: Record<string, string> = {
    rectangle: "rounded-md",
    circle: "rounded-full",
    card: "rounded-xl h-[200px] w-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-slate-700",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

// --- SkeletonTable ---

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div>
      {/* Search bar skeleton */}
      <div className="mb-4">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-xl">
        <table className="w-full">
          {/* Header row */}
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <th key={colIdx} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          {/* Data rows */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-gray-100 dark:border-slate-700"
              >
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton
                      className={cn(
                        "h-4",
                        colIdx === 0 ? "w-32" : "w-24"
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SkeletonStatCards ---

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton variant="rectangle" className="w-12 h-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SkeletonChart ---

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
      {/* Chart title */}
      <Skeleton className="h-5 w-40 mb-6" />

      {/* Fake chart area */}
      <div className="flex items-end gap-3 h-48">
        {[40, 65, 45, 80, 55, 70, 50, 60, 75, 35, 90, 55].map(
          (height, idx) => (
            <Skeleton
              key={idx}
              className="flex-1 rounded-t-md"
              style={{ height: `${height}%` }}
            />
          )
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-3 mt-3">
        {Array.from({ length: 12 }).map((_, idx) => (
          <Skeleton key={idx} className="flex-1 h-3 rounded" />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange?: (status: string) => void;
  onClear: () => void;
  statusOptions?: { value: string; label: string }[];
}

export default function BulkActionBar({
  selectedCount,
  onDelete,
  onStatusChange,
  onClear,
  statusOptions,
}: BulkActionBarProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="mb-4 flex items-center gap-3 px-4 py-3 bg-[var(--color-burgundy)]/10 dark:bg-[var(--color-burgundy)]/20 border border-[var(--color-burgundy)]/20 dark:border-[var(--color-burgundy)]/30 rounded-xl"
        >
          <span className="text-sm font-medium text-[var(--color-burgundy)] dark:text-[var(--color-burgundy-light,#d4a0a0)]">
            {selectedCount} selected
          </span>

          <div className="flex items-center gap-2 ml-auto">
            {statusOptions && onStatusChange && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Change Status
                  <ChevronDown size={14} />
                </button>
                {statusOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[140px]">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onStatusChange(opt.value);
                          setStatusOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>

            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

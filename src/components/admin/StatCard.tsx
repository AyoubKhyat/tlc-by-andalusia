"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: "burgundy" | "navy" | "emerald" | "purple";
  delay?: number;
}

const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
  burgundy: { bg: "bg-[var(--color-burgundy)]/10", icon: "text-[var(--color-burgundy)]", text: "text-[var(--color-burgundy)]" },
  navy: { bg: "bg-[var(--color-navy)]/10", icon: "text-[var(--color-navy)]", text: "text-[var(--color-navy)]" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", text: "text-emerald-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-600" },
};

export default function StatCard({ title, value, icon: Icon, color = "burgundy", delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = colorClasses[color];

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;
    const increment = value / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{displayValue}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
}

const categoryStyles: Record<string, { bg: string; text: string }> = {
  open_day: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  exam: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
  enrollment: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  workshop: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  holiday: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  general: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400" },
};

export default function EventCard({ event, index }: { event: Event; index: number }) {
  const style = categoryStyles[event.category] || categoryStyles.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          {event.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <CalendarDays size={14} />
          {formatDate(event.date)}
        </span>
        {event.time && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {event.time}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {event.location}
          </span>
        )}
      </div>
    </motion.div>
  );
}

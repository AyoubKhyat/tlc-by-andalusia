"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
}

const categoryColors: Record<string, string> = {
  open_day: "bg-emerald-500",
  exam: "bg-red-500",
  enrollment: "bg-blue-500",
  workshop: "bg-purple-500",
  holiday: "bg-amber-500",
  general: "bg-[var(--color-burgundy)]",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventCalendar({ events, onMonthChange }: { events: Event[]; onMonthChange: (month: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const navigate = (dir: number) => {
    const newDate = new Date(year, month + dir, 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    const m = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(m);
  };

  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all text-sm ${
                isSelected
                  ? "bg-[var(--color-burgundy)] text-white"
                  : isToday
                  ? "bg-[var(--color-burgundy)]/10 text-[var(--color-burgundy)] font-bold"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : categoryColors[e.category] || categoryColors.general}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {selectedEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${categoryColors[e.category] || categoryColors.general}`} />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{e.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{e.description}</p>
                {(e.time || e.location) && (
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    {e.time && <span>{e.time}</span>}
                    {e.location && <span>{e.location}</span>}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

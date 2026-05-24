"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Filter, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventType = "event" | "exam" | "booking" | "attendance";

interface CalendarItem {
  id: string;
  type: EventType;
  title: string;
  date: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EVENT_TYPE_META: Record<EventType, { label: string; color: string; darkColor: string }> = {
  event:      { label: "Events",     color: "#7A1F3E", darkColor: "#c4537a" },
  exam:       { label: "Exams",      color: "#D4A843", darkColor: "#e0c06e" },
  booking:    { label: "Bookings",   color: "#1B2A4A", darkColor: "#5a7ec2" },
  attendance: { label: "Attendance", color: "#2D6A4F", darkColor: "#5aaf89" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0 = Sun
  const totalDays = lastDay.getDate();

  const days: { date: Date; inMonth: boolean }[] = [];

  // Leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, inMonth: false });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    days.push({ date: new Date(year, month, d), inMonth: true });
  }

  // Trailing days to fill 6-row grid (42 cells) or 5-row (35 cells)
  const targetCells = days.length > 35 ? 42 : 35;
  while (days.length < targetCells) {
    const nextDate = new Date(year, month + 1, days.length - startDow - totalDays + 1);
    days.push({ date: nextDate, inMonth: false });
  }

  return days;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<EventType, boolean>>({
    event: true,
    exam: true,
    booking: true,
    attendance: true,
  });

  // ---- Fetch calendar data ------------------------------------------------

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar?month=${month}&year=${year}`);
      if (res.ok) {
        setItems(await res.json());
      } else {
        toast.error("Failed to load calendar data");
      }
    } catch {
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  // ---- Derived data -------------------------------------------------------

  const filteredItems = useMemo(
    () => items.filter((item) => filters[item.type]),
    [items, filters],
  );

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const item of filteredItems) {
      const key = toDateKey(new Date(item.date));
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return map;
  }, [filteredItems]);

  const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);

  const selectedDayItems = useMemo(
    () => (selectedDate ? itemsByDate[selectedDate] || [] : []),
    [selectedDate, itemsByDate],
  );

  // ---- Navigation ---------------------------------------------------------

  const goToPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(todayKey);
  };

  // ---- Filter toggle ------------------------------------------------------

  const toggleFilter = (type: EventType) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // ---- Render -------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-burgundy)] rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unified view of events, exams, bookings &amp; attendance
            </p>
          </div>
        </div>

        <button
          onClick={goToToday}
          className="self-start sm:self-auto px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-burgundy)] text-white hover:opacity-90 transition"
        >
          Today
        </button>
      </div>

      {/* Legend & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by type
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(EVENT_TYPE_META) as EventType[]).map((type) => {
            const meta = EVENT_TYPE_META[type];
            const active = filters[type];
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  active
                    ? "border-transparent text-white shadow-sm"
                    : "border-gray-300 dark:border-slate-600 text-gray-400 dark:text-gray-500 bg-transparent"
                }`}
                style={active ? { backgroundColor: meta.color } : undefined}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: active ? "#fff" : meta.color }}
                />
                {meta.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Calendar + Side Panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, inMonth }, idx) => {
                const key = toDateKey(date);
                const isToday = key === todayKey;
                const isSelected = key === selectedDate;
                const dayItems = itemsByDate[key] || [];
                const dayNum = date.getDate();

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.005, duration: 0.2 }}
                    onClick={() => setSelectedDate(isSelected ? null : key)}
                    className={`relative flex flex-col items-center gap-1 py-2 sm:py-3 min-h-[72px] sm:min-h-[88px] border-b border-r border-gray-100 dark:border-slate-800 transition-colors duration-150 cursor-pointer ${
                      !inMonth
                        ? "bg-gray-50/50 dark:bg-slate-950/50"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    } ${isSelected ? "bg-blue-50 dark:bg-slate-800 ring-2 ring-[var(--color-burgundy)] ring-inset" : ""}`}
                  >
                    {/* Day Number */}
                    <span
                      className={`text-sm font-medium leading-none ${
                        !inMonth
                          ? "text-gray-300 dark:text-gray-600"
                          : isToday
                            ? "w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-burgundy)] text-white font-bold"
                            : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Event Dots */}
                    {dayItems.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 px-1 mt-1">
                        {dayItems.length <= 4 ? (
                          dayItems.map((item) => (
                            <span
                              key={item.id}
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                              title={item.title}
                            />
                          ))
                        ) : (
                          <>
                            {dayItems.slice(0, 3).map((item) => (
                              <span
                                key={item.id}
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                                title={item.title}
                              />
                            ))}
                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 leading-none">
                              +{dayItems.length - 3}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Pills for larger screens - show first 2 events as tiny labels */}
                    {dayItems.length > 0 && inMonth && (
                      <div className="hidden sm:flex flex-col gap-0.5 w-full px-1 mt-auto">
                        {dayItems.slice(0, 2).map((item) => (
                          <span
                            key={item.id}
                            className="block w-full truncate text-[10px] leading-tight px-1 py-0.5 rounded text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.title}
                          </span>
                        ))}
                        {dayItems.length > 2 && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                            +{dayItems.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Side Panel */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
              className="lg:w-80 xl:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden self-start"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {WEEKDAYS[new Date(selectedDate + "T00:00:00").getDay()]}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Panel Body */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {selectedDayItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                    <Calendar className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm">No events on this day</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDayItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700/80 transition"
                      >
                        <span
                          className="w-3 h-3 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: item.color }}
                            >
                              {EVENT_TYPE_META[item.type].label}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <Clock className="w-3 h-3" />
                              {new Date(item.date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              {selectedDayItems.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {selectedDayItems.length} item{selectedDayItems.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

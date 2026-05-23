"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarDays, List } from "lucide-react";
import EventCalendar from "@/components/events/EventCalendar";
import EventCard from "@/components/events/EventCard";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async (month?: string) => {
    try {
      const url = month ? `/api/events?month=${month}` : "/api/events";
      const res = await fetch(url);
      if (res.ok) setEvents(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
              <CalendarDays className="inline w-4 h-4 mr-2" />
              Stay Updated
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Events & Calendar</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Stay informed about upcoming open days, exams, enrollment periods, and workshops at TLC.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-end mb-8">
            <div className="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  view === "calendar" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <CalendarDays size={16} />
                Calendar
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  view === "list" ? "bg-[var(--color-burgundy)] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <List size={16} />
                List
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
            </div>
          ) : view === "calendar" ? (
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
              <EventCalendar events={events} onMonthChange={fetchEvents} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                </div>
              ) : (
                events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

interface AvailableSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  spotsLeft: number;
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", type: "placement_test", message: "" };

export default function BookingPage() {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) setSlots(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const filteredSlots = filterType === "all" ? slots : slots.filter((s) => s.type === filterType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) { toast.error("Please select a time slot"); return; }
    if (!form.firstName || !form.lastName || !form.email || !form.phone) { toast.error("All fields are required"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, timeSlotId: selectedSlot.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book");
      }
      setSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to book");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Booking Confirmed!</h1>
            </motion.div>
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
          <div className="max-w-md mx-auto text-center px-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Thank You!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your booking has been submitted. We&apos;ll review it and get back to you shortly.
            </p>
            <a href="/" className="inline-block px-6 py-3 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
              Back to Home
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
              <CalendarCheck className="inline w-4 h-4 mr-2" />
              Schedule Your Visit
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Book a Slot</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Schedule a placement test or consultation at TLC by Andalusia Academy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Slots</h2>
              <div className="flex gap-2 mb-4">
                {["all", "placement_test", "consultation"].map((t) => (
                  <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-[var(--color-burgundy)] text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"}`}>
                    {t === "all" ? "All" : t.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" /></div>
              ) : filteredSlots.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">No available slots at the moment.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedSlot?.id === slot.id
                          ? "border-[var(--color-burgundy)] bg-[var(--color-burgundy)]/5 ring-2 ring-[var(--color-burgundy)]/20"
                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(slot.date)}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock size={12} />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-medium text-gray-400">{slot.type.replace("_", " ")}</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400">{slot.spotsLeft} spot{slot.spotsLeft !== 1 ? "s" : ""} left</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 6XX XXX XXX" className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent" />
                </div>
                <button type="submit" disabled={submitting || !selectedSlot} className="w-full py-3 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
                  {submitting ? "Booking..." : selectedSlot ? "Confirm Booking" : "Select a slot first"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  Loader2,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const programOptions = [
  "Kids English (7-9)",
  "Juniors English (10-14)",
  "Teens English (15-17)",
  "Adult English (18+)",
  "Academic English",
  "Conversation Classes",
  "TOEFL Preparation",
  "IELTS Preparation",
  "TOEIC Preparation",
  "Arabic",
  "French",
  "Italian",
  "Other",
];

export default function ContactPage() {
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-50px" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    programInterest: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          parentName: "",
          parentPhone: "",
          programInterest: "",
          message: "",
        });
      } else {
        setError(
          "There was an error submitting your registration. Please try again."
        );
      }
    } catch {
      setError("Unable to connect. Please try again or contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
              top: "-10%",
              left: "20%",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 bg-white/10 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Register &amp; <span className="text-white/90">Contact Us</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to start? Fill out the form below or reach out to us
            directly. We would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 lg:py-24 bg-cream relative overflow-hidden noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact info sidebar */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/212643434382"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-6 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-7 h-7" />
                  <span className="text-xl font-bold">WhatsApp Us</span>
                </div>
                <p className="text-emerald-100 text-sm">
                  Get instant answers to your questions. Tap to chat with us on
                  WhatsApp now.
                </p>
              </a>

              {/* Phone */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-burgundy flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-navy">Phone</h3>
                </div>
                <p className="text-gray-600">0643 43 43 82</p>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-burgundy flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-navy">Address</h3>
                </div>
                <p className="text-gray-600">
                  Rue Prestige Targa 1, Marrakech
                </p>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-[#2A3F6A] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-navy">Opening Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Morning (Sat-Sun)</span>
                    <span>9h - 11h</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Afternoon (Mon-Thu)</span>
                    <span>17h - 19h</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps?q=Rue+Prestige+Targa+1,+Marrakech,+Morocco&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="TLC Location - Rue Prestige Targa 1, Marrakech"
                />
              </div>
            </motion.div>

            {/* Registration form */}
            <motion.div
              ref={formRef}
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  Registration Form
                </h2>
                <p className="text-gray-500 mb-8 text-sm">
                  Fill out the form and we will get back to you within 24 hours.
                </p>

                {success && (
                  <motion.div
                    className="mb-6 p-4 bg-emerald-50 rounded-xl flex items-center gap-3 text-emerald-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium text-sm">
                      Registration submitted successfully! We will contact you
                      soon.
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Phone *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="06XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="parentName"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Parent Name{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="parentName"
                        name="parentName"
                        type="text"
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="Parent/guardian name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="parentPhone"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Parent Phone{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="parentPhone"
                        name="parentPhone"
                        type="tel"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400"
                        placeholder="Parent phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="programInterest"
                      className="block text-sm font-semibold text-navy mb-2"
                    >
                      Program of Interest *
                    </label>
                    <select
                      id="programInterest"
                      name="programInterest"
                      value={formData.programInterest}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy bg-white"
                    >
                      <option value="">Select a program</option>
                      {programOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-navy mb-2"
                    >
                      Message{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400 resize-none"
                      placeholder="Tell us about your goals, questions, or any specific needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 rounded-xl gradient-burgundy text-white font-semibold text-lg hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Registration
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

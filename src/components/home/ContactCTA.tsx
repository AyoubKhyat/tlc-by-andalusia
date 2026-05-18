"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 gradient-burgundy relative overflow-hidden noise-overlay moroccan-pattern">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-white/10"
          style={{ top: "-5%", right: "-5%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full border border-white/5"
          style={{ bottom: "-5%", left: "-3%" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-white/10"
          style={{ top: "20%", left: "10%" }}
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-white/5"
          style={{ bottom: "20%", right: "15%" }}
          animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your{" "}
            <span className="text-white/90">Language Journey</span>?
          </h2>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Take the first step toward fluency. Register for a placement test,
            explore our programs, or reach out to us directly. Your future in
            languages starts today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-burgundy font-semibold text-lg hover:bg-white/90 hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
            >
              Register Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/212643434382"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:border-white/60 w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

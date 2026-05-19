"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-burgundy bg-burgundy/10 mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-6 leading-tight">
              A Center Built on{" "}
              <span className="text-gradient">Passion for Language</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              TLC (The Language Center) by Andalusia Academy is a premier
              language learning institution nestled in the vibrant city of
              Marrakech. We specialize in English language education using
              communicative, natural methods that put speaking confidence at the
              forefront.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              Our programs cater to all ages, from young kids discovering
              languages for the first time to adults preparing for international
              exams. Every class is designed to be interactive, engaging, and
              results-driven.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-burgundy font-semibold text-lg hover:gap-4 transition-all duration-300"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right: Decorative stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-cream dark:bg-slate-800 rounded-3xl p-8 lg:p-10">
              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-burgundy to-burgundy-light rounded-2xl opacity-20 rotate-12" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-burgundy to-burgundy-light rounded-2xl opacity-20 -rotate-12" />

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm text-center">
                  <div className="text-3xl font-bold text-burgundy mb-1">
                    7+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Years of Excellence
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm text-center">
                  <div className="text-3xl font-bold text-burgundy mb-1">500+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Happy Students</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm text-center">
                  <div className="text-3xl font-bold text-navy dark:text-white mb-1">15+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Programs</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm text-center">
                  <div className="text-3xl font-bold text-burgundy mb-1">
                    95%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm relative z-10">
                <p className="text-gray-600 dark:text-gray-300 italic text-center">
                  &quot;English, The Natural Way &mdash; where communication
                  meets confidence.&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  isInView: boolean;
  duration?: number;
}

function Counter({ target, suffix = "", isInView, duration = 2 }: CounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, target, count, duration]);

  return (
    <motion.span>
      {isInView ? (
        <motion.span>{rounded}</motion.span>
      ) : (
        <span>0</span>
      )}
      {suffix}
    </motion.span>
  );
}

const stats = [
  { value: 500, suffix: "+", label: "Students Enrolled", description: "Learners trust TLC for their language goals" },
  { value: 15, suffix: "+", label: "Programs Offered", description: "Covering all ages and proficiency levels" },
  { value: 7, suffix: "+", label: "Years Experience", description: "Of delivering excellence in Marrakech" },
  { value: 95, suffix: "%", label: "Success Rate", description: "Students achieve their target level" },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 gradient-hero relative overflow-hidden noise-overlay moroccan-pattern">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every number represents a story of growth, dedication, and success in language learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass rounded-2xl p-6 lg:p-8 text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>
              <div className="text-white font-semibold text-lg mb-1">
                {stat.label}
              </div>
              <div className="text-white/60 text-sm hidden sm:block">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

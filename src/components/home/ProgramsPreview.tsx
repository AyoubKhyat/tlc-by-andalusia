"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Baby,
  GraduationCap,
  Users,
  Briefcase,
  FileCheck,
  Globe,
  ArrowRight,
} from "lucide-react";

const programs = [
  {
    icon: Baby,
    title: "Kids English",
    ageGroup: "Ages 7-9",
    description:
      "Fun, interactive English lessons that spark curiosity and build a strong foundation through games, songs, and storytelling.",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Users,
    title: "Juniors English",
    ageGroup: "Ages 10-14",
    description:
      "Engaging programs designed to develop reading, writing, and speaking skills through collaborative projects and real-world topics.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: GraduationCap,
    title: "Teens English",
    ageGroup: "Ages 15-17",
    description:
      "Advanced communication skills, critical thinking, and exam preparation to ready teens for academic and professional success.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Briefcase,
    title: "Adult English",
    ageGroup: "Ages 18+",
    description:
      "Professional and conversational English for adults seeking career advancement, travel fluency, or personal growth.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: FileCheck,
    title: "Exam Preparation",
    ageGroup: "TOEFL / IELTS / TOEIC",
    description:
      "Intensive test preparation courses with practice exams, strategies, and personalized coaching for top scores.",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Globe,
    title: "Other Languages",
    ageGroup: "Arabic, French, Italian",
    description:
      "Expand your linguistic horizons with our diverse language offerings taught through the same natural, communicative approach.",
    color: "from-cyan-400 to-blue-500",
  },
];

export default function ProgramsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-burgundy bg-burgundy/10 mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            Programs for{" "}
            <span className="text-gradient">Every Age &amp; Goal</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            From young learners to professionals, we offer tailored programs
            that meet you exactly where you are on your language journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="group relative rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 h-full shadow-sm overflow-hidden"
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient accent at top */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${program.color}`}
                />

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4`}
                >
                  <program.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-navy dark:text-white mb-1">
                  {program.title}
                </h3>
                <p className="text-sm text-burgundy font-medium mb-3">
                  {program.ageGroup}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  {program.description}
                </p>

                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1.5 text-burgundy font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-burgundy text-white font-semibold text-lg hover:shadow-lg hover:shadow-burgundy/30 transition-all duration-300 hover:scale-105"
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

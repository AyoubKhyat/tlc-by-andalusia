"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Baby,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  MessageCircle,
  FileCheck,
  Globe,
  Clock,
  BarChart3,
  Target,
  ArrowRight,
} from "lucide-react";

type Category = "all" | "english" | "exam" | "languages";

interface Program {
  title: string;
  category: Category;
  icon: React.ComponentType<{ className?: string }>;
  ageGroup: string;
  duration: string;
  levels: string;
  description: string;
  objectives: string[];
  color: string;
}

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All Programs" },
  { key: "english", label: "English" },
  { key: "exam", label: "Exam Prep" },
  { key: "languages", label: "Other Languages" },
];

const programs: Program[] = [
  {
    title: "Kids English",
    category: "english",
    icon: Baby,
    ageGroup: "Ages 7-9",
    duration: "3 months per level",
    levels: "Starter, Beginner, Elementary",
    description:
      "An exciting introduction to English for young learners. Through games, songs, storytelling, and interactive activities, children develop foundational vocabulary, pronunciation, and the confidence to express themselves in English.",
    objectives: [
      "Build basic vocabulary through play",
      "Develop listening comprehension",
      "Encourage natural pronunciation",
      "Foster a love of language learning",
    ],
    color: "from-pink-400 to-rose-500",
  },
  {
    title: "Juniors English",
    category: "english",
    icon: Users,
    ageGroup: "Ages 10-14",
    duration: "3 months per level",
    levels: "A1, A2, B1",
    description:
      "A dynamic program for pre-teens and young teens that builds reading, writing, speaking, and listening skills through collaborative projects, discussions, and real-world topics relevant to their interests.",
    objectives: [
      "Strengthen all four language skills",
      "Develop critical thinking in English",
      "Build academic vocabulary",
      "Prepare for secondary school English",
    ],
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Teens English",
    category: "english",
    icon: GraduationCap,
    ageGroup: "Ages 15-17",
    duration: "3 months per level",
    levels: "A2, B1, B2",
    description:
      "Advanced communication and academic English for teenagers preparing for higher education or international opportunities. Emphasis on debate, essay writing, presentation skills, and exam readiness.",
    objectives: [
      "Master advanced grammar and vocabulary",
      "Develop presentation and debate skills",
      "Practice academic writing",
      "Prepare for university-level English",
    ],
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Adult English",
    category: "english",
    icon: Briefcase,
    ageGroup: "Ages 18+",
    duration: "3 months per level",
    levels: "A1 to C1",
    description:
      "Comprehensive English courses for adults of all levels, from absolute beginners to advanced speakers. Focus on practical communication for professional, academic, and personal contexts.",
    objectives: [
      "Achieve fluency in professional English",
      "Master business communication",
      "Build confidence in social situations",
      "Reach target CEFR level",
    ],
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Academic English",
    category: "english",
    icon: BookOpen,
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1 to C1",
    description:
      "Specialized program focusing on academic English skills required for university admission and success. Covers essay writing, research skills, academic vocabulary, and critical analysis.",
    objectives: [
      "Master academic writing conventions",
      "Develop research and citation skills",
      "Build advanced academic vocabulary",
      "Prepare for university-level coursework",
    ],
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Conversation Classes",
    category: "english",
    icon: MessageCircle,
    ageGroup: "Ages 16+",
    duration: "Ongoing",
    levels: "A2 to C1",
    description:
      "Focused conversation practice sessions designed to boost speaking fluency and listening comprehension. Real-world topics, role-plays, discussions, and spontaneous speaking activities.",
    objectives: [
      "Increase speaking fluency and speed",
      "Improve listening comprehension",
      "Expand idiomatic expressions",
      "Build confidence in spontaneous speech",
    ],
    color: "from-rose-400 to-pink-500",
  },
  {
    title: "TOEFL Preparation",
    category: "exam",
    icon: FileCheck,
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1+ entry required",
    description:
      "Intensive preparation for the TOEFL iBT exam. Covers all four sections with practice tests, test-taking strategies, time management techniques, and personalized feedback.",
    objectives: [
      "Master all TOEFL sections",
      "Develop effective test strategies",
      "Practice with authentic materials",
      "Achieve target score",
    ],
    color: "from-sky-400 to-blue-500",
  },
  {
    title: "IELTS Preparation",
    category: "exam",
    icon: FileCheck,
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1+ entry required",
    description:
      "Comprehensive IELTS preparation covering Academic and General Training modules. Intensive practice on reading, writing, listening, and speaking with mock exams and expert guidance.",
    objectives: [
      "Achieve target band score",
      "Master each IELTS component",
      "Build test-taking confidence",
      "Receive detailed performance feedback",
    ],
    color: "from-teal-400 to-emerald-500",
  },
  {
    title: "TOEIC Preparation",
    category: "exam",
    icon: FileCheck,
    ageGroup: "Ages 18+",
    duration: "2 months",
    levels: "A2+ entry required",
    description:
      "Focused preparation for the TOEIC exam, targeting professionals who need certified English proficiency for career advancement, international assignments, or company requirements.",
    objectives: [
      "Improve professional English scores",
      "Practice business English contexts",
      "Develop speed and accuracy",
      "Achieve certification goals",
    ],
    color: "from-orange-400 to-amber-500",
  },
  {
    title: "Arabic",
    category: "languages",
    icon: Globe,
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "Beginner to Advanced",
    description:
      "Learn Modern Standard Arabic or Moroccan Darija through our communicative approach. Programs available for both native speakers seeking literacy and non-native speakers discovering the language.",
    objectives: [
      "Develop reading and writing in Arabic",
      "Build conversational fluency",
      "Understand cultural contexts",
      "Achieve target proficiency level",
    ],
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "French",
    category: "languages",
    icon: Globe,
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "A1 to B2",
    description:
      "Master French for academic, professional, or personal goals. Our communicative approach ensures you develop practical speaking skills alongside grammar and vocabulary foundations.",
    objectives: [
      "Achieve conversational fluency",
      "Master French grammar structures",
      "Prepare for DELF/DALF exams",
      "Develop cultural competence",
    ],
    color: "from-blue-400 to-sky-500",
  },
  {
    title: "Italian",
    category: "languages",
    icon: Globe,
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "A1 to B1",
    description:
      "Discover the beauty of Italian through engaging, communicative lessons. Perfect for travel, culture, or professional needs, our program makes learning Italian natural and enjoyable.",
    objectives: [
      "Build practical Italian skills",
      "Develop listening comprehension",
      "Explore Italian culture and cuisine",
      "Achieve travel-ready fluency",
    ],
    color: "from-red-400 to-orange-500",
  },
];

function PageHero() {
  return (
    <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
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
          Our Programs
        </motion.span>
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Find Your <span className="text-white/90">Perfect Program</span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          From young learners to professionals, we offer tailored language
          programs designed to help you reach your goals.
        </motion.p>
      </div>
    </section>
  );
}

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
    >
      <motion.div
        className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-full flex flex-col"
        whileHover={{
          y: -6,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient accent */}
        <div
          className={`h-2 bg-gradient-to-r ${program.color}`}
        />

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center flex-shrink-0`}
            >
              <program.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy">{program.title}</h3>
              <p className="text-sm text-burgundy font-medium">
                {program.ageGroup}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed text-sm">
            {program.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream text-navy font-medium">
              <Clock className="w-3 h-3" />
              {program.duration}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream text-navy font-medium">
              <BarChart3 className="w-3 h-3" />
              {program.levels}
            </span>
          </div>

          {/* Objectives */}
          <div className="mb-5 flex-1">
            <h4 className="text-sm font-semibold text-navy mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Key Objectives
            </h4>
            <ul className="space-y-1.5">
              {program.objectives.map((obj) => (
                <li
                  key={obj}
                  className="text-xs text-gray-500 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl gradient-burgundy text-white font-semibold text-sm hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300"
          >
            Register / Contact
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredPrograms =
    activeCategory === "all"
      ? programs
      : programs.filter((p) => p.category === activeCategory);

  return (
    <>
      <PageHero />

      <section className="py-16 lg:py-20 bg-white relative overflow-hidden noise-overlay moroccan-pattern-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === cat.key
                    ? "gradient-burgundy text-white shadow-lg shadow-burgundy/20"
                    : "bg-cream text-navy hover:bg-burgundy/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Programs grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrograms.map((program, index) => (
                <ProgramCard
                  key={program.title}
                  program={program}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

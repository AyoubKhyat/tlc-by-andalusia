"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
  LayoutGrid,
  TableProperties,
  ChevronDown,
} from "lucide-react";
import ComparisonTable from "@/components/programs/ComparisonTable";

type Category = "all" | "english" | "exam" | "languages";
type ViewMode = "grid" | "compare";

interface Program {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  icon?: string | null;
  ageGroup: string;
  duration: string;
  levels: string;
  description: string;
  objectives: string | string[];
}

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All Programs" },
  { key: "english", label: "English" },
  { key: "exam", label: "Exam Prep" },
  { key: "languages", label: "Other Languages" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Baby,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  MessageCircle,
  FileCheck,
  Globe,
};

const colorMap: Record<string, string> = {
  "kids-english": "from-pink-400 to-rose-500",
  "juniors-english": "from-blue-400 to-indigo-500",
  "teens-english": "from-emerald-400 to-teal-500",
  "adult-english": "from-amber-400 to-orange-500",
  "academic-english": "from-violet-400 to-purple-500",
  "conversation-classes": "from-rose-400 to-pink-500",
  "toefl-preparation": "from-sky-400 to-blue-500",
  "ielts-preparation": "from-teal-400 to-emerald-500",
  "toeic-preparation": "from-orange-400 to-amber-500",
  arabic: "from-green-400 to-emerald-500",
  french: "from-blue-400 to-sky-500",
  italian: "from-red-400 to-orange-500",
};

const defaultColors = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
];

const fallbackPrograms: Program[] = [
  {
    title: "Kids English",
    slug: "kids-english",
    category: "english",
    icon: "Baby",
    ageGroup: "Ages 7-9",
    duration: "3 months per level",
    levels: "Starter, Beginner, Elementary",
    description:
      "An exciting introduction to English for young learners. Through games, songs, storytelling, and interactive activities, children develop foundational vocabulary, pronunciation, and the confidence to express themselves in English.",
    objectives: JSON.stringify([
      "Build basic vocabulary through play",
      "Develop listening comprehension",
      "Encourage natural pronunciation",
      "Foster a love of language learning",
    ]),
  },
  {
    title: "Juniors English",
    slug: "juniors-english",
    category: "english",
    icon: "Users",
    ageGroup: "Ages 10-14",
    duration: "3 months per level",
    levels: "A1, A2, B1",
    description:
      "A dynamic program for pre-teens and young teens that builds reading, writing, speaking, and listening skills through collaborative projects, discussions, and real-world topics relevant to their interests.",
    objectives: JSON.stringify([
      "Strengthen all four language skills",
      "Develop critical thinking in English",
      "Build academic vocabulary",
      "Prepare for secondary school English",
    ]),
  },
  {
    title: "Teens English",
    slug: "teens-english",
    category: "english",
    icon: "GraduationCap",
    ageGroup: "Ages 15-17",
    duration: "3 months per level",
    levels: "A2, B1, B2",
    description:
      "Advanced communication and academic English for teenagers preparing for higher education or international opportunities. Emphasis on debate, essay writing, presentation skills, and exam readiness.",
    objectives: JSON.stringify([
      "Master advanced grammar and vocabulary",
      "Develop presentation and debate skills",
      "Practice academic writing",
      "Prepare for university-level English",
    ]),
  },
  {
    title: "Adult English",
    slug: "adult-english",
    category: "english",
    icon: "Briefcase",
    ageGroup: "Ages 18+",
    duration: "3 months per level",
    levels: "A1 to C1",
    description:
      "Comprehensive English courses for adults of all levels, from absolute beginners to advanced speakers. Focus on practical communication for professional, academic, and personal contexts.",
    objectives: JSON.stringify([
      "Achieve fluency in professional English",
      "Master business communication",
      "Build confidence in social situations",
      "Reach target CEFR level",
    ]),
  },
  {
    title: "Academic English",
    slug: "academic-english",
    category: "english",
    icon: "BookOpen",
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1 to C1",
    description:
      "Specialized program focusing on academic English skills required for university admission and success. Covers essay writing, research skills, academic vocabulary, and critical analysis.",
    objectives: JSON.stringify([
      "Master academic writing conventions",
      "Develop research and citation skills",
      "Build advanced academic vocabulary",
      "Prepare for university-level coursework",
    ]),
  },
  {
    title: "Conversation Classes",
    slug: "conversation-classes",
    category: "english",
    icon: "MessageCircle",
    ageGroup: "Ages 16+",
    duration: "Ongoing",
    levels: "A2 to C1",
    description:
      "Focused conversation practice sessions designed to boost speaking fluency and listening comprehension. Real-world topics, role-plays, discussions, and spontaneous speaking activities.",
    objectives: JSON.stringify([
      "Increase speaking fluency and speed",
      "Improve listening comprehension",
      "Expand idiomatic expressions",
      "Build confidence in spontaneous speech",
    ]),
  },
  {
    title: "TOEFL Preparation",
    slug: "toefl-preparation",
    category: "exam",
    icon: "FileCheck",
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1+ entry required",
    description:
      "Intensive preparation for the TOEFL iBT exam. Covers all four sections with practice tests, test-taking strategies, time management techniques, and personalized feedback.",
    objectives: JSON.stringify([
      "Master all TOEFL sections",
      "Develop effective test strategies",
      "Practice with authentic materials",
      "Achieve target score",
    ]),
  },
  {
    title: "IELTS Preparation",
    slug: "ielts-preparation",
    category: "exam",
    icon: "FileCheck",
    ageGroup: "Ages 16+",
    duration: "2-3 months",
    levels: "B1+ entry required",
    description:
      "Comprehensive IELTS preparation covering Academic and General Training modules. Intensive practice on reading, writing, listening, and speaking with mock exams and expert guidance.",
    objectives: JSON.stringify([
      "Achieve target band score",
      "Master each IELTS component",
      "Build test-taking confidence",
      "Receive detailed performance feedback",
    ]),
  },
  {
    title: "TOEIC Preparation",
    slug: "toeic-preparation",
    category: "exam",
    icon: "FileCheck",
    ageGroup: "Ages 18+",
    duration: "2 months",
    levels: "A2+ entry required",
    description:
      "Focused preparation for the TOEIC exam, targeting professionals who need certified English proficiency for career advancement, international assignments, or company requirements.",
    objectives: JSON.stringify([
      "Improve professional English scores",
      "Practice business English contexts",
      "Develop speed and accuracy",
      "Achieve certification goals",
    ]),
  },
  {
    title: "Arabic",
    slug: "arabic",
    category: "languages",
    icon: "Globe",
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "Beginner to Advanced",
    description:
      "Learn Modern Standard Arabic or Moroccan Darija through our communicative approach. Programs available for both native speakers seeking literacy and non-native speakers discovering the language.",
    objectives: JSON.stringify([
      "Develop reading and writing in Arabic",
      "Build conversational fluency",
      "Understand cultural contexts",
      "Achieve target proficiency level",
    ]),
  },
  {
    title: "French",
    slug: "french",
    category: "languages",
    icon: "Globe",
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "A1 to B2",
    description:
      "Master French for academic, professional, or personal goals. Our communicative approach ensures you develop practical speaking skills alongside grammar and vocabulary foundations.",
    objectives: JSON.stringify([
      "Achieve conversational fluency",
      "Master French grammar structures",
      "Prepare for DELF/DALF exams",
      "Develop cultural competence",
    ]),
  },
  {
    title: "Italian",
    slug: "italian",
    category: "languages",
    icon: "Globe",
    ageGroup: "All ages",
    duration: "3 months per level",
    levels: "A1 to B1",
    description:
      "Discover the beauty of Italian through engaging, communicative lessons. Perfect for travel, culture, or professional needs, our program makes learning Italian natural and enjoyable.",
    objectives: JSON.stringify([
      "Build practical Italian skills",
      "Develop listening comprehension",
      "Explore Italian culture and cuisine",
      "Achieve travel-ready fluency",
    ]),
  },
];

function inferCategory(program: Program): Category {
  if (program.category) {
    const cat = program.category.toLowerCase();
    if (cat === "english" || cat === "exam" || cat === "languages") return cat;
  }
  const title = program.title.toLowerCase();
  if (title.includes("toefl") || title.includes("ielts") || title.includes("toeic")) return "exam";
  if (title.includes("arabic") || title.includes("french") || title.includes("italian")) return "languages";
  return "english";
}

function getObjectives(objectives: string | string[]): string[] {
  if (Array.isArray(objectives)) return objectives;
  try {
    const parsed = JSON.parse(objectives);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return objectives ? objectives.split("\n").filter(Boolean) : [];
  }
}

function getColor(program: Program, index: number): string {
  const slug = program.slug || program.title.toLowerCase().replace(/\s+/g, "-");
  return colorMap[slug] || defaultColors[index % defaultColors.length];
}

function getIcon(program: Program): React.ComponentType<{ className?: string }> {
  if (program.icon && iconMap[program.icon]) return iconMap[program.icon];
  const category = inferCategory(program);
  if (category === "exam") return FileCheck;
  if (category === "languages") return Globe;
  return BookOpen;
}

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
  const color = getColor(program, index);
  const Icon = getIcon(program);
  const objectives = getObjectives(program.objectives);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
    >
      <motion.div
        className="group relative rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden h-full flex flex-col"
        whileHover={{
          y: -6,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`h-2 bg-gradient-to-r ${color}`} />

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy dark:text-white">{program.title}</h3>
              <p className="text-sm text-burgundy font-medium">
                {program.ageGroup}
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
            {program.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream dark:bg-slate-700 text-navy dark:text-gray-200 font-medium">
              <Clock className="w-3 h-3" />
              {program.duration}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream dark:bg-slate-700 text-navy dark:text-gray-200 font-medium">
              <BarChart3 className="w-3 h-3" />
              {program.levels}
            </span>
          </div>

          <div className="mb-5 flex-1">
            <h4 className="text-sm font-semibold text-navy dark:text-white mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Key Objectives
            </h4>
            <ul className="space-y-1.5">
              {objectives.map((obj) => (
                <li
                  key={obj}
                  className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2"
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPrograms(data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPrograms =
    activeCategory === "all"
      ? programs
      : programs.filter((p) => inferCategory(p) === activeCategory);

  return (
    <>
      <PageHero />

      <section className="py-16 lg:py-20 bg-white dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeCategory === cat.key
                      ? "gradient-burgundy text-white shadow-lg shadow-burgundy/20"
                      : "bg-cream dark:bg-slate-800 text-navy dark:text-gray-300 hover:bg-burgundy/10 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-cream dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  viewMode === "grid"
                    ? "gradient-burgundy text-white shadow-sm"
                    : "text-navy dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("compare")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  viewMode === "compare"
                    ? "gradient-burgundy text-white shadow-sm"
                    : "text-navy dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-700"
                }`}
              >
                <TableProperties className="w-4 h-4" />
                Compare
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key={`grid-${activeCategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPrograms.map((program, index) => (
                  <ProgramCard
                    key={program.id || program.title}
                    program={program}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`compare-${activeCategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ComparisonTable programs={filteredPrograms} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Compare Programs Section */}
      <section className="py-16 lg:py-20 bg-cream dark:bg-slate-800 relative overflow-hidden noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Compare Programs
            </motion.h2>
            <motion.p
              className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Not sure which program is right for you? Compare them side by side.
            </motion.p>
            <button
              onClick={() => setShowCompare((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-burgundy text-white font-semibold text-sm hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300"
            >
              <TableProperties className="w-4 h-4" />
              {showCompare ? "Hide" : "Show"} Comparison Table
              <motion.span
                animate={{ rotate: showCompare ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </div>

          <AnimatePresence>
            {showCompare && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <ComparisonTable programs={filteredPrograms} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

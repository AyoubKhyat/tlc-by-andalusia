"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageCircle,
  Mic,
  Users,
  ClipboardCheck,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Placement Test",
    description:
      "Every new student begins with a comprehensive placement test. This helps us assess your current level accurately and place you in the right group where you will be challenged but never overwhelmed. The test evaluates grammar, vocabulary, listening, and speaking abilities.",
    details: [
      "Written assessment covering grammar and vocabulary",
      "Listening comprehension evaluation",
      "One-on-one speaking interview",
      "Results available within 24 hours",
    ],
    color: "from-burgundy to-burgundy-light",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Communicative Approach",
    description:
      "Our teaching methodology is rooted in the communicative approach. This means lessons are built around real-life situations and meaningful interactions rather than mechanical drills. From day one, you are communicating in your target language.",
    details: [
      "Real-life conversation scenarios",
      "Task-based learning activities",
      "Minimal use of translation",
      "Language as a tool, not just a subject",
    ],
    color: "from-burgundy to-burgundy-light",
  },
  {
    number: "03",
    icon: Mic,
    title: "Speaking Confidence",
    description:
      "Speaking is at the heart of everything we do. Our classrooms are designed to be safe spaces where making mistakes is part of learning. Through pair work, group discussions, role-plays, and presentations, students develop the confidence to use language spontaneously.",
    details: [
      "Daily speaking practice in every class",
      "Regular presentations and debates",
      "Role-play and simulation activities",
      "Supportive error correction techniques",
    ],
    color: "from-navy to-[#2A3F6A]",
  },
  {
    number: "04",
    icon: Users,
    title: "Small Group Learning",
    description:
      "We intentionally keep our class sizes small. This ensures every student receives individual attention, has ample opportunity to speak, and benefits from personalized feedback. Small groups also create a closer, more supportive learning community.",
    details: [
      "Maximum 12-15 students per class",
      "Individual attention from teachers",
      "More speaking time per student",
      "Stronger peer relationships",
    ],
    color: "from-burgundy-dark to-burgundy",
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "We believe in measurable growth. Throughout your program, we track your progress through regular assessments, teacher observations, and participation records. You receive clear feedback on your strengths and areas for improvement at every stage.",
    details: [
      "Monthly progress assessments",
      "Detailed teacher feedback reports",
      "Skill-by-skill progress tracking",
      "Parent updates for younger learners",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    number: "06",
    icon: Award,
    title: "Final Exam & Certification",
    description:
      "Each level concludes with a comprehensive final exam that evaluates all language skills. Students who pass receive an official TLC certificate recognizing their achievement and CEFR level. These certificates are valued by schools and employers.",
    details: [
      "Comprehensive multi-skill examination",
      "Official TLC level certificate",
      "CEFR-aligned assessment criteria",
      "Detailed score breakdown provided",
    ],
    color: "from-burgundy-light to-burgundy",
  },
];

const principles = [
  {
    icon: Lightbulb,
    title: "Learn by Doing",
    description: "Students learn language by using it in meaningful, real-world contexts, not by memorizing rules in isolation.",
  },
  {
    icon: Zap,
    title: "Immersive Environment",
    description: "Our classrooms operate primarily in the target language, creating an immersive experience that accelerates acquisition.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description: "Every lesson has clear objectives aligned with internationally recognized proficiency standards (CEFR).",
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
            bottom: "-10%",
            right: "-5%",
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
          Our Methodology
        </motion.span>
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The <span className="text-white/90">Natural Way</span> to Learn
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover our proven communicative approach that puts speaking
          confidence and practical skills at the center of every lesson.
        </motion.p>
      </div>
    </section>
  );
}

function PrinciplesSection() {
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
            Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            The Foundation of{" "}
            <span className="text-gradient">Our Approach</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center bg-cream dark:bg-slate-800 rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl gradient-burgundy flex items-center justify-center mx-auto mb-5">
                <principle.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">
                {principle.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, index }: { step: typeof steps[number]; index: number }) {
  const stepRef = useRef(null);
  const stepInView = useInView(stepRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={stepRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={stepInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`flex flex-col lg:flex-row gap-8 items-start ${
        index % 2 === 1 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Number and icon */}
      <div className="flex-shrink-0 flex items-center gap-4 lg:w-48">
        <span className="text-5xl lg:text-6xl font-bold text-burgundy/10">
          {step.number}
        </span>
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
        >
          <step.icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl p-6 lg:p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
          {step.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          {step.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {step.details.map((detail) => (
            <div
              key={detail}
              className="flex items-start gap-2 text-sm"
            >
              <CheckCircle className="w-4 h-4 text-burgundy mt-0.5 flex-shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StepsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-cream dark:bg-slate-800 relative overflow-hidden noise-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-burgundy bg-burgundy/10 mb-4">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            From Placement to{" "}
            <span className="text-gradient">Certification</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Every student follows a structured path designed to maximize
            learning outcomes and build lasting confidence.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepItem key={step.number} step={step} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-burgundy text-white font-semibold text-lg hover:shadow-lg hover:shadow-burgundy/30 transition-all duration-300 hover:scale-105"
          >
            Start Your Journey Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function LearningApproachPage() {
  return (
    <>
      <PageHero />
      <PrinciplesSection />
      <StepsSection />
    </>
  );
}

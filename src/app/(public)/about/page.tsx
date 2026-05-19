"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageCircle,
  Shield,
  Globe,
  Sparkles,
  Heart,
  Target,
  Eye,
  BookOpen,
} from "lucide-react";

const values = [
  {
    icon: MessageCircle,
    title: "Communication",
    description:
      "We believe language is meant to be spoken. Every lesson prioritizes real conversation and practical communication skills over rote memorization.",
    color: "from-burgundy to-burgundy-light",
  },
  {
    icon: Shield,
    title: "Confidence",
    description:
      "Our supportive, encouraging environment empowers students to take risks, make mistakes, and grow. Confidence in speaking is the cornerstone of fluency.",
    color: "from-burgundy to-burgundy-light",
  },
  {
    icon: Globe,
    title: "Culture",
    description:
      "Language and culture are inseparable. We integrate cultural awareness into our programs, helping students understand the world behind the words.",
    color: "from-navy to-[#2A3F6A]",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description:
      "From our teaching methods to our materials, we pursue the highest standards in every aspect of the learning experience.",
    color: "from-burgundy-dark to-burgundy",
  },
];

const timeline = [
  {
    year: "Foundation",
    title: "Andalusia Academy is Born",
    description:
      "What started as a vision to bring high-quality language education to Marrakech became a reality. Andalusia Academy opened its doors with a commitment to the communicative approach.",
  },
  {
    year: "Growth",
    title: "TLC Takes Shape",
    description:
      "As our community grew, so did our ambition. The Language Center (TLC) was established as the flagship program of Andalusia Academy, offering structured courses for all ages and levels.",
  },
  {
    year: "Expansion",
    title: "Programs for Every Learner",
    description:
      "We expanded from English-only into Arabic, French, and Italian. Our exam preparation programs for TOEFL, IELTS, and TOEIC were introduced with remarkable success rates.",
  },
  {
    year: "Today",
    title: "A Thriving Community",
    description:
      "Today, TLC serves over 500 students across 15+ programs. Our dedicated team continues to innovate and inspire, making language learning a joyful and transformative experience.",
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
          About Us
        </motion.span>
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Our Story, Our <span className="text-white/90">Passion</span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          TLC by Andalusia Academy is more than a language center &mdash; it is a
          community where every learner finds their voice.
        </motion.p>
      </div>
    </section>
  );
}

function MissionVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-cream dark:bg-slate-800 rounded-3xl p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-burgundy/5 rounded-bl-3xl" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-burgundy flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To provide accessible, high-quality language education that
              empowers individuals of all ages and backgrounds to communicate
              confidently and effectively in a globalized world. We achieve this
              through innovative communicative methods, small-group instruction,
              and a nurturing learning environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-cream dark:bg-slate-800 rounded-3xl p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-burgundy/10 rounded-bl-3xl" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-burgundy flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To become the leading language academy in Morocco, recognized for
              excellence in teaching, innovation in methodology, and the
              transformative impact we have on our students&#39; personal and
              professional lives. We envision a community where language is a
              bridge, not a barrier.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OurStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Our Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            The Story of <span className="text-gradient">TLC</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            From a single classroom to a thriving academy, our journey is one
            of passion, growth, and unwavering commitment to our students.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-burgundy/20" />

          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row gap-6 mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full gradient-burgundy border-4 border-cream dark:border-slate-800 z-10 mt-2" />

              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-burgundy bg-burgundy/10 mb-2">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
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
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            What We <span className="text-gradient">Stand For</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <motion.div
                className="bg-cream dark:bg-slate-800 rounded-2xl p-6 h-full text-center border border-transparent hover:border-burgundy/10"
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(122, 31, 62, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-5`}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            Meet the <span className="text-gradient">People Behind TLC</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Our dedicated team of educators and staff are the heart of TLC.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-full gradient-burgundy mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">SY</span>
            </div>
            <h3 className="text-xl font-bold text-navy dark:text-white mb-1">Sabik Youness</h3>
            <p className="text-burgundy font-medium mb-3">English Teacher</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              A passionate and experienced English language educator dedicated
              to helping students unlock their communication potential through
              engaging, student-centered lessons.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-full gradient-burgundy mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-navy dark:text-white mb-1">
              Teaching Staff
            </h3>
            <p className="text-burgundy font-medium mb-3">Language Educators</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Our team of certified language professionals brings expertise in
              English, Arabic, French, and Italian, each committed to
              communicative excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-navy to-[#2A3F6A] mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-navy dark:text-white mb-1">
              Support Team
            </h3>
            <p className="text-burgundy font-medium mb-3">
              Administration &amp; Support
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Our friendly administrative team ensures smooth enrollment,
              scheduling, and communication so that students and parents
              always feel welcome and supported.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <MissionVision />
      <OurStory />
      <ValuesSection />
      <TeamSection />
    </>
  );
}

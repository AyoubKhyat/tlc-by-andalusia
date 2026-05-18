"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Users, BookOpen, Award } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert Teachers",
    description:
      "Our qualified and passionate instructors bring years of experience in communicative language teaching, ensuring every lesson is dynamic and effective.",
    color: "from-burgundy to-burgundy-light",
  },
  {
    icon: Users,
    title: "Small Groups",
    description:
      "We maintain small class sizes to guarantee personalized attention and maximum speaking opportunities for every student.",
    color: "from-burgundy to-burgundy-light",
  },
  {
    icon: BookOpen,
    title: "Modern Methods",
    description:
      "Our curriculum blends the communicative approach with immersive activities, interactive media, and real-world practice scenarios.",
    color: "from-navy to-[#2A3F6A]",
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "With a 95% success rate across our programs, students consistently achieve their language goals and gain lasting confidence.",
    color: "from-burgundy to-burgundy-dark",
  },
];

export default function WhyChooseTLC() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-navy noise-overlay moroccan-pattern overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white/80 bg-white/10 border border-white/20 mb-4">
            Why TLC
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="text-burgundy-light">TLC by Andalusia Academy</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We combine expert teaching with a nurturing environment to help
            every learner thrive and achieve fluency naturally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full cursor-default"
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

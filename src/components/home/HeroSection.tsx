"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const heroSlides = [
  { gradient: "linear-gradient(135deg, #1B2A4A 0%, #7A1F3E 50%, #5A1530 100%)" },
  { gradient: "linear-gradient(135deg, #5A1530 0%, #9B2D50 40%, #1B2A4A 100%)" },
  { gradient: "linear-gradient(135deg, #1B2A4A 0%, #2A3F6A 50%, #7A1F3E 100%)" },
];

const SLIDE_DURATION = 8000;

const floatingLetters = [
  { char: "A", x: "10%", y: "20%", size: "text-6xl", delay: 0 },
  { char: "B", x: "85%", y: "15%", size: "text-5xl", delay: 0.5 },
  { char: "C", x: "75%", y: "70%", size: "text-4xl", delay: 1 },
  { char: "あ", x: "15%", y: "75%", size: "text-5xl", delay: 1.5 },
  { char: "ع", x: "90%", y: "45%", size: "text-6xl", delay: 0.8 },
  { char: "é", x: "5%", y: "50%", size: "text-4xl", delay: 1.2 },
  { char: "Z", x: "50%", y: "10%", size: "text-3xl", delay: 0.3 },
  { char: "世", x: "70%", y: "30%", size: "text-4xl", delay: 1.8 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Decorative Islamic geometric SVG */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
        <svg
          className="absolute w-[800px] h-[800px] opacity-5 -top-40 -right-40"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <g stroke="white" strokeWidth="0.5">
            <polygon points="200,20 220,80 280,40 250,100 320,90 270,140 340,160 270,170 310,230 250,200 260,270 200,220 140,270 150,200 90,230 130,170 60,160 130,140 80,90 150,100 120,40 180,80" />
            <polygon points="200,80 230,140 290,120 250,170 310,200 250,210 270,270 220,230 200,290 180,230 130,270 150,210 90,200 150,170 110,120 170,140" />
            <polygon points="200,120 240,150 260,200 240,250 200,270 160,250 140,200 160,150" />
            <circle cx="200" cy="200" r="40" />
            <circle cx="200" cy="200" r="20" />
            <line x1="200" y1="20" x2="200" y2="120" />
            <line x1="200" y1="270" x2="200" y2="380" />
            <line x1="20" y1="200" x2="140" y2="200" />
            <line x1="260" y1="200" x2="380" y2="200" />
            <line x1="60" y1="60" x2="155" y2="155" />
            <line x1="245" y1="245" x2="340" y2="340" />
            <line x1="340" y1="60" x2="245" y2="155" />
            <line x1="155" y1="245" x2="60" y2="340" />
          </g>
        </svg>
        <svg
          className="absolute w-[600px] h-[600px] opacity-[0.04] -bottom-32 -left-32"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <g stroke="white" strokeWidth="0.5">
            <polygon points="200,20 220,80 280,40 250,100 320,90 270,140 340,160 270,170 310,230 250,200 260,270 200,220 140,270 150,200 90,230 130,170 60,160 130,140 80,90 150,100 120,40 180,80" />
            <polygon points="200,80 230,140 290,120 250,170 310,200 250,210 270,270 220,230 200,290 180,230 130,270 150,210 90,200 150,170 110,120 170,140" />
            <circle cx="200" cy="200" r="50" />
            <circle cx="200" cy="200" r="25" />
          </g>
        </svg>
      </div>

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/academy-building.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay slideshow */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{
              background: slide.gradient,
              opacity: currentSlide === index ? 0.82 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
            top: "-10%",
            right: "-10%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(122,31,62,0.5) 0%, transparent 70%)",
            bottom: "-5%",
            left: "-5%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating language letters */}
      {floatingLetters.map((letter, i) => (
        <motion.span
          key={i}
          className={`absolute z-[3] ${letter.size} font-bold text-white/10 select-none pointer-events-none`}
          style={{ left: letter.x, top: letter.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.15, 0.08, 0.15],
            scale: [0.8, 1, 0.9, 1],
            y: [0, -20, 10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: letter.delay,
            ease: "easeInOut",
          }}
        >
          {letter.char}
        </motion.span>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: currentSlide === index ? 48 : 20 }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full" />
            {currentSlide === index && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                key={`progress-${index}-${currentSlide}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30 bg-white/10 backdrop-blur-sm">
            TLC by Andalusia Academy
          </span>
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Master Languages,{" "}
          <span className="text-white/90">
            The Natural Way
          </span>
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          At TLC by Andalusia Academy, we empower learners of all ages to
          communicate with confidence through immersive, communicative language
          programs in the heart of Marrakech.
        </motion.p>

        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/programs"
            className="px-8 py-4 rounded-full bg-white text-burgundy font-semibold text-lg hover:bg-white/90 hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
          >
            Discover Programs
          </Link>
          <Link
            href="/results"
            className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:border-white/60 w-full sm:w-auto text-center backdrop-blur-sm"
          >
            Check Exam Results
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:border-white/60 w-full sm:w-auto text-center backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 bg-white/50 rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Z.",
    role: "Adult Student - Level B2",
    content:
      "TLC completely transformed my English. In just six months, I went from barely constructing sentences to confidently holding conversations. The teachers create such a supportive environment that you forget to be nervous. I now use English daily at my job and feel truly empowered.",
    rating: 5,
  },
  {
    name: "Karim A.",
    role: "Parent of Junior Student",
    content:
      "My son has been attending TLC for two years, and the progress is remarkable. He speaks English naturally, without hesitation. The small class sizes mean he gets real attention, and he actually looks forward to his lessons every week. We could not be happier with our choice.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "IELTS Prep Student",
    content:
      "I needed a 7.0 on IELTS for my university application and scored 7.5 after just three months of preparation at TLC. The exam strategies, mock tests, and personalized feedback were exactly what I needed. The teachers really know the test inside and out.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-cream relative overflow-hidden noise-overlay moroccan-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-burgundy bg-burgundy/10 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            What Our <span className="text-gradient">Students Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from real students and parents who have experienced the TLC
            difference firsthand.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-8 sm:p-12 min-h-[320px] flex flex-col justify-center">
            {/* Quote icon */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-burgundy/10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-burgundy text-burgundy"
                      />
                    )
                  )}
                </div>

                {/* Content */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  &quot;{testimonials[current].content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-burgundy flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-navy">
                      {testimonials[current].name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonials[current].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-burgundy/20 flex items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-burgundy w-8"
                      : "bg-burgundy/20 hover:bg-burgundy/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-burgundy/20 flex items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

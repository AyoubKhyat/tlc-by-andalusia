"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id?: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image?: string | null;
}

const fallbackTestimonials: Testimonial[] = [
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
  {
    name: "Omar B.",
    role: "Business English Student",
    content:
      "The Business English programme at TLC gave me the confidence to present in English at international conferences. The practical approach, focusing on real scenarios I face at work, made all the difference. My colleagues noticed the improvement immediately.",
    rating: 5,
  },
  {
    name: "Amina L.",
    role: "Parent of Two Students",
    content:
      "Both of my children attend TLC and they absolutely love it. The way the teachers make learning fun while maintaining high standards is impressive. My daughter even started reading English books on her own. That says everything about the quality of teaching here.",
    rating: 5,
  },
  {
    name: "Youssef R.",
    role: "University Student",
    content:
      "I joined TLC to improve my academic English before starting my master's programme abroad. The structured curriculum and supportive teachers helped me develop strong writing and critical thinking skills. I felt fully prepared when I arrived at university.",
    rating: 5,
  },
];

/** Returns how many cards to show based on container width */
function useVisibleCount(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 768) setCount(2);
      else setCount(1);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return count;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-8 flex flex-col justify-between h-full">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-burgundy/10" />

      <div>
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-burgundy text-burgundy" />
          ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 italic line-clamp-6">
          &quot;{testimonial.content}&quot;
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full gradient-burgundy flex items-center justify-center text-white font-bold text-lg shrink-0">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-bold text-navy dark:text-white truncate">
            {testimonial.name}
          </div>
          {testimonial.role && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {testimonial.role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);

  const visibleCount = useVisibleCount(containerRef);

  // Total number of pages
  const totalPages = Math.max(1, Math.ceil(testimonials.length / visibleCount));

  // Clamp page when visibleCount or testimonials change
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages - 1));
  }, [totalPages]);

  // Fetch testimonials from API
  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
          setPage(0);
        }
      })
      .catch(() => {});
  }, []);

  const goToPage = useCallback(
    (newPage: number, dir?: number) => {
      setDirection(dir ?? (newPage > page ? 1 : -1));
      setPage(newPage);
    },
    [page]
  );

  const next = useCallback(() => {
    const nextPage = (page + 1) % totalPages;
    goToPage(nextPage, 1);
  }, [page, totalPages, goToPage]);

  const prev = useCallback(() => {
    const prevPage = (page - 1 + totalPages) % totalPages;
    goToPage(prevPage, -1);
  }, [page, totalPages, goToPage]);

  // Auto-play every 5 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  // Get the testimonials visible on the current page
  const startIdx = page * visibleCount;
  const visibleTestimonials = testimonials.slice(
    startIdx,
    startIdx + visibleCount
  );

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Touch / swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) {
      next();
    } else if (diff < -threshold) {
      prev();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-cream dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark"
    >
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
          <h2 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
            What Our <span className="text-gradient">Students Say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Hear from real students and parents who have experienced the TLC
            difference firsthand.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-burgundy/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors duration-300 shadow-lg"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-burgundy/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors duration-300 shadow-lg"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel track */}
          <div className="overflow-hidden px-6 sm:px-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                }}
              >
                {visibleTestimonials.map((testimonial, i) => (
                  <TestimonialCard
                    key={`${page}-${i}`}
                    testimonial={testimonial}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === page
                    ? "bg-burgundy w-8"
                    : "bg-burgundy/20 hover:bg-burgundy/40 w-3"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

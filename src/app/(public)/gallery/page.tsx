"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type GalleryCategory = "all" | "classes" | "events" | "campus" | "activities";

interface GalleryItem {
  id: string | number;
  url: string;
  caption: string;
  category: GalleryCategory;
  span?: string;
}

const categoryTabs: { key: GalleryCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "classes", label: "Classes" },
  { key: "events", label: "Events" },
  { key: "campus", label: "Campus" },
  { key: "activities", label: "Activities" },
];

const fallbackGallery: GalleryItem[] = [
  {
    id: 1,
    url: "/images/gallery/academy-class-1.jpg",
    caption: "Interactive English Class",
    category: "classes",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    url: "/images/gallery/academy-class-2.jpg",
    caption: "Students in Action",
    category: "classes",
  },
  {
    id: 3,
    url: "/images/gallery/academy-building.jpg",
    caption: "Andalusia Academy Building",
    category: "campus",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: 4,
    url: "/images/gallery/academy-class-3.jpg",
    caption: "Group Learning Session",
    category: "classes",
  },
  {
    id: 5,
    url: "/images/gallery/academy-event-1.jpg",
    caption: "Student Gathering",
    category: "events",
  },
  {
    id: 6,
    url: "/images/gallery/academy-classroom.jpg",
    caption: "Modern Classrooms",
    category: "campus",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 7,
    url: "/images/gallery/academy-class-4.jpg",
    caption: "Presentation Practice",
    category: "classes",
  },
  {
    id: 8,
    url: "/images/gallery/academy-overview.jpg",
    caption: "Academy Campus Overview",
    category: "campus",
  },
  {
    id: 9,
    url: "/images/gallery/academy-event-2.jpeg",
    caption: "Academy Event",
    category: "events",
  },
  {
    id: 10,
    url: "/images/gallery/academy-lab.jpg",
    caption: "Learning Lab",
    category: "campus",
  },
  {
    id: 11,
    url: "/images/gallery/academy-gardening.jpeg",
    caption: "Gardening Activity",
    category: "activities",
  },
  {
    id: 12,
    url: "/images/gallery/academy-workshop.jpg",
    caption: "Workshop & Art Room",
    category: "activities",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: 13,
    url: "/images/gallery/academy-class-5.jpg",
    caption: "Language Practice",
    category: "classes",
  },
  {
    id: 14,
    url: "/images/gallery/academy-event-3.jpeg",
    caption: "Student Achievement Day",
    category: "events",
  },
  {
    id: 15,
    url: "/images/gallery/academy-cafeteria.jpg",
    caption: "Student Cafeteria",
    category: "campus",
  },
  {
    id: 16,
    url: "/images/gallery/academy-sports.jpg",
    caption: "Sports Facilities",
    category: "activities",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: 17,
    url: "/images/gallery/academy-activities-1.jpeg",
    caption: "Student Activities",
    category: "activities",
  },
  {
    id: 18,
    url: "/images/gallery/academy-activities-2.jpg",
    caption: "Creative Sessions",
    category: "activities",
  },
  {
    id: 19,
    url: "/images/gallery/academy-campus.jpg",
    caption: "Campus Life",
    category: "campus",
  },
  {
    id: 20,
    url: "/images/gallery/academy-about.jpg",
    caption: "Our Academy",
    category: "campus",
  },
];

function mapApiCategory(category: string | null): GalleryCategory {
  if (!category) return "campus";
  const cat = category.toLowerCase();
  if (cat === "classes" || cat === "events" || cat === "campus" || cat === "activities") {
    return cat;
  }
  return "campus";
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGallery(
            data.map((item: { id: string; url: string; caption: string | null; category: string | null }, i: number) => ({
              id: item.id,
              url: item.url,
              caption: item.caption || "Gallery Image",
              category: mapApiCategory(item.category),
              span: i === 0 ? "col-span-1 row-span-1 md:col-span-2 md:row-span-2" : undefined,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
              bottom: "-10%",
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
            Gallery
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Life at <span className="text-white/90">TLC</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore moments from our classrooms, events, and community life.
          </motion.p>
        </div>
      </section>

      <section ref={ref} className="py-16 lg:py-24 bg-white dark:bg-slate-900 relative overflow-hidden noise-overlay moroccan-pattern-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === tab.key
                    ? "gradient-burgundy text-white shadow-lg shadow-burgundy/20"
                    : "bg-cream dark:bg-slate-800 text-navy dark:text-white hover:bg-burgundy/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[200px]"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`${item.span || ""} relative rounded-2xl overflow-hidden group cursor-pointer`}
                >
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-semibold text-sm text-center px-4 drop-shadow-lg">
                      {item.caption}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

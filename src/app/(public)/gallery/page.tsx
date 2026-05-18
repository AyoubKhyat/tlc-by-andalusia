"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";

type GalleryCategory = "all" | "classes" | "events" | "campus" | "activities";

interface GalleryItem {
  id: number;
  image: string;
  label: string;
  category: GalleryCategory;
  span: string;
}

const categoryTabs: { key: GalleryCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "classes", label: "Classes" },
  { key: "events", label: "Events" },
  { key: "campus", label: "Campus" },
  { key: "activities", label: "Activities" },
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937571?w=800&h=800&fit=crop",
    label: "Interactive English Class",
    category: "classes",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop",
    label: "Certificate Ceremony",
    category: "events",
    span: "",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
    label: "Study Hall",
    category: "campus",
    span: "",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    label: "Kids Workshop",
    category: "activities",
    span: "",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    label: "Group Discussion",
    category: "classes",
    span: "",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    label: "Open Day Event",
    category: "events",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    label: "Reading Corner",
    category: "campus",
    span: "",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop",
    label: "Language Games",
    category: "activities",
    span: "",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop",
    label: "Presentation Day",
    category: "classes",
    span: "",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
    label: "Cultural Festival",
    category: "events",
    span: "",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=400&fit=crop",
    label: "Outdoor Activity",
    category: "activities",
    span: "",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
    label: "Welcome Lounge",
    category: "campus",
    span: "",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
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

      {/* Gallery */}
      <section ref={ref} className="py-16 lg:py-24 bg-white relative overflow-hidden noise-overlay moroccan-pattern-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Category filter */}
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
                    : "bg-cream text-navy hover:bg-burgundy/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
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
                  className={`${item.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-semibold text-sm text-center px-4 drop-shadow-lg">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Admin note */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-gray-500 text-sm">
              <Info className="w-4 h-4" />
              <span>Gallery images are managed by the admin team.</span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

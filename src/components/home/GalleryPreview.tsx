"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const galleryItems = [
  {
    label: "Classroom Sessions",
    span: "col-span-2 row-span-2",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937571?w=800&h=800&fit=crop",
  },
  {
    label: "Student Activities",
    span: "",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop",
  },
  {
    label: "Cultural Events",
    span: "",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  },
  {
    label: "Graduation Day",
    span: "",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop",
  },
  {
    label: "Group Projects",
    span: "",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  },
];

export default function GalleryPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white relative overflow-hidden noise-overlay moroccan-pattern-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-burgundy bg-burgundy/10 mb-4">
            Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Life at <span className="text-gradient">TLC</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A glimpse into our vibrant learning environment, student activities,
            and community events.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${item.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-semibold text-sm text-center px-2 drop-shadow-lg">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-burgundy text-burgundy font-semibold text-lg hover:bg-burgundy hover:text-white transition-all duration-300"
          >
            View Full Gallery
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

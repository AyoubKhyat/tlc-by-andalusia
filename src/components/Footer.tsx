"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Learning Approach", href: "/approach" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const programLinks = [
  { name: "Kids (7-9)", href: "/programs#kids" },
  { name: "Juniors (10-14)", href: "/programs#juniors" },
  { name: "Teens", href: "/programs#teens" },
  { name: "Adults", href: "/programs#adults" },
  { name: "TOEFL / IELTS / TOEIC", href: "/programs#exam-prep" },
  { name: "Italian & French", href: "/programs#languages" },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/profile.php?id=61572399914166",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/tlc_by_andalusia/",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://wa.me/212643434382",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    href: "https://www.tiktok.com/@tlc_by_andalusia",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy text-white overflow-hidden noise-overlay moroccan-pattern">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-burgundy via-burgundy-light to-burgundy" />

      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-burgundy/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-burgundy-light/5 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      >
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/logo.png"
                alt="The Language Center by Andalusia Academy"
                width={200}
                height={56}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-xs">
              English, The Natural Way. Empowering learners of all ages with
              immersive language education in Marrakech.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-burgundy hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-burgundy-light mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white hover:pl-1 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-burgundy-light mb-6">
              Our Programs
            </h4>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white hover:pl-1 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-burgundy-light mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-burgundy-light shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">
                  Rue Prestige Targa 1,
                  <br />
                  Marrakech, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-burgundy-light shrink-0" />
                <a
                  href="tel:+212643434382"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  0643 43 43 82
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineMail className="w-5 h-5 text-burgundy-light shrink-0" />
                <a
                  href="mailto:contact@tlc-marrakech.com"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  contact@tlc-marrakech.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold tracking-widest uppercase text-burgundy-light mb-3">
                Newsletter
              </h4>
              <p className="text-xs text-white/50 mb-3">
                Stay updated with our latest programs and events.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgundy-light/50 focus:bg-white/10 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-burgundy hover:bg-burgundy-light text-white rounded-lg transition-colors duration-300"
                >
                  Join
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {currentYear} The Language Center by Andalusia Academy. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

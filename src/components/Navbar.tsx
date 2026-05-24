"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { Search, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import SearchModal from "@/components/SearchModal";

const primaryLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.programs", href: "/programs" },
  { key: "nav.results", href: "/results" },
  { key: "nav.events", href: "/events" },
  { key: "nav.booking", href: "/booking" },
  { key: "nav.contact", href: "/contact" },
];

const moreLinks = [
  { key: "nav.approach", href: "/learning-approach" },
  { key: "nav.gallery", href: "/gallery" },
  { key: "nav.blog", href: "/blog" },
  { key: "nav.faq", href: "/faq" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();
  const isMoreActive = moreLinks.some((l) => pathname === l.href);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-lg shadow-burgundy/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative"
            >
              <Image
                src="/images/logo.png"
                alt="The Language Center by Andalusia Academy"
                width={220}
                height={60}
                priority
                className={`h-14 w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "" : "brightness-0 invert"
                }`}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="relative px-2.5 py-2 text-sm font-medium transition-colors duration-300 group"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive
                        ? isScrolled
                          ? "text-burgundy"
                          : "text-white"
                        : isScrolled
                          ? "text-navy/70 dark:text-gray-300 group-hover:text-burgundy"
                          : "text-white/80 group-hover:text-white"
                    }`}
                  >
                    {t(link.key)}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full ${
                        isScrolled ? "bg-burgundy" : "bg-white"
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`relative flex items-center gap-0.5 px-2.5 py-2 text-sm font-medium transition-colors duration-300 group ${
                  isMoreActive
                    ? isScrolled ? "text-burgundy" : "text-white"
                    : isScrolled
                      ? "text-navy/70 dark:text-gray-300 hover:text-burgundy"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {t("nav.more") || "More"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                {isMoreActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full ${isScrolled ? "bg-burgundy" : "bg-white"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden py-1"
                  >
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.key}
                          href={link.href}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "text-burgundy bg-burgundy/5"
                              : "text-gray-700 dark:text-gray-300 hover:text-burgundy hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {t(link.key)}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search, Theme Toggle & Language Selector */}
            <button
              onClick={openSearch}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle isScrolled={isScrolled} />
            <LanguageSelector isScrolled={isScrolled} />

            {/* CTA Button */}
            <Link href="/contact#enroll">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-3 px-5 py-2.5 bg-burgundy-light text-white text-sm font-semibold rounded-full shadow-lg shadow-burgundy/25 hover:bg-burgundy hover:shadow-burgundy/40 transition-all duration-300"
              >
                {t("nav.enrollNow")}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`lg:hidden relative z-50 p-2 rounded-lg transition-colors duration-300 ${
              isMobileOpen
                ? "text-white"
                : isScrolled
                  ? "text-navy"
                  : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiX className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineMenuAlt3 className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-navy/95 backdrop-blur-xl lg:hidden noise-overlay"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                {/* Mobile Nav Links */}
                <div className="flex-1 space-y-1">
                  {allLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.key}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                            isActive
                              ? "bg-burgundy/20 text-white border-l-2 border-white/30"
                              : "text-white/80 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {t(link.key)}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Language Selector & CTA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-6 border-t border-white/10"
                >
                  <div className="flex justify-center gap-3 mb-4">
                    <button
                      onClick={() => { setIsMobileOpen(false); openSearch(); }}
                      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    <ThemeToggle isScrolled={false} />
                    <LanguageSelector isScrolled={false} />
                  </div>
                  <Link
                    href="/contact#enroll"
                    className="block w-full py-3 text-center bg-burgundy-light text-white font-semibold rounded-xl shadow-lg shadow-burgundy/25 hover:bg-burgundy transition-all duration-300"
                  >
                    {t("nav.enrollNow")}
                  </Link>
                  <p className="mt-4 text-center text-white/40 text-xs tracking-widest uppercase">
                    by Andalusia Academy
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
    </motion.header>
  );
}

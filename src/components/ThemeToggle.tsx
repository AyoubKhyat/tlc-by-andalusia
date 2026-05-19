"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle({ isScrolled }: { isScrolled: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        isScrolled
          ? "text-navy/70 hover:text-burgundy hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("tlc-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("tlc-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("tlc-cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-5 relative">
            <button
              onClick={decline}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-burgundy" />
              </div>
              <div>
                <h3 className="font-semibold text-navy dark:text-white text-sm">
                  We use cookies
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  We use essential cookies to make our site work and optional
                  cookies to improve your experience.{" "}
                  <Link
                    href="/privacy"
                    className="text-burgundy hover:underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg gradient-burgundy text-white hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

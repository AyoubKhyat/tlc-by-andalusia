"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Command } from "lucide-react";

const shortcuts = [
  {
    keys: ["Ctrl", "K"],
    macKeys: ["⌘", "K"],
    description: "Focus global search",
  },
  {
    keys: ["Escape"],
    macKeys: ["Esc"],
    description: "Close any open modal",
  },
  {
    keys: ["Ctrl", "/"],
    macKeys: ["⌘", "/"],
    description: "Open this shortcuts help",
  },
];

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+K / Cmd+K — focus search
      if (modifier && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      // Ctrl+/ / Cmd+/ — toggle shortcuts help
      if (modifier && e.key === "/") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Escape — close modals or help overlay
      if (e.key === "Escape") {
        if (showHelp) {
          setShowHelp(false);
          return;
        }
        window.dispatchEvent(new CustomEvent("closeModal"));
      }
    },
    [isMac, showHelp]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowHelp(false);
          }}
        >
          <motion.div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Shortcuts table */}
            <div className="px-6 py-4">
              <table className="w-full">
                <tbody>
                  {shortcuts.map((shortcut, i) => (
                    <tr
                      key={i}
                      className={
                        i < shortcuts.length - 1
                          ? "border-b border-gray-100 dark:border-slate-700"
                          : ""
                      }
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          {(isMac
                            ? Array.isArray(shortcut.macKeys)
                              ? shortcut.macKeys
                              : shortcut.keys
                            : shortcut.keys
                          ).map((key, j, arr) => (
                            <span key={j} className="flex items-center gap-1">
                              <kbd className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm">
                                {key === "⌘" ? (
                                  <Command className="w-3 h-3" />
                                ) : (
                                  key
                                )}
                              </kbd>
                              {j < arr.length - 1 && (
                                <span className="text-gray-400 text-xs">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                        {shortcut.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-xl">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, HelpCircle, Newspaper, ArrowRight } from "lucide-react";

interface SearchResult {
  type: "program" | "faq" | "blog";
  title: string;
  description: string;
  href: string;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  program: BookOpen,
  faq: HelpCircle,
  blog: Newspaper,
};

const typeLabels: Record<string, string> = {
  program: "Program",
  faq: "FAQ",
  blog: "Blog",
};

const typeColors: Record<string, string> = {
  program: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  faq: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  blog: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const staticPages = [
  { title: "Home", href: "/", keywords: ["home", "main", "landing"] },
  { title: "About Us", href: "/about", keywords: ["about", "story", "team", "mission"] },
  { title: "Programs", href: "/programs", keywords: ["programs", "courses", "classes"] },
  { title: "Learning Approach", href: "/learning-approach", keywords: ["approach", "method", "communicative"] },
  { title: "Gallery", href: "/gallery", keywords: ["gallery", "photos", "images"] },
  { title: "FAQ", href: "/faq", keywords: ["faq", "questions", "help"] },
  { title: "Blog", href: "/blog", keywords: ["blog", "news", "articles"] },
  { title: "Contact", href: "/contact", keywords: ["contact", "register", "enroll", "phone", "email"] },
  { title: "Exam Results", href: "/results", keywords: ["results", "exam", "scores", "grades"] },
];

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const searchAPI = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSelectedIndex(0);
      }
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchAPI(query), 250);
    return () => clearTimeout(timer);
  }, [query, searchAPI]);

  const allResults = [
    ...results,
    ...staticPages
      .filter((page) => {
        if (query.length < 2) return false;
        const q = query.toLowerCase();
        return (
          page.title.toLowerCase().includes(q) ||
          page.keywords.some((k) => k.includes(q))
        );
      })
      .filter((page) => !results.some((r) => r.href === page.href))
      .map((page) => ({
        type: "page" as const,
        title: page.title,
        description: "Page",
        href: page.href,
      })),
  ];

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      navigate(allResults[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[101]"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search programs, FAQ, blog..."
                  className="flex-1 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-slate-700 rounded">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {loading && query.length >= 2 && (
                  <div className="px-5 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-burgundy rounded-full animate-spin mx-auto" />
                  </div>
                )}

                {!loading && query.length >= 2 && allResults.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No results for &quot;{query}&quot;
                    </p>
                  </div>
                )}

                {!loading && allResults.length > 0 && (
                  <div className="py-2">
                    {allResults.map((result, i) => {
                      const Icon = typeIcons[result.type] || Search;
                      return (
                        <button
                          key={`${result.type}-${result.href}-${i}`}
                          onClick={() => navigate(result.href)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-colors ${
                            i === selectedIndex
                              ? "bg-burgundy/5 dark:bg-slate-700"
                              : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg ${typeColors[result.type] || "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {result.title}
                              </span>
                              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 shrink-0">
                                {typeLabels[result.type] || "Page"}
                              </span>
                            </div>
                            {result.description !== "Page" && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className={`w-4 h-4 mt-1 shrink-0 transition-opacity ${
                            i === selectedIndex ? "text-burgundy opacity-100" : "opacity-0"
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                )}

                {query.length < 2 && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Type at least 2 characters to search
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-burgundy flex items-center justify-center mx-auto mb-6 shadow-lg shadow-burgundy/20">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-navy dark:text-white mb-3">
          Something Went Wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full gradient-burgundy text-white font-semibold hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-full border-2 border-burgundy/30 text-burgundy font-semibold hover:bg-burgundy/5 transition-all duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

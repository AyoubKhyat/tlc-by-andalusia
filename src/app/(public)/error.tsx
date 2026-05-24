"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function PublicError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <span className="text-[10rem] font-bold text-burgundy/10 leading-none select-none">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl gradient-burgundy flex items-center justify-center shadow-lg shadow-burgundy/20">
              <AlertTriangle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-navy dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          We&apos;re sorry, an unexpected error occurred. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              unstable_retry();
            }}
            className="px-6 py-3 rounded-full gradient-burgundy text-white font-semibold hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border-2 border-burgundy/30 text-burgundy dark:text-burgundy/80 font-semibold hover:bg-burgundy/5 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

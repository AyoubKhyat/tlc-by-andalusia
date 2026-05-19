import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <span className="text-[10rem] font-bold text-burgundy/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl gradient-burgundy flex items-center justify-center shadow-lg shadow-burgundy/20">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-navy dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full gradient-burgundy text-white font-semibold hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/programs"
            className="px-6 py-3 rounded-full border-2 border-burgundy/30 text-burgundy font-semibold hover:bg-burgundy/5 transition-all duration-300"
          >
            View Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

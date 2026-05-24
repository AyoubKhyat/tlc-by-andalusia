"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't render breadcrumbs on the dashboard root
  if (pathname === "/admin" || pathname === "/admin/") {
    return null;
  }

  // Remove /admin prefix and split into segments
  const segments = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        {/* Dashboard (Home) link */}
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Dynamic segments */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/admin/" + segments.slice(0, index + 1).join("/");

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              {isLast ? (
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

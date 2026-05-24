"use client";

import { useRouter } from "next/navigation";
import {
  UserPlus,
  CalendarPlus,
  ClipboardPlus,
  Receipt,
  FileText,
  Download,
  Users,
  BookOpen,
} from "lucide-react";

const actions = [
  { label: "Add Student", icon: UserPlus, href: "/admin/students", color: "bg-blue-500" },
  { label: "New Registration", icon: FileText, href: "/admin/pipeline", color: "bg-emerald-500" },
  { label: "Create Event", icon: CalendarPlus, href: "/admin/events", color: "bg-purple-500" },
  { label: "New Task", icon: ClipboardPlus, href: "/admin/tasks", color: "bg-amber-500" },
  { label: "Create Invoice", icon: Receipt, href: "/admin/finance", color: "bg-[var(--color-burgundy)]" },
  { label: "Export Data", icon: Download, href: "/admin/reports", color: "bg-gray-500" },
  { label: "Manage Groups", icon: Users, href: "/admin/groups", color: "bg-teal-500" },
  { label: "Programs", icon: BookOpen, href: "/admin/programs", color: "bg-indigo-500" },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => router.push(action.href)}
          className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all group"
        >
          <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

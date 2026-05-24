"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UsersRound,
  ClipboardList,
  Trophy,
  FileText,
  Newspaper,
  Image,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Shield,
  Bell,
  CalendarDays,
  Clock,
  CalendarCheck,
  ClipboardCheck,
  Bot,
  ScrollText,
  Globe,
  KanbanSquare,
  Calendar,
  ListTodo,
  BarChart3,
  DollarSign,
  User,
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import NotificationBell from "./NotificationBell";

type Role = "admin" | "teacher" | "receptionist";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/students", label: "Students", icon: Users, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/programs", label: "Programs", icon: BookOpen, roles: ["admin", "receptionist"] as Role[] },
  { href: "/admin/groups", label: "Groups", icon: UsersRound, roles: ["admin", "teacher"] as Role[] },
  { href: "/admin/exams", label: "Exams", icon: ClipboardList, roles: ["admin", "teacher"] as Role[] },
  { href: "/admin/results", label: "Results", icon: Trophy, roles: ["admin", "teacher"] as Role[] },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["admin", "teacher"] as Role[] },
  { href: "/admin/registrations", label: "Registrations", icon: FileText, roles: ["admin", "receptionist"] as Role[] },
  { href: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare, roles: ["admin", "receptionist"] as Role[] },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, roles: ["admin", "receptionist"] as Role[] },
  { href: "/admin/timeslots", label: "Time Slots", icon: Clock, roles: ["admin"] as Role[] },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/events", label: "Events", icon: CalendarDays, roles: ["admin"] as Role[] },
  { href: "/admin/tasks", label: "Tasks", icon: ListTodo, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/finance", label: "Finance", icon: DollarSign, roles: ["admin"] as Role[] },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["admin"] as Role[] },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, roles: ["admin"] as Role[] },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, roles: ["admin"] as Role[] },
  { href: "/admin/gallery", label: "Gallery", icon: Image, roles: ["admin"] as Role[] },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, roles: ["admin"] as Role[] },
  { href: "/admin/chatbot", label: "Chatbot", icon: Bot, roles: ["admin"] as Role[] },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText, roles: ["admin"] as Role[] },
  { href: "/admin/users", label: "Users", icon: Shield, roles: ["admin"] as Role[] },
  { href: "/admin/profile", label: "Profile", icon: User, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/guide", label: "Guide", icon: BookOpen, roles: ["admin", "teacher", "receptionist"] as Role[] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] as Role[] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const userRole = ((session?.user as { role?: string })?.role || "admin") as Role;
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center px-4 py-5 border-b border-white/10">
        {collapsed ? (
          <NextImage
            src="/images/logo.png"
            alt="TLC"
            width={36}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        ) : (
          <NextImage
            src="/images/logo.png"
            alt="TLC by Andalusia Academy"
            width={160}
            height={44}
            className="h-10 w-auto object-contain brightness-0 invert"
          />
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-[var(--color-burgundy)] text-white shadow-lg shadow-[var(--color-burgundy)]/20"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <NotificationBell collapsed={collapsed} />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all w-full"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 flex-shrink-0 text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0 text-gray-400" />
          )}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-[var(--color-navy)] text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-navy)] lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[var(--color-navy)] transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[var(--color-navy)] border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>
    </>
  );
}

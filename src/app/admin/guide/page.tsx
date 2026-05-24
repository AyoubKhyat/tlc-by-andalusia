"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  UsersRound,
  ClipboardList,
  Trophy,
  ClipboardCheck,
  FileText,
  KanbanSquare,
  CalendarCheck,
  Clock,
  Calendar,
  CalendarDays,
  ListTodo,
  DollarSign,
  BarChart3,
  Newspaper,
  MessageSquareQuote,
  Image,
  HelpCircle,
  Bot,
  Shield,
  User,
  Settings,
  ScrollText,
  Bell,
  Search,
  Download,
  MessageSquare,
  Zap,
  Award,
  Lock,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: typeof BookOpen;
  color: string;
  description: string;
  steps: string[];
  tips?: string[];
  roles?: string[];
}

const sections: GuideSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    color: "bg-blue-500",
    description:
      "The dashboard is your home screen. It shows key statistics, charts, quick actions, and recent activity at a glance.",
    steps: [
      "View total students, active programs, new registrations, and upcoming exams in the stat cards at the top.",
      "Use the Quick Actions grid to jump to common tasks like adding a student, creating an invoice, or exporting data.",
      "Use the Global Search bar (top right) to find any student, program, event, or invoice instantly.",
      "Switch between time periods (7 days, 30 days, 90 days, 12 months) to filter the analytics charts.",
      "Review the Registrations Over Time, Program Distribution, Attendance Rate, Performance, Enrollment Trend, and Booking charts.",
      "Check Recent Registrations and Pass/Fail ratio at the bottom.",
    ],
    tips: [
      "The dashboard refreshes automatically when you navigate back to it.",
      "All stat cards link to their respective management pages.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "students",
    title: "Student Management",
    icon: Users,
    color: "bg-emerald-500",
    description:
      "Manage all enrolled students. Add, edit, search, and organize students by program, group, and status.",
    steps: [
      "Click 'Add Student' to register a new student. Fill in: first name, last name, date of birth, phone, parent phone, email, program, group, and level.",
      "Each student gets an auto-generated Student ID (e.g., TLC250001).",
      "Use the search bar to find students by name, ID, or email.",
      "Click the edit (pencil) icon on any student row to update their information.",
      "Click the delete (trash) icon to remove a student. This action is permanent.",
      "Use 'Bulk Actions' to select multiple students and change their status or delete them at once.",
    ],
    tips: [
      "Assign students to a program and group during registration for better organization.",
      "Student status can be: active, inactive, graduated, or suspended.",
      "The Notes panel (available on student detail) lets you add internal notes visible only to staff.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "programs",
    title: "Programs",
    icon: BookOpen,
    color: "bg-indigo-500",
    description:
      "Manage the language programs offered by TLC. Programs appear on the public website and are used to organize students and groups.",
    steps: [
      "Click 'Add Program' to create a new program. Fill in: title, description, age group, duration, levels, and objectives.",
      "Set a slug (URL-friendly name) for the program's public page.",
      "Upload an icon and cover image for the program.",
      "Use the 'Active' toggle to show/hide programs on the public website.",
      "Drag to reorder programs using the sort order field.",
    ],
    tips: [
      "Programs are the top-level organization. Groups belong to programs, and students are assigned to groups.",
      "Deactivating a program hides it from the public site but does not affect enrolled students.",
    ],
    roles: ["admin", "receptionist"],
  },
  {
    id: "groups",
    title: "Groups",
    icon: UsersRound,
    color: "bg-teal-500",
    description:
      "Groups are classes within a program. Each group has a teacher, schedule, capacity, and level.",
    steps: [
      "Click 'Add Group' to create a new group. Select the program, set a name (e.g., 'Kids A - Morning'), level, schedule, teacher, and capacity.",
      "Assign a teacher from the Users list to be responsible for the group.",
      "View the student count vs. capacity to see availability.",
      "Edit or delete groups as needed.",
    ],
    tips: [
      "When a group reaches capacity, consider creating a waiting list or a new group.",
      "Teachers can only see and manage groups assigned to them.",
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: "exams",
    title: "Exams",
    icon: ClipboardList,
    color: "bg-orange-500",
    description:
      "Create and manage exam sessions. An exam session is a scheduled exam for a specific program, group, and level.",
    steps: [
      "Click 'Add Exam' to schedule a new exam. Set the title, program, group (optional), level, date, and teacher.",
      "Exam status can be: upcoming, in_progress, or completed.",
      "After the exam, go to Results to enter student scores.",
    ],
    tips: [
      "Exams appear on the Admin Calendar automatically.",
      "You can create exams without assigning a group to test students across groups.",
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: "results",
    title: "Results & Certificates",
    icon: Trophy,
    color: "bg-yellow-500",
    description:
      "Enter and manage exam results. Students can check their results on the public website. Generate certificates for passing students.",
    steps: [
      "Select an exam session to view or enter results.",
      "For each student, enter: score, max score (default 100), and an optional teacher comment.",
      "The percentage and pass/fail status are calculated automatically.",
      "Click the certificate icon (Award) on a passing result to download a branded PDF certificate.",
      "Students can check their results on the public website at /results using their Student ID.",
    ],
    tips: [
      "Certificates are generated as A4 landscape PDFs with TLC branding.",
      "Only results with a passing score show the certificate download option.",
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: ClipboardCheck,
    color: "bg-green-500",
    description:
      "Track daily attendance for each group. Mark students as present, absent, or late.",
    steps: [
      "Select a group from the dropdown.",
      "Select a date (defaults to today).",
      "The student list for that group loads automatically.",
      "Click Present, Absent, or Late for each student.",
      "Add optional notes for individual students (e.g., 'Left early').",
      "Click 'Save Attendance' to record. If attendance for that group+date already exists, it updates.",
      "View attendance history and statistics in the stats section.",
    ],
    tips: [
      "Attendance rate appears on the main dashboard and in Reports.",
      "Teachers only see groups assigned to them.",
      "You can edit past attendance by selecting the date.",
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: "registrations",
    title: "Registrations",
    icon: FileText,
    color: "bg-pink-500",
    description:
      "View and manage incoming registration requests from the public website. Registrations come from the contact/registration form.",
    steps: [
      "New registrations appear with status 'new'.",
      "Click on a registration to view full details.",
      "Update the status: new, contacted, testing, enrolled, or rejected.",
      "Add admin notes for internal tracking.",
      "Use bulk actions to update or delete multiple registrations.",
      "Once a student is enrolled, create their Student record in Student Management.",
    ],
    tips: [
      "You receive a notification when a new registration comes in.",
      "The Pipeline page (see below) provides a Kanban board view of the same data.",
    ],
    roles: ["admin", "receptionist"],
  },
  {
    id: "pipeline",
    title: "Registration Pipeline",
    icon: KanbanSquare,
    color: "bg-violet-500",
    description:
      "A Kanban board view of all registrations, organized by status. Drag registrations through the enrollment funnel.",
    steps: [
      "View registrations organized in 5 columns: New, Contacted, Testing, Enrolled, Rejected.",
      "Each card shows the applicant name, phone, program interest, and submission date.",
      "Click the dropdown on a card to change its status (moves it to a different column).",
      "Click a card to open the detail modal with full information.",
      "Add or update admin notes in the detail modal.",
      "Use the search bar and program filter at the top to find specific registrations.",
      "The stats bar shows total applications, conversion rate, and counts.",
    ],
    tips: [
      "The conversion rate shows what percentage of applicants become enrolled students.",
      "Use this page for daily follow-ups with new applicants.",
    ],
    roles: ["admin", "receptionist"],
  },
  {
    id: "bookings",
    title: "Bookings",
    icon: CalendarCheck,
    color: "bg-cyan-500",
    description:
      "Manage appointment bookings (placement tests, consultations, etc.) made through the public website.",
    steps: [
      "View all bookings with visitor name, type, date/time, and status.",
      "Click on a booking to view details or update status.",
      "Status options: pending, confirmed, completed, cancelled.",
      "Add admin notes to bookings.",
    ],
    tips: [
      "Bookings are created by visitors on the public /booking page.",
      "You receive a notification when a new booking is made.",
      "Manage available time slots in the Time Slots page.",
    ],
    roles: ["admin", "receptionist"],
  },
  {
    id: "timeslots",
    title: "Time Slots",
    icon: Clock,
    color: "bg-gray-500",
    description:
      "Define available time slots for placement tests and consultations. These appear on the public booking page.",
    steps: [
      "Click 'Add Time Slot' to create availability.",
      "Set the date, start time, end time, type (placement_test, consultation, etc.), and capacity.",
      "Active slots appear on the public booking page. Inactive ones are hidden.",
      "Delete or deactivate past slots to keep the booking page clean.",
    ],
    tips: [
      "Set capacity to 1 for one-on-one sessions, or higher for group sessions.",
      "Slots automatically become unavailable when fully booked.",
    ],
    roles: ["admin"],
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: Calendar,
    color: "bg-rose-500",
    description:
      "A unified monthly calendar showing all events, exams, bookings, and attendance sessions in one view.",
    steps: [
      "Navigate between months using the arrow buttons.",
      "Click 'Today' to jump to the current date.",
      "Events are color-coded: burgundy = events, gold = exams, navy = bookings, green = attendance.",
      "Use the filter toggles at the top to show/hide specific event types.",
      "Click on a date to see all activities for that day in the side panel.",
    ],
    tips: [
      "The calendar pulls data from Events, Exams, Bookings, and Attendance automatically.",
      "Today's date is highlighted with a burgundy circle.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "events",
    title: "Events",
    icon: CalendarDays,
    color: "bg-amber-500",
    description:
      "Create and manage events (open days, workshops, holidays, etc.) that appear on the public website and admin calendar.",
    steps: [
      "Click 'Add Event' to create a new event.",
      "Fill in: title, description, date, end date (optional), time, location, and category.",
      "Categories: general, open_day, exam, enrollment, workshop, holiday.",
      "Toggle 'Active' to show/hide events on the public website.",
    ],
    tips: [
      "Events automatically appear on the public /events page and the admin Calendar.",
      "Use the holiday category for school breaks — these don't show on the public page.",
    ],
    roles: ["admin"],
  },
  {
    id: "tasks",
    title: "Tasks & Todos",
    icon: ListTodo,
    color: "bg-lime-500",
    description:
      "Internal task management with a Kanban board. Create tasks, assign priorities, set due dates, and track progress.",
    steps: [
      "Click 'Add Task' to create a new task.",
      "Set the title, description, priority (low/medium/high), due date, and status.",
      "Tasks are organized in 3 columns: Todo, In Progress, Done.",
      "Click the arrow buttons on a task card to move it between columns.",
      "Click a task to edit its details.",
      "Click the trash icon to delete a task.",
    ],
    tips: [
      "Use tasks for follow-up reminders, preparation checklists, or team assignments.",
      "High priority tasks show a red badge, medium shows yellow, low shows green.",
      "All staff roles can access and manage tasks.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "finance",
    title: "Finance & Invoicing",
    icon: DollarSign,
    color: "bg-emerald-600",
    description:
      "Manage invoices, record payments, and view financial summaries. Track revenue and outstanding balances.",
    steps: [
      "The page has 3 tabs: Summary, Invoices, and Payments.",
      "**Summary tab**: View total invoiced, collected, outstanding amounts, and a monthly revenue chart.",
      "**Invoices tab**: Click 'New Invoice' to create an invoice. Select the student, enter amount, description, due date, and notes.",
      "Invoice statuses update automatically: pending → partial (when partially paid) → paid (when fully paid).",
      "Click the credit card icon on an invoice to record a payment.",
      "Enter the payment amount, method (cash, check, bank transfer, card), and reference number.",
      "**Payments tab**: View all payment records across all invoices.",
      "Edit or delete invoices using the action buttons.",
    ],
    tips: [
      "When a payment equals or exceeds the invoice amount, the status automatically changes to 'paid'.",
      "Overdue invoices (past due date and unpaid) are flagged in the summary.",
      "Use the Reports page to generate financial reports and export to CSV.",
    ],
    roles: ["admin"],
  },
  {
    id: "reports",
    title: "Reports & Export",
    icon: BarChart3,
    color: "bg-sky-500",
    description:
      "Generate detailed reports with charts and export data as CSV files.",
    steps: [
      "Choose from 4 report types: Enrollment, Financial, Attendance, Performance.",
      "Click a report card to load and display the report with summary stats and charts.",
      "Each report shows relevant visualizations (bar charts, pie charts).",
      "Click 'Export CSV' to download the data as a spreadsheet-compatible file.",
      "Available exports: Students, Registrations, Invoices, Attendance records.",
    ],
    tips: [
      "CSV files can be opened in Excel, Google Sheets, or any spreadsheet application.",
      "Reports reflect real-time data from the database.",
      "Use the Enrollment report for program planning and the Financial report for accounting.",
    ],
    roles: ["admin"],
  },
  {
    id: "blog",
    title: "Blog",
    icon: Newspaper,
    color: "bg-purple-500",
    description:
      "Create and publish blog posts that appear on the public website.",
    steps: [
      "Click 'Add Post' to create a new blog post.",
      "Fill in: title, slug (auto-generated from title), excerpt, content, cover image URL, author, category, and tags.",
      "Toggle 'Published' to make the post visible on the public website.",
      "Set the publication date or leave it to auto-set when published.",
    ],
    tips: [
      "Blog posts support full text content. Use the excerpt for the preview card.",
      "Categories help organize posts: news, tips, events, etc.",
    ],
    roles: ["admin"],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    icon: MessageSquareQuote,
    color: "bg-pink-600",
    description: "Manage student/parent testimonials displayed on the public website.",
    steps: [
      "Click 'Add Testimonial' to add a new review.",
      "Enter: name, role (e.g., 'Parent', 'Student'), content, rating (1-5 stars), and image URL.",
      "Toggle 'Active' to show/hide on the public website.",
      "Reorder testimonials using the sort order field.",
    ],
    roles: ["admin"],
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: Image,
    color: "bg-fuchsia-500",
    description: "Manage the photo gallery displayed on the public website.",
    steps: [
      "Click 'Add Image' to upload a new gallery photo.",
      "Enter the image URL, caption, and category.",
      "Toggle 'Active' to show/hide images.",
      "Reorder images using the sort order field.",
    ],
    roles: ["admin"],
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    color: "bg-amber-600",
    description: "Manage frequently asked questions displayed on the public website.",
    steps: [
      "Click 'Add FAQ' to create a new question/answer pair.",
      "Enter the question, answer, and optional category.",
      "Toggle 'Active' to show/hide on the public website.",
      "Reorder FAQs using the sort order field.",
    ],
    roles: ["admin"],
  },
  {
    id: "chatbot",
    title: "Chatbot",
    icon: Bot,
    color: "bg-slate-600",
    description:
      "Manage the AI chatbot that appears on the public website. Add question/answer pairs with keywords for matching.",
    steps: [
      "Click 'Add Entry' to create a new chatbot Q&A.",
      "Enter: question, answer, keywords (comma-separated), and category.",
      "Keywords are used to match visitor questions — add variations and synonyms.",
      "Toggle 'Active' to enable/disable entries.",
      "The chatbot widget appears on all public pages as a floating button (bottom-right).",
    ],
    tips: [
      "Add common questions like 'What are your hours?', 'How much do courses cost?', 'Where are you located?'",
      "More keywords = better matching. Include Arabic and French terms if applicable.",
    ],
    roles: ["admin"],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    color: "bg-red-500",
    description:
      "View system notifications. Notifications are automatically created when key events happen.",
    steps: [
      "The bell icon in the sidebar shows unread notification count.",
      "Click the bell to see recent notifications in a dropdown.",
      "Click 'View All' to see the full notifications page.",
      "Click a notification to mark it as read.",
      "Use 'Mark All Read' to clear all unread notifications.",
    ],
    tips: [
      "Notifications are triggered by: new registrations, new bookings, and other system events.",
      "Notifications are per-user — each admin sees their own notifications.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "users",
    title: "User Management",
    icon: Shield,
    color: "bg-red-600",
    description:
      "Manage admin users and their roles. Only admins can access this page.",
    steps: [
      "Click 'Add User' to create a new admin account.",
      "Enter: name, email, password, and role.",
      "Roles: Admin (full access), Teacher (groups, attendance, grades), Receptionist (registrations, bookings, students read-only).",
      "Edit a user to change their name, role, or reset their password.",
      "Delete a user to remove their access.",
    ],
    tips: [
      "Create Teacher accounts for instructors who need to mark attendance and enter grades.",
      "Create Receptionist accounts for front desk staff who handle registrations and bookings.",
      "Each role only sees relevant sidebar items and can only access permitted pages.",
    ],
    roles: ["admin"],
  },
  {
    id: "profile",
    title: "Profile",
    icon: User,
    color: "bg-gray-600",
    description: "View and edit your own profile. Change your display name or password.",
    steps: [
      "View your account information: name, email, role, and member since date.",
      "Update your display name in the 'Edit Profile' section.",
      "Change your password in the 'Change Password' section. You must enter your current password first.",
      "The password strength indicator shows how strong your new password is.",
    ],
    tips: [
      "Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.",
      "Your email address cannot be changed from this page. Contact an admin.",
    ],
    roles: ["admin", "teacher", "receptionist"],
  },
  {
    id: "audit-log",
    title: "Audit Log",
    icon: ScrollText,
    color: "bg-stone-500",
    description:
      "View a complete history of all create, update, and delete actions performed in the admin panel.",
    steps: [
      "Browse the chronological log of all admin actions.",
      "Filter by entity type (student, event, invoice, etc.), action (create, update, delete), or user.",
      "Click 'Details' on any log entry to see the before/after data changes.",
      "Use pagination to navigate through older entries.",
    ],
    tips: [
      "The audit log is read-only — entries cannot be modified or deleted.",
      "Use this to investigate who changed what and when.",
    ],
    roles: ["admin"],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    color: "bg-neutral-500",
    description: "Configure site-wide settings like contact information, social media links, and other parameters.",
    steps: [
      "Edit key-value settings for the website.",
      "Common settings: phone number, email, address, social media URLs, opening hours.",
      "Changes take effect immediately on the public website.",
    ],
    roles: ["admin"],
  },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  receptionist: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function SectionCard({ section, isOpen, onToggle }: { section: GuideSection; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <section.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{section.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{section.description}</p>
        </div>
        {section.roles && (
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {section.roles.map((role) => (
              <span key={role} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColors[role]}`}>
                {role}
              </span>
            ))}
          </div>
        )}
        <div className="flex-shrink-0 text-gray-400">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-slate-800 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>

              {section.roles && (
                <div className="flex items-center gap-2 mb-4 sm:hidden">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Access:</span>
                  {section.roles.map((role) => (
                    <span key={role} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColors[role]}`}>
                      {role}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">How to use:</h4>
                <ol className="space-y-2">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {section.tips && section.tips.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Tips
                  </h4>
                  <ul className="space-y-1">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-amber-700 dark:text-amber-300/80 flex gap-2">
                        <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-amber-400" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GuidePage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(sections.map((s) => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  const filtered = sections.filter((s) => {
    if (roleFilter && (!s.roles || !s.roles.includes(roleFilter))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.steps.some((step) => step.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[var(--color-burgundy)] rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Guide</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Complete guide for using the TLC Admin Panel
            </p>
          </div>
        </div>
      </motion.div>

      {/* Role legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-400" />
          Role-Based Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Admin</p>
              <p className="text-xs text-red-600/70 dark:text-red-400/60">Full access to all features, settings, and user management.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Teacher</p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/60">Manage assigned groups, attendance, grades, and tasks.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
            <User className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Receptionist</p>
              <p className="text-xs text-green-600/70 dark:text-green-400/60">Handle registrations, bookings, view students and programs.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the guide..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]/20 focus:border-[var(--color-burgundy)]"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter || ""}
            onChange={(e) => setRoleFilter(e.target.value || null)}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-burgundy)]/20"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="receptionist">Receptionist</option>
          </select>
          <button
            onClick={expandAll}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Collapse
          </button>
        </div>
      </motion.div>

      {/* Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No sections match your search.</p>
          </div>
        ) : (
          filtered.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500"
      >
        <p>TLC by Andalusia Academy — Admin Panel v2.0</p>
        <p className="mt-1">For technical support, contact the system administrator.</p>
      </motion.div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import KeyboardShortcuts from "@/components/admin/KeyboardShortcuts";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import Breadcrumbs from "@/components/admin/Breadcrumbs";

export const metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | TLC Admin",
  },
  description: "TLC by Andalusia Academy - Administration Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Providers>
        {children}
      </Providers>
    );
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar />
        <KeyboardShortcuts />
        <main className="lg:pl-64 min-h-screen transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
      </div>
    </Providers>
  );
}

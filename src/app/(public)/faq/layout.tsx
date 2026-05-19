import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about TLC by Andalusia Academy — enrollment, programs, schedules, and more.",
  openGraph: {
    title: "FAQ | TLC by Andalusia Academy",
    description: "Find answers to common questions about our language programs.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

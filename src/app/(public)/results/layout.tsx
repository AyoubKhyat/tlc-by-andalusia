import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Results",
  description:
    "Check your exam results at TLC by Andalusia Academy. Enter your Student ID and date of birth to view your scores.",
  openGraph: {
    title: "Exam Results | TLC by Andalusia Academy",
    description: "Securely check your exam results online.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

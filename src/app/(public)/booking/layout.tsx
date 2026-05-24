import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Slot",
  description:
    "Schedule a placement test or consultation at TLC by Andalusia Academy in Marrakech. Choose an available time slot and book online.",
  openGraph: {
    title: "Book a Slot | TLC by Andalusia Academy",
    description:
      "Schedule a placement test or consultation at TLC Marrakech.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

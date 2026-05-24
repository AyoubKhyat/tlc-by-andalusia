import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "Stay informed about upcoming open days, exams, enrollment periods, and workshops at TLC by Andalusia Academy in Marrakech.",
  openGraph: {
    title: "Events & Calendar | TLC by Andalusia Academy",
    description:
      "Upcoming events, open days, and workshops at TLC Marrakech.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

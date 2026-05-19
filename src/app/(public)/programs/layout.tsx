import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore our English programs for Kids, Juniors, Teens & Adults. TOEFL, IELTS, TOEIC preparation. Italian, Arabic & French courses in Marrakech.",
  openGraph: {
    title: "Language Programs | TLC by Andalusia Academy",
    description: "English, Italian, Arabic & French programs for all ages and levels.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

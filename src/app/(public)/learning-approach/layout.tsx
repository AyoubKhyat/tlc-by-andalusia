import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Approach",
  description:
    "Discover our communicative, natural approach to language education at TLC by Andalusia Academy. Interactive, immersive learning in Marrakech.",
  openGraph: {
    title: "Learning Approach | TLC by Andalusia Academy",
    description: "Our communicative, natural approach to language education.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

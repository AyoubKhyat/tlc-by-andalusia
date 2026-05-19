import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Latest news, events, and language learning tips from TLC by Andalusia Academy in Marrakech.",
  openGraph: {
    title: "Blog & News | TLC by Andalusia Academy",
    description: "Stay updated with our latest news, events, and learning tips.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

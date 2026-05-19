import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TLC by Andalusia Academy — a premier language center in Marrakech dedicated to immersive, communicative language education for all ages.",
  openGraph: {
    title: "About TLC by Andalusia Academy",
    description: "A premier language center in Marrakech dedicated to immersive language education.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

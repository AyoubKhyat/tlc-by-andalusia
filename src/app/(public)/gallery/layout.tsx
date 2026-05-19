import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See life at TLC by Andalusia Academy — photos from our classes, events, and student activities in Marrakech.",
  openGraph: {
    title: "Gallery | TLC by Andalusia Academy",
    description: "A glimpse into our vibrant learning environment and community events.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

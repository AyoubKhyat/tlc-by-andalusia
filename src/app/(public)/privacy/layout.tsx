import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the privacy policy of TLC by Andalusia Academy. Learn how we collect, use, and protect your personal information.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

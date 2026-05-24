import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for TLC by Andalusia Academy language center in Marrakech.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

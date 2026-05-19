import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Register",
  description:
    "Register for language courses at TLC by Andalusia Academy in Marrakech. Contact us via form, WhatsApp, or phone.",
  openGraph: {
    title: "Contact & Register | TLC by Andalusia Academy",
    description: "Register for courses or get in touch with us in Marrakech.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

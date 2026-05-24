import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tlc-marrakech.com"),
  title: {
    default: "TLC by Andalusia Academy | English, The Natural Way",
    template: "%s | TLC by Andalusia Academy",
  },
  description:
    "The Language Center by Andalusia Academy in Marrakech. Premium English language education for Kids, Juniors, Teens & Adults. TOEFL, IELTS & TOEIC preparation. Italian, Arabic & French courses.",
  keywords: [
    "language center",
    "English courses",
    "Marrakech",
    "TOEFL",
    "IELTS",
    "TOEIC",
    "Andalusia Academy",
    "TLC",
    "learn English",
    "kids English",
    "Italian courses",
    "French courses",
  ],
  authors: [{ name: "TLC by Andalusia Academy" }],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "TLC by Andalusia Academy | English, The Natural Way",
    description:
      "Premium language education in Marrakech. English, Italian, Arabic & French for all ages.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1B2A4A",
                color: "#FDF6E9",
                borderRadius: "12px",
                border: "1px solid rgba(201, 168, 76, 0.2)",
              },
              success: {
                iconTheme: {
                  primary: "#C9A84C",
                  secondary: "#FDF6E9",
                },
              },
              error: {
                iconTheme: {
                  primary: "#7A1F3E",
                  secondary: "#FDF6E9",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/ui/BackToTop";

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: "TLC by Andalusia Academy",
  alternateName: "The Language Center by Andalusia Academy",
  description:
    "Premier language learning center in Marrakech offering English, Italian, Arabic and French courses for all ages.",
  url: "https://tlc-marrakech.com",
  telephone: "+212643434382",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Prestige Targa 1",
    addressLocality: "Marrakech",
    addressCountry: "MA",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61572399914166",
    "https://www.instagram.com/tlc_by_andalusia/",
    "https://www.tiktok.com/@tlc_by_andalusia",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "11:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "17:00",
      closes: "19:00",
    },
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-burgundy focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
      <BackToTop />
    </>
  );
}

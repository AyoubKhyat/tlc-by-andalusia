import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import WhyChooseTLC from "@/components/home/WhyChooseTLC";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactCTA from "@/components/home/ContactCTA";

export const metadata = {
  title: "TLC by Andalusia Academy - Master Languages, The Natural Way",
  description:
    "TLC by Andalusia Academy is a premier language center in Marrakech offering English, Arabic, French, and Italian programs for all ages. Learn the natural way.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <WhyChooseTLC />
      <ProgramsPreview />
      <StatsSection />
      <TestimonialsSection />
      <GalleryPreview />
      <ContactCTA />
    </>
  );
}

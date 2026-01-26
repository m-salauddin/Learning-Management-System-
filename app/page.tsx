import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  HeroSection,
  TechStackSection,
  FeaturesSection,
  CoursesSection,
  TerminalSection,
  PricingSection,
  TestimonialsSection,
  CTASection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TechStackSection />
        <FeaturesSection />
        <CoursesSection />
        <TerminalSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

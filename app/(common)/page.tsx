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

import { FloatingNav } from "@/components/FloatingNav";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <HeroSection />
      <TechStackSection />
      <FeaturesSection />
      <CoursesSection />
      <TerminalSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

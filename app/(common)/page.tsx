import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Best IT Training & Skill Development Platform",
  description: "Join Dokkhota IT to master Web Development, App Development, and AI. Rated #1 IT Training Center in Bangladesh with job placement support.",
};

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

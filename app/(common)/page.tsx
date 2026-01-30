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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dokkhota IT",
    "url": "https://dokkhotait.com",
    "logo": "https://dokkhotait.com/logo.png",
    "sameAs": [
      "https://facebook.com/dokkhotait",
      "https://twitter.com/dokkhotait",
      "https://linkedin.com/company/dokkhotait"
    ],
    "description": "Dokkhota IT is the premier IT training platform in Bangladesh offering courses in Web Development, App Development, and AI."
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FloatingNav />
      <HeroSection />
      <TechStackSection />
      <FeaturesSection />
      <CoursesSection />
      <TerminalSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}

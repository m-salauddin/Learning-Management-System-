import type { Metadata } from "next";
import {
    AboutHeroSection,
    AboutStatsSection,
    AboutMissionSection,
    AboutValuesSection,
    AboutTimelineSection,
    AboutTeamSection,
    AboutCommunitySection,
} from "@/components/sections/about";

export const metadata: Metadata = {
    title: "About Us - Dokkhota IT",
    description: "Learn about Dokkhota IT's mission to empower the next generation of tech leaders in Bangladesh through world-class IT training and mentorship.",
};

export default function AboutPage() {
    return (
        <main>
            <AboutHeroSection />
            <AboutStatsSection />
            <AboutMissionSection />
            <AboutValuesSection />
            <AboutTimelineSection />
            <AboutTeamSection />

            <AboutCommunitySection />
        </main>
    );
}

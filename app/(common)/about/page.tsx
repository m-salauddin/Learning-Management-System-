"use client";

import {
    AboutHeroSection,
    AboutStatsSection,
    AboutMissionSection,
    AboutValuesSection,
    AboutTimelineSection,
    AboutTeamSection,
    AboutCommunitySection,
} from "@/components/sections/about";

export default function AboutPage() {
    return (
        <>
            <AboutHeroSection />
            <AboutStatsSection />
            <AboutMissionSection />
            <AboutValuesSection />
            <AboutTimelineSection />
            <AboutTeamSection />

            <AboutCommunitySection />
        </>
    );
}

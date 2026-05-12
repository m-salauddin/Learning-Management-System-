import { getTranslations } from "next-intl/server";
import {
    AboutHeroSection,
    AboutStatsSection,
    AboutMissionSection,
    AboutValuesSection,
    AboutTimelineSection,
    AboutTeamSection,
    AboutCommunitySection,
} from "@/components/sections/about";

export async function generateMetadata() {
    const t = await getTranslations("Metadata");
    return {
        title: t("about.title"),
        description: t("about.description"),
    };
}
export default function AboutPage() {
    return (
        <main className="relative">
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

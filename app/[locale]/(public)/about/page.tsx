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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("about.title"),
        description: t("about.description"),
    };
}
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

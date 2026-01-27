import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | SkillSyncBD - Empowering the Next Generation of Developers",
    description: "Learn about SkillSyncBD's mission to transform tech education in Bangladesh. Join 50,000+ learners and become part of South Asia's leading tech education platform.",
    keywords: ["SkillSyncBD", "tech education", "Bangladesh", "coding bootcamp", "programming courses", "developer training"],
    openGraph: {
        title: "About Us | SkillSyncBD",
        description: "Empowering the next generation of developers in Bangladesh. Join 50,000+ learners on their journey to tech success.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | SkillSyncBD",
        description: "Empowering the next generation of developers in Bangladesh. Join 50,000+ learners on their journey to tech success.",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

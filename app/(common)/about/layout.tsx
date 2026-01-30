import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | DokkhotaIT - Empowering the Next Generation of Developers",
    description: "Learn about DokkhotaIT's mission to transform tech education in Bangladesh. Join 50,000+ learners and become part of South Asia's leading tech education platform.",
    keywords: ["DokkhotaIT", "tech education", "Bangladesh", "coding bootcamp", "programming courses", "developer training"],
    openGraph: {
        title: "About Us | DokkhotaIT",
        description: "Empowering the next generation of developers in Bangladesh. Join 50,000+ learners on their journey to tech success.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | DokkhotaIT",
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

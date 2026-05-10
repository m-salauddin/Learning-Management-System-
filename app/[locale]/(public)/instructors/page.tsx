import { getTranslations } from "next-intl/server";
import InstructorsClient from "./InstructorsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("instructors.title"),
        description: t("instructors.description"),
    };
}
export default function InstructorsPage() {
    return (
        <main>
            <InstructorsClient />
        </main>
    );
}

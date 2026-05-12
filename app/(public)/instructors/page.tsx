import { getTranslations } from "next-intl/server";
import InstructorsClient from "./InstructorsClient";

export async function generateMetadata() {
    const t = await getTranslations("Metadata");
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

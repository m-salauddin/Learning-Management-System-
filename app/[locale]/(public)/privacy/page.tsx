import { getTranslations } from "next-intl/server";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("privacy.title"),
        description: t("privacy.description"),
    };
}

export default async function PrivacyPage() {
    const t = await getTranslations("Privacy");

    const sections = [
        {
            icon: Database,
            title: t("sections.collection.title"),
            content: t("sections.collection.content"),
        },
        {
            icon: Eye,
            title: t("sections.usage.title"),
            content: t("sections.usage.content"),
        },
        {
            icon: Lock,
            title: t("sections.security.title"),
            content: t("sections.security.content"),
        },
        {
            icon: UserCheck,
            title: t("sections.rights.title"),
            content: t("sections.rights.content"),
        },
        {
            icon: Shield,
            title: t("sections.cookies.title"),
            content: t("sections.cookies.content"),
        },
        {
            icon: Mail,
            title: t("sections.contact.title"),
            content: t("sections.contact.content"),
        },
    ];

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{t("badge")}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        {t("lastUpdated")}
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="pb-24 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={index}
                                className="bg-card border border-border rounded-2xl p-6 md:p-8"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="grow">
                                        <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

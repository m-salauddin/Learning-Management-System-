import { getTranslations } from "next-intl/server";
import { FileText, Users, CreditCard, BookOpen, AlertTriangle, Scale } from "lucide-react";

export async function generateMetadata() {
    const t = await getTranslations("Metadata");
    return {
        title: t("terms.title"),
        description: t("terms.description"),
    };
}

export default async function TermsPage() {
    const t = await getTranslations("Terms");

    const sections = [
        {
            icon: Users,
            title: t("sections.account.title"),
            content: t("sections.account.content"),
        },
        {
            icon: BookOpen,
            title: t("sections.course.title"),
            content: t("sections.course.content"),
        },
        {
            icon: CreditCard,
            title: t("sections.payments.title"),
            content: t("sections.payments.content"),
        },
        {
            icon: FileText,
            title: t("sections.intellectual.title"),
            content: t("sections.intellectual.content"),
        },
        {
            icon: AlertTriangle,
            title: t("sections.conduct.title"),
            content: t("sections.conduct.content"),
        },
        {
            icon: Scale,
            title: t("sections.liability.title"),
            content: t("sections.liability.content"),
        },
    ];

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <FileText className="w-4 h-4 text-primary" />
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

                    {/* Contact Section */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
                        <h3 className="text-lg font-bold mb-2">{t("footer.title")}</h3>
                        <p className="text-muted-foreground mb-4">
                            {t("footer.description")}
                        </p>
                        <a
                            href="mailto:legal@dokkhotait.com"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            {t("footer.button")}
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

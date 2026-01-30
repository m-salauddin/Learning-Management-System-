import { Navbar } from "@/components/Navbar";
import { FileText, Users, CreditCard, BookOpen, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
    title: "Terms of Service",
    description: "Read the terms and conditions for using DokkhotaIT's platform and services.",
};

const sections = [
    {
        icon: Users,
        title: "Account Terms",
        content: `By creating an account on DokkhotaIT, you agree to the following:

• You must be at least 16 years old to use our services
• You are responsible for maintaining the security of your account credentials
• You must provide accurate and complete information during registration
• You may not share your account with others or transfer it to another person
• You are responsible for all activities that occur under your account
• We reserve the right to suspend or terminate accounts that violate these terms`,
    },
    {
        icon: BookOpen,
        title: "Course Access & Usage",
        content: `When you purchase or enroll in a course:

• You receive a personal, non-transferable license to access the course content
• Course access duration depends on the specific course terms (lifetime or limited)
• You may not share, redistribute, or resell course materials
• Downloaded materials are for personal use only
• We may update course content to keep it current and relevant
• Certificates are issued upon successful completion of course requirements`,
    },
    {
        icon: CreditCard,
        title: "Payments & Refunds",
        content: `Our payment and refund policies:

• All prices are displayed in BDT (Bangladeshi Taka) unless otherwise stated
• Payment is required before accessing paid course content
• We accept various payment methods including bKash, Nagad, and cards
• **Refund Policy**: Full refund available within 7 days of purchase if less than 30% of the course is completed
• Promotional prices and discounts cannot be applied retroactively
• We reserve the right to change prices with reasonable notice`,
    },
    {
        icon: FileText,
        title: "Intellectual Property",
        content: `Regarding content and intellectual property:

• All course content, materials, and platform design are owned by DokkhotaIT or our instructors
• You may not copy, modify, distribute, or create derivative works from our content
• Trademarks, logos, and brand elements are protected intellectual property
• User-generated content (comments, reviews) remains your property, but you grant us license to display it
• Reporting copyright infringement: contact legal@dokkhotait.com`,
    },
    {
        icon: AlertTriangle,
        title: "Prohibited Conduct",
        content: `You agree not to:

• Use the platform for any illegal purpose or in violation of any laws
• Share account credentials or allow unauthorized access
• Attempt to hack, reverse engineer, or compromise our systems
• Upload malicious code, viruses, or harmful content
• Harass, abuse, or harm other users or instructors
• Use automated tools to scrape or download content
• Misrepresent your identity or affiliation
• Engage in any activity that disrupts our services`,
    },
    {
        icon: Scale,
        title: "Limitation of Liability",
        content: `Important legal limitations:

• Our platform is provided "as is" without warranties of any kind
• We do not guarantee specific outcomes from taking our courses
• We are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount you paid for the specific service
• We are not responsible for third-party content or services linked from our platform
• Force majeure events may affect service availability

**Governing Law**: These terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.`,
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">


            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Legal Agreement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Please read these terms carefully before using DokkhotaIT. By accessing our platform, you agree to be bound by these terms.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        Last updated: January 27, 2026
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
                        <h3 className="text-lg font-bold mb-2">Questions About These Terms?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have any questions about these Terms of Service, please contact us.
                        </p>
                        <a
                            href="mailto:legal@dokkhotait.com"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            Contact Legal Team
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

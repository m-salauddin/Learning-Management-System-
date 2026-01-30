import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn how DokkhotaIT collects, uses, and protects your personal information.",
};

const sections = [
    {
        icon: Database,
        title: "Information We Collect",
        content: `We collect information you provide directly to us, such as when you create an account, enroll in a course, make a purchase, or contact us for support. This may include:

• **Personal Information**: Name, email address, phone number, and billing address
• **Account Data**: Username, password, and profile information
• **Payment Information**: Credit card details (processed securely through our payment providers)
• **Course Data**: Your progress, quiz scores, certificates, and learning history
• **Communication Data**: Messages, feedback, and support tickets`,
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Personalize your learning experience and recommend courses
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and abuse`,
    },
    {
        icon: Lock,
        title: "Data Security",
        content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• **Encryption**: All data transmitted between your browser and our servers is encrypted using SSL/TLS
• **Secure Storage**: Personal data is stored on secure servers with restricted access
• **Regular Audits**: We conduct regular security assessments and penetration testing
• **Access Controls**: Only authorized personnel have access to personal information`,
    },
    {
        icon: UserCheck,
        title: "Your Rights",
        content: `You have the following rights regarding your personal information:

• **Access**: Request a copy of the personal data we hold about you
• **Correction**: Request correction of any inaccurate or incomplete data
• **Deletion**: Request deletion of your personal data (subject to legal requirements)
• **Portability**: Request transfer of your data to another service provider
• **Withdrawal**: Withdraw consent for data processing at any time
• **Objection**: Object to processing of your personal data for certain purposes`,
    },
    {
        icon: Shield,
        title: "Cookies & Tracking",
        content: `We use cookies and similar tracking technologies to:

• Remember your preferences and settings
• Understand how you use our platform
• Provide personalized content and recommendations
• Analyze traffic and improve our services

You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.`,
    },
    {
        icon: Mail,
        title: "Contact Us",
        content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

• **Email**: privacy@dokkhotait.com
• **Address**: House 42, Road 11, Banani, Dhaka 1213, Bangladesh
• **Phone**: +880 1700-000000

We will respond to your inquiry within 30 business days.`,
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">


            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Your Privacy Matters</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        At DokkhotaIT, we are committed to protecting your privacy and ensuring the security of your personal information.
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
                </div>
            </section>
        </div>
    );
}

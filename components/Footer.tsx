import Link from "next/link";
import { Globe } from "lucide-react";
import { SiGit } from "react-icons/si";
import { Logo } from "@/components/ui/Logo";

const FOOTER_SECTIONS = [
    { title: "Platform", links: ["Courses", "Pricing", "Enterprise", "Blog"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
    { title: "Resources", links: ["Documentation", "Help Center", "Community", "Partners"] },
] as const;

const SOCIAL_ICONS = [Globe, SiGit] as const;

const LEGAL_LINKS = ["Privacy", "Terms", "Cookies"] as const;

export function Footer() {
    return (
        <footer className="border-t border-border py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                            Bangladesh's premier tech learning platform. Building the next generation of developers.
                        </p>
                        <div className="flex items-center gap-3">
                            {SOCIAL_ICONS.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                    aria-label={`Social link ${i + 1}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} SkillSyncBD. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        {LEGAL_LINKS.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="hover:text-foreground transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

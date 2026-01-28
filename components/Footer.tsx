import { Globe, ChevronRight } from "lucide-react";
import { SiGit } from "react-icons/si";
import { Logo } from "@/components/ui/Logo";

const FOOTER_SECTIONS = [
    {
        title: "Platform",
        links: [
            { text: "Courses", href: "/courses" },
            { text: "Pricing", href: "#" },
            { text: "Enterprise", href: "#" },
            { text: "Blog", href: "#" }
        ]
    },
    {
        title: "Company",
        links: [
            { text: "About", href: "/about" },
            { text: "Careers", href: "#" },
            { text: "Press", href: "#" },
            { text: "Contact", href: "/contact" }
        ]
    },
    {
        title: "Resources",
        links: [
            { text: "Documentation", href: "#" },
            { text: "Help Center", href: "#" },
            { text: "Community", href: "#" },
            { text: "Partners", href: "#" }
        ]
    },
] as const;

const SOCIAL_ICONS = [Globe, SiGit] as const;

const LEGAL_LINKS = [
    { text: "Privacy", href: "/privacy" },
    { text: "Terms", href: "/terms" },
    { text: "Cookies", href: "#" }
] as const;

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#020817] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
                    {/* Brand Column - Wider on desktop */}
                    <div className="col-span-2 lg:col-span-2">
                        <div className="mb-6">
                            <Logo />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Bangladesh's premier tech learning platform. Building the next generation of developers.
                        </p>
                        <div className="flex items-center gap-4">
                            {SOCIAL_ICONS.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                    aria-label={`Social link ${i + 1}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.title} className="col-span-1">
                            <h4 className="font-bold text-slate-100 mb-6">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.text}>
                                        <a
                                            href={link.href}
                                            className="group inline-flex items-center relative text-slate-400 hover:text-primary text-sm font-medium transition-colors"
                                        >
                                            <ChevronRight className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            <span className="group-hover:translate-x-2 transition-transform duration-300">
                                                {link.text}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} SkillSyncBD. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
                        {LEGAL_LINKS.map((link) => (
                            <a
                                key={link.text}
                                href={link.href}
                                className="hover:text-slate-300 transition-colors"
                            >
                                {link.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = ["Courses", "Features", "Pricing", "Community"] as const;

export function Navbar() {
    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl animate-fade-in-down">
            <div className="backdrop-blur-2xl backdrop-saturate-150 bg-background/85 border border-border/50 rounded-2xl px-8 py-4 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" aria-label="Home">
                        <Logo />
                    </Link>

                    {/* Nav Links - Center */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-all duration-200 shadow-lg">
                            Start Learning
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

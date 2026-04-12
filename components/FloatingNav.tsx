"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Sparkles, Library, CreditCard, Users } from "lucide-react";
const SECTIONS = [
    { id: "hero", label: "Home", icon: Home },
    { id: "features", label: "Features", icon: Sparkles },
    { id: "courses", label: "Courses", icon: Library },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "community", label: "Community", icon: Users },
] as const;
export function FloatingNav() {
    const [activeSection, setActiveSection] = useState<string>("hero");
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection("hero");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-50% 0px -50% 0px",
            }
        );
        SECTIONS.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });
        if (window.scrollY < 100) setActiveSection("hero");
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6">
            <div className="flex flex-col gap-[12px] p-3 rounded-full bg-white/60 dark:bg-slate-950/50 backdrop-blur-2xl border border-border shadow-xl shadow-black/5 dark:shadow-black/20 relative">
                {}
                <div
                    className="absolute z-0 w-10 h-10 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 ease-out"
                    style={{
                        top: `12px`,
                        transform: `translateY(${Math.max(0, SECTIONS.findIndex(s => s.id === activeSection)) * 52}px)`
                    }}
                />
                {SECTIONS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeSection === id;
                    return (
                        <a
                            key={id}
                            href={`#${id}`}
                            aria-label={label}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group relative z-10",
                                isActive
                                    ? "text-white dark:text-[#020615] scale-110"
                                    : "text-white/60 dark:text-white/40 hover:text-white hover:scale-110"
                            )}
                        >
                            <Icon strokeWidth={2.5} className="w-5 h-5 transition-transform" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

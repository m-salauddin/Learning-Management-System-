"use client";
import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Search, Menu, X } from "lucide-react";
import { SearchCommand } from "@/components/ui/SearchCommand";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle, ThemeToggleCompact } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { UserDropdown } from "@/components/ui/UserDropdown/UserDropdown";
import { useAppSelector } from "@/lib/store/hooks";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Skeleton } from "@/components/ui/skeleton";

const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
    const t = useTranslations("Navbar");
    return (
        <>
            <Link
                href="/login"
                className={cn(
                    "flex items-center px-4 h-10 rounded-full text-xs font-bold text-foreground border border-border/50 bg-muted/50 hover:bg-muted/80 transition-all duration-200 cursor-pointer",
                    isMobile ? "justify-center py-3 text-sm h-auto" : ""
                )}
            >
                {t("login")}
            </Link>
            <Link
                href="/register"
                className={cn(
                    "flex items-center gap-1.5 px-4 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all duration-200 shadow-lg cursor-pointer",
                    isMobile && "justify-center py-3 text-sm h-auto"
                )}
            >
                {t("register")}
                <ArrowRight className="w-3 h-3" />
            </Link>
        </>
    );
};

const AuthSkeleton = () => (
    <div className="p-1 rounded-full border border-border/50 bg-muted/20">
        <Skeleton className="w-8 h-8 rounded-full" />
    </div>
);
export function Navbar() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const navRef = useRef<HTMLDivElement>(null);
    const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });

    const navItems = [
        { name: t("home"), href: "/" },
        { name: t("courses"), href: "/courses" },
        { name: t("instructors"), href: "/instructors" },
        { name: t("about"), href: "/about" },
    ];


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const updateRect = () => {
            const activeItem = navRef.current?.querySelector('[data-active="true"]') as HTMLElement;
            if (activeItem) {
                setActiveRect({
                    left: activeItem.offsetLeft,
                    width: activeItem.offsetWidth,
                });
            } else {
                setActiveRect({ left: 0, width: 0 });
            }
        };
        updateRect();
        window.addEventListener('resize', updateRect);
        return () => window.removeEventListener('resize', updateRect);
    }, [pathname]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);
    useEffect(() => {
        if (isMobileMenuOpen || isSearchOpen) {
            document.body.classList.add("nav-open");
        } else {
            document.body.classList.remove("nav-open");
        }
        return () => {
            document.body.classList.remove("nav-open");
        };
    }, [isMobileMenuOpen, isSearchOpen]);
    return (
        <nav
            suppressHydrationWarning
            className="fixed top-4 left-0 right-0 mx-auto z-100 w-[95%] max-w-7xl"
        >
            <div className="isolate bg-white/60 dark:bg-slate-950/50 backdrop-blur-3xl border border-border rounded-2xl px-4 xl:px-8 py-3 xl:py-4 shadow-xl shadow-black/5 dark:shadow-black/40">
                <div className="flex items-center justify-between">
                    <Link href="/" aria-label="Home" className="shrink-0">
                        <Logo className="scale-[0.8] origin-left sm:scale-100" textClassName="hidden sm:flex" />
                    </Link>
                    <div className="hidden min-[1150px]:flex flex-1 justify-center">
                        <div ref={navRef} className="flex items-center gap-1 relative">

                            <motion.div
                                className="absolute bg-primary rounded-lg z-0"
                                initial={false}
                                animate={{
                                    x: activeRect.left,
                                    width: activeRect.width,
                                    opacity: activeRect.width > 0 ? 1 : 0
                                }}
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                style={{ height: 'calc(100% - 2px)', top: '0px' }}
                            />
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        data-active={isActive}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-bold transition-all duration-300 cursor-pointer rounded-lg z-10",
                                            isActive
                                                ? "text-white dark:text-[#020615]"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end shrink-0">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden min-[1300px]:flex items-center gap-2 h-10 px-3 rounded-full bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all duration-200 group w-[240px] cursor-pointer"
                        >
                            <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors line-clamp-1">{t("search")}</span>
                            <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-0.5 rounded-lg border border-border/20 bg-primary px-1.5 font-mono text-[10px] font-bold text-white dark:text-[#020615] ml-auto opacity-100 transition-colors">
                                <span className="text-[11px]">⌘</span>K
                            </kbd>
                        </button>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex min-[1300px]:hidden items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-muted/50 border border-border/50 hover:bg-muted/80 cursor-pointer"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <div className="hidden min-[640px]:block shrink-0">
                            <LocaleSwitcher />
                        </div>
                        <div className="hidden sm:block shrink-0">
                            <ThemeToggle />
                        </div>

                        <div className="sm:hidden shrink-0">
                            <ThemeToggleCompact />
                        </div>
                        <div className="shrink-0 flex items-center">
                            {!mounted ? (
                                <AuthSkeleton />
                            ) : isLoading ? (
                                <AuthSkeleton />
                            ) : user ? (
                                <UserDropdown
                                    user={user}
                                    onOpen={() => setIsMobileMenuOpen(false)}
                                />
                            ) : (
                                <div className="hidden min-[1150px]:flex items-center gap-2">
                                    <AuthButtons />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="min-[1150px]:hidden flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-muted/50 border border-border/50 hover:bg-muted/80 cursor-pointer"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] max-w-72 p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-border rounded-[2rem] shadow-2xl origin-top-right flex flex-col gap-4 overflow-hidden z-[200]"
                        >
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={(e) => isActive && e.preventDefault()}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                            {!user && (
                                <div className="flex cursor-pointer min-[1150px]:hidden flex-col gap-3 pt-4 border-t border-border/50">
                                    <AuthButtons isMobile />
                                </div>
                            )}
                            <div className="flex flex-col gap-3 pt-4 border-t border-border/50 min-[640px]:hidden">
                                <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {t("language")}
                                </div>
                                <div className="px-2">
                                    <LocaleSwitcher />
                                </div>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}

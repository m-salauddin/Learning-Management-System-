import Link from "next/link";
import {
    LayoutDashboard,
    BookOpen,
    Award,
    User,
    Settings
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const SIDEBAR_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/certificates", label: "Certificates", icon: Award },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar - Slim Glassmorphic */}
            <aside className="w-20 border-r border-border/50 bg-background/30 backdrop-blur-xl hidden md:flex flex-col items-center py-6 gap-8 z-50">
                <Link href="/" className="flex items-center justify-center hover:scale-105 transition-transform">
                    <Logo size="sm" showText={false} />
                </Link>

                <nav className="flex-1 w-full flex flex-col items-center gap-4 px-2">
                    {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-sm font-medium rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap border shadow-lg pointer-events-none z-50">
                                {label}
                                {/* Arrow */}
                                <span className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-popover" />
                            </span>

                            <Icon strokeWidth={2} className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </Link>
                    ))}
                </nav>

                <div className="flex flex-col items-center gap-4 px-2">
                    <ThemeToggle />
                    <Link
                        href="/settings"
                        className="group relative flex items-center justify-center w-12 h-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                        <Settings strokeWidth={2} className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Gradients for Dashboard */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10 pointer-events-none" />

                {/* Header */}
                <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm z-40">
                    <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-lg tracking-tight">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
                            U
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

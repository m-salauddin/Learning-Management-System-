
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "solid";
    icon?: LucideIcon;
    iconClassName?: string;
}

export function Badge({
    children,
    className,
    variant = "default",
    icon: Icon,
    iconClassName,
}: BadgeProps) {
    const variants = {
        default: "bg-primary/5 border border-primary/20 text-primary",
        outline: "bg-transparent border border-border text-foreground hover:bg-muted",
        solid: "bg-primary text-primary-foreground hover:bg-primary/90",
    };

    return (
        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors", variants[variant], className)}>
            {Icon && <Icon className={cn("w-4 h-4", iconClassName)} />}
            {children}
        </div>
    );
}

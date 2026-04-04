import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepHeaderProps {
    phase: string;
    title: string;
    highlight: string;
    description: string;
    icon: LucideIcon;
    color: "blue" | "emerald" | "amber" | "indigo" | "violet";
}

const colorMap = {
    blue: {
        text: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        shadow: "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        bullet: "bg-blue-500",
        gradient: "from-blue-500/20 to-blue-500/5",
        blur: "bg-blue-500/10"
    },
    emerald: {
        text: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        shadow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        bullet: "bg-emerald-500",
        gradient: "from-emerald-500/20 to-emerald-500/5",
        blur: "bg-emerald-500/10"
    },
    amber: {
        text: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        shadow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        bullet: "bg-amber-500",
        gradient: "from-amber-500/20 to-amber-500/5",
        blur: "bg-amber-500/10"
    },
    indigo: {
        text: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        shadow: "shadow-[0_0_8px_rgba(99,102,241,0.5)]",
        bullet: "bg-indigo-500",
        gradient: "from-indigo-500/20 to-indigo-500/5",
        blur: "bg-indigo-500/10"
    },
    violet: {
        text: "text-violet-500",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        shadow: "shadow-[0_0_8px_rgba(139,92,246,0.5)]",
        bullet: "bg-violet-500",
        gradient: "from-violet-500/20 to-violet-500/5",
        blur: "bg-violet-500/10"
    }
};

export const StepHeader = ({ phase, title, highlight, description, icon: Icon, color }: StepHeaderProps) => {
    const c = colorMap[color];
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group overflow-hidden p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl dark:shadow-2xl"
        >
            <div className={cn("absolute top-0 right-0 w-80 h-80 blur-[100px] -mr-40 -mt-40 rounded-full transition-all duration-700 opacity-60 group-hover:opacity-100", c.blur)} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                    <div className={cn("inline-flex items-center gap-2.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]", c.bg, c.border, c.text)}>
                        <span className={cn("w-1 h-1 rounded-full", c.bullet, c.shadow)} />
                        Phase {phase}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        The <span className={c.text}>{highlight}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-white/40 text-[11px] max-w-lg font-medium leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl border flex items-center justify-center shadow-2xl backdrop-blur-md shrink-0 transition-transform duration-500 group-hover:scale-110", c.text, c.bg, c.border, "dark:bg-linear-to-br dark:" + c.gradient)}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
};

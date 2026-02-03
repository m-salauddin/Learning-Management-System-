import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold border",
            status === 'published' || status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "",
            (status === 'draft' || status === 'pending' || status === 'inactive') ? "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400" : "",
            (status === 'archived' || status === 'suspended') ? "bg-red-500/10 text-red-600 border-red-500/20" : "",
            status === 'pending_review' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""
        )}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 'Unknown'}
        </span>
    );
}

export function LevelBadge({ level }: { level: string }) {
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            level === 'beginner' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "",
            level === 'intermediate' ? "bg-violet-500/10 text-violet-600 border-violet-500/20" : "",
            level === 'advanced' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : ""
        )}>
            {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Unknown'}
        </span>
    );
}

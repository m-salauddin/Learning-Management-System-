import { cn } from "@/lib/utils";
export function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all",
            (s === 'published' || s === 'active') && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/10",
            (s === 'draft' || s === 'pending' || s === 'inactive') && "bg-slate-500/20 text-slate-300 border-slate-500/30 ring-1 ring-slate-500/10",
            (s === 'archived' || s === 'suspended') && "bg-red-500/20 text-red-400 border-red-500/30 ring-1 ring-red-500/10",
            s === 'pending_review' && "bg-amber-500/20 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/10"
        )}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 'Unknown'}
        </span>
    );
}
export function LevelBadge({ level }: { level: string }) {
    const l = level?.toLowerCase();
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all",
            l === 'beginner' && "bg-sky-500/20 text-sky-400 border-sky-500/30 ring-1 ring-sky-500/10",
            l === 'intermediate' && "bg-violet-500/20 text-violet-400 border-violet-500/30 ring-1 ring-violet-500/10",
            l === 'advanced' && "bg-rose-500/20 text-rose-400 border-rose-500/30 ring-1 ring-rose-500/10"
        )}>
            {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Unknown'}
        </span>
    );
}

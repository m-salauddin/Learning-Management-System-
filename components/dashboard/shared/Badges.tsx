import { cn } from "@/lib/utils";
import { Shield, User, GraduationCap } from "lucide-react";

// ─── StatusBadge ────────────────────────────────────────────────────────────
// Supports: published, active, draft, pending, inactive, archived, suspended,
//           pending_review, expired, completed
export function StatusBadge({ status }: { status?: string }) {
    const s = status?.toLowerCase() || 'active';
    const hasDot = ['active', 'suspended', 'pending', 'expired'].includes(s);
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all",
            (s === 'published' || s === 'active') && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/10",
            (s === 'draft' || s === 'inactive') && "bg-slate-500/20 text-slate-300 border-slate-500/30 ring-1 ring-slate-500/10",
            (s === 'archived' || s === 'suspended' || s === 'expired') && "bg-red-500/20 text-red-400 border-red-500/30 ring-1 ring-red-500/10",
            (s === 'pending' || s === 'pending_review') && "bg-amber-500/20 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/10",
            s === 'completed' && "bg-blue-500/20 text-blue-400 border-blue-500/30 ring-1 ring-blue-500/10",
        )}>
            {hasDot && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    (s === 'active') && "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]",
                    (s === 'suspended' || s === 'expired') && "bg-red-400",
                    s === 'pending' && "bg-amber-400 animate-pulse",
                )} />
            )}
            {status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : 'Unknown'}
        </span>
    );
}

// ─── LevelBadge ─────────────────────────────────────────────────────────────
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

// ─── RoleBadge ──────────────────────────────────────────────────────────────
export function RoleBadge({ role }: { role?: string }) {
    const r = role?.toLowerCase() || 'student';
    const Icon = r === 'admin' ? Shield : r === 'teacher' ? GraduationCap : User;
    return (
        <span className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xs transition-all",
            r === 'admin' && "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5",
            r === 'teacher' && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-indigo-500/5",
            r === 'student' && "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5",
        )}>
            <Icon className="w-3 h-3" />
            {role || 'student'}
        </span>
    );
}

// ─── TypeBadge ──────────────────────────────────────────────────────────────
// For percentage/fixed discount or coupon types
export function TypeBadge({ type, value }: { type: 'percentage' | 'fixed'; value: number }) {
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all",
            type === 'percentage'
                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        )}>
            {type === 'percentage' ? `${value}% OFF` : `৳${value} OFF`}
        </span>
    );
}

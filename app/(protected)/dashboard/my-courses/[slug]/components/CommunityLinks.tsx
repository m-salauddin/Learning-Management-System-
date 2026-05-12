"use client";
import { ArrowUpRight, Facebook, MessageCircle } from "lucide-react";

interface Props {
    facebookUrl: string | null;
    whatsappUrl: string | null;
}

export function CommunityLinks({ facebookUrl, whatsappUrl }: Props) {
    if (!facebookUrl && !whatsappUrl) return null;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/6 rounded-2xl hover:border-blue-300 dark:hover:border-blue-500/20 transition-all group cursor-pointer hover:shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                        <Facebook className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">Facebook Group</p>
                        <p className="text-[10px] text-slate-400">Join the community</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </a>
            )}
            {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/6 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-500/20 transition-all group cursor-pointer hover:shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">WhatsApp Group</p>
                        <p className="text-[10px] text-slate-400">Live support channel</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                </a>
            )}
        </div>
    );
}

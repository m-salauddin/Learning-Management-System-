import { LucideIcon, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DropdownAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning' | 'primary' | 'info';
}

interface ActionDropdownProps {
    title?: string;
    actions: DropdownAction[];
    id: string; 
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    className?: string;
}


export const ActionDropdown = ({
    title = "Controls",
    actions,
    id,
    activeId,
    setActiveId,
    className
}: ActionDropdownProps) => {
    const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; left: number; isTop: boolean }>({ top: 0, left: 0, isTop: false });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeId === id) {
            setActiveId(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        
        const menuWidth = 180;
        let left = rect.right - menuWidth;
        
        
        if (left < 10) left = 10;

        if (spaceBelow < 250 && spaceAbove > spaceBelow) {
            setMenuPos({
                bottom: window.innerHeight - rect.top + 8,
                left,
                isTop: true
            });
        } else {
            setMenuPos({
                top: rect.bottom + 8,
                left,
                isTop: false
            });
        }
        
        setActiveId(id);
    }, [id, activeId, setActiveId]);

    
    useEffect(() => {
        if (activeId !== id) return;

        const handleClose = () => setActiveId(null);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveId(null);
        };

        window.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeId, id, setActiveId]);

    const isOpen = activeId === id;

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <button 
                ref={triggerRef}
                onClick={handleToggle}
                className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-lg border transition-all duration-300",
                    isOpen 
                        ? "bg-slate-900 text-white border-white/20 shadow-lg scale-95" 
                        : "bg-background border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm"
                )}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9998] bg-black/5" 
                            onClick={() => setActiveId(null)} 
                        />
                        
                        {}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: menuPos.isTop ? 10 : -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: menuPos.isTop ? 10 : -10 }}
                            transition={{ type: "spring", damping: 20, stiffness: 350 }}
                            style={{ 
                                ...(menuPos.isTop ? { bottom: menuPos.bottom } : { top: menuPos.top }), 
                                left: menuPos.left,
                                transformOrigin: menuPos.isTop ? "bottom right" : "top right"
                            }}
                            className="fixed w-[180px] bg-slate-950/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[9999] overflow-hidden ring-1 ring-white/10"
                        >
                            <div className="px-4 py-2 border-b border-white/5 bg-white/5">
                                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 leading-none">
                                    {title}
                                </p>
                            </div>

                            <div className="p-1 space-y-0.5">
                                {actions.map((action, idx) => (
                                    <div key={idx}>
                                        {idx === actions.length - 1 && actions.length > 1 && (
                                            <div className="h-px bg-white/5 my-1 mx-1.5" />
                                        )}
                                        <button
                                            onClick={() => {
                                                action.onClick();
                                                setActiveId(null);
                                            }}
                                            className={cn(
                                                "w-full px-2 py-1.5 flex items-center gap-2.5 rounded-xl transition-all group relative overflow-hidden",
                                                action.variant === 'danger' ? "hover:bg-rose-500/10 text-rose-500/80" :
                                                action.variant === 'success' ? "hover:bg-emerald-500/10 text-emerald-500/80" :
                                                action.variant === 'warning' ? "hover:bg-orange-500/10 text-orange-400/80" :
                                                action.variant === 'primary' ? "hover:bg-primary/10 text-primary/80" :
                                                action.variant === 'info' ? "hover:bg-blue-500/10 text-blue-400/80" :
                                                "hover:bg-white/5 text-slate-400 hover:text-white"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shadow-inner shrink-0",
                                                action.variant === 'danger' ? "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20" :
                                                action.variant === 'success' ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20" :
                                                action.variant === 'warning' ? "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20" :
                                                action.variant === 'primary' ? "bg-primary/10 text-primary group-hover:bg-primary/20" :
                                                action.variant === 'info' ? "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20" :
                                                "bg-white/5 text-slate-500 group-hover:bg-white/10"
                                            )}>
                                                <action.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase tracking-wider transition-colors",
                                                action.variant === 'danger' ? "group-hover:text-rose-500" :
                                                action.variant === 'success' ? "group-hover:text-emerald-500" :
                                                action.variant === 'warning' ? "group-hover:text-orange-500" :
                                                action.variant === 'primary' ? "group-hover:text-primary" :
                                                action.variant === 'info' ? "group-hover:text-blue-500" :
                                                "group-hover:text-white"
                                            )}>
                                                {action.label}
                                            </span>
                                            
                                            {}
                                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 pointer-events-none" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

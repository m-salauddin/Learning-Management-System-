import React, { useMemo } from 'react';
import { Rocket, Layers, Award, Target, LucideIcon } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

interface CourseLevelBadgeProps {
    level: string;
    className?: string;
    compact?: boolean;
}

const levelConfigs: Record<string, { icon: LucideIcon; label: string; color: string }> = {
    beginner: { 
        icon: Rocket, 
        label: 'Beginner', 
        color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" 
    },
    intermediate: { 
        icon: Layers, 
        label: 'Intermediate', 
        color: "border-amber-500/40 bg-amber-500/10 text-amber-400" 
    },
    advanced: { 
        icon: Award, 
        label: 'Advanced', 
        color: "border-rose-500/40 bg-rose-500/10 text-rose-400" 
    },
};

export const CourseLevelBadge: React.FC<CourseLevelBadgeProps> = ({ level, className, compact = true }) => {
    const config = useMemo(() => {
        const key = level?.toLowerCase().trim() || '';
        if (key.includes('beginner')) return levelConfigs.beginner;
        if (key.includes('intermediate')) return levelConfigs.intermediate;
        if (key.includes('advanced')) return levelConfigs.advanced;
        
        return { 
            icon: Target, 
            label: level || 'All Levels', 
            color: "border-primary/40 bg-primary/10 text-primary" 
        };
    }, [level]);

    return (
        <Badge
            icon={config.icon}
            className={cn(
                "uppercase tracking-widest border rounded-full font-bold",
                compact ? "px-2.5 py-0.5 text-[10px]" : "px-4 py-1.5 text-[11px]",
                config.color,
                className
            )}
        >
            {config.label}
        </Badge>
    );
};

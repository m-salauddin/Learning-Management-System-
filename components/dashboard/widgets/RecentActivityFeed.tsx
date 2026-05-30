import { cn } from "@/lib/utils"
import { UserPlus, BookOpen, CreditCard, MessageSquare, HelpCircle, Clock } from "lucide-react"
import { motion } from "motion/react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
}

const getIconConfig = (type: string) => {
    switch (type) {
        case 'user':
            return { icon: UserPlus, bg: "bg-emerald-500/10", color: "text-emerald-500" };
        case 'enrollment':
            return { icon: BookOpen, bg: "bg-blue-500/10", color: "text-blue-500" };
        case 'payment':
            return { icon: CreditCard, bg: "bg-purple-500/10", color: "text-purple-500" };
        default:
            return { icon: HelpCircle, bg: "bg-muted/10", color: "text-muted-foreground" };
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
}

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -30,
        y: 10
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 24
        }
    }
}

export function RecentActivityFeed({ activities }: { activities: Activity[] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {activities.map((activity, index) => {
                const config = getIconConfig(activity.type);
                return (
                    <motion.div
                        key={activity.id}
                        variants={itemVariants}
                        className="relative flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group overflow-hidden"
                        whileHover={{
                            scale: 1.01,
                            x: 4,
                            transition: { duration: 0.2 }
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        <motion.div
                            className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10",
                                config.bg
                            )}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: index * 0.08 + 0.15,
                                type: "spring",
                                stiffness: 400,
                                damping: 15
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <config.icon className={cn("w-4 h-4", config.color)} />
                        </motion.div>
                        <div className="flex-1 min-w-0 space-y-0.5 z-10">
                            <motion.p
                                className="text-sm font-bold truncate"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 + 0.2 }}
                            >
                                {activity.title}
                            </motion.p>
                            <motion.p
                                className="text-xs text-muted-foreground truncate"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 + 0.25 }}
                            >
                                {activity.description}
                            </motion.p>
                        </div>
                        <motion.span
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 shrink-0 z-10 whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.08 + 0.3 }}
                        >
                            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </motion.span>
                    </motion.div>
                );
            })}
        </motion.div>
    )
}

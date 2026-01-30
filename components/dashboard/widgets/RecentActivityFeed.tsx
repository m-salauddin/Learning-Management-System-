"use client"

import { cn } from "@/lib/utils"
import { UserPlus, BookOpen, CreditCard, MessageSquare} from "lucide-react"
import { motion } from "motion/react"

const activities = [
    {
        id: 1,
        type: "user_signup",
        message: "New user registered",
        user: "Ahmed Hassan",
        time: "2 min ago",
        icon: UserPlus,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-500"
    },
    {
        id: 2,
        type: "course_enrolled",
        message: "Enrolled in Web Development",
        user: "Fatima Khan",
        time: "5 min ago",
        icon: BookOpen,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500"
    },
    {
        id: 3,
        type: "payment",
        message: "Payment received ৳2,500",
        user: "Mohammed Ali",
        time: "12 min ago",
        icon: CreditCard,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-500"
    },
    {
        id: 4,
        type: "review",
        message: "Left a 5-star review",
        user: "Ayesha Begum",
        time: "28 min ago",
        icon: MessageSquare,
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-500"
    },
    {
        id: 5,
        type: "user_signup",
        message: "New user registered",
        user: "Karim Rahman",
        time: "45 min ago",
        icon: UserPlus,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-500"
    },
    {
        id: 6,
        type: "course_enrolled",
        message: "Enrolled in Python Course",
        user: "Nasrin Akter",
        time: "1 hour ago",
        icon: BookOpen,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500"
    },
]

// Animation variants
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

export function RecentActivityFeed() {
    return (
        <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {activities.map((activity, index) => (
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
                    {/* Subtle pulse effect on hover */}
                    <motion.div 
                        className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />

                    <motion.div 
                        className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10",
                            activity.iconBg
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
                        <activity.icon className={cn("w-4 h-4", activity.iconColor)} />
                    </motion.div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5 z-10">
                        <motion.p 
                            className="text-sm font-medium truncate"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 + 0.2 }}
                        >
                            {activity.user}
                        </motion.p>
                        <motion.p 
                            className="text-xs text-muted-foreground truncate"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 + 0.25 }}
                        >
                            {activity.message}
                        </motion.p>
                    </div>
                    
                    <motion.span 
                        className="text-xs text-muted-foreground shrink-0 z-10 whitespace-nowrap"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                    >
                        {activity.time}
                    </motion.span>
                </motion.div>
            ))}
        </motion.div>
    )
}
